// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/ContractERC20.sol";
import "../src/TicketingSystem.sol";
import "../src/ContractExchange.sol";

contract ContractExchangeTest is Test {
    ContractERC20 public token;
    TicketingSystem public ticketingSystem;
    ContractExchange public exchange;

    address public buyer = address(0x123);
    address public newBuyer = address(0x456);
    address public artist = address(0x789);

    function setUp() public {
        // Deploy the token & TicketingSystem
        token = new ContractERC20(1_000_000 ether);
        ticketingSystem = new TicketingSystem();

        // Deploy the exchange
        exchange = new ContractExchange(address(token), address(ticketingSystem));

        // Approve the exchange for initialSupply
        uint256 initialSupply = 10_000 ether;
        token.approve(address(exchange), initialSupply);

        // Log exchange address
        emit log_named_address("Address of Exchange contract", address(exchange));

        // Initialize the exchange
        exchange.initialize(initialSupply);

        // Log the allowance
        emit log_named_uint(
            "Allowance for Exchange contract",
            token.allowance(address(this), address(exchange))
        );

        // Verify the balance of the exchange
        emit log_named_uint(
            "Token balance of Exchange contract",
            token.balanceOf(address(exchange))
        );
        assertEq(token.balanceOf(address(exchange)), initialSupply, "Initial transfer failed.");

        // Transfer ERC20 tokens to buyers
        token.transfer(buyer, 500_000 ether);
        token.transfer(newBuyer, 500 ether);

        emit log_named_uint("Buyer token balance", token.balanceOf(buyer));
        emit log_named_uint("New buyer token balance", token.balanceOf(newBuyer));

        // Approve the contract in TicketingSystem
        ticketingSystem.approveContract(address(exchange));

        // Create an artist, a venue, and a concert
        vm.prank(artist);
        ticketingSystem.createArtist("Artist1", 1);

        vm.prank(artist);
        ticketingSystem.createVenue("Venue1", 500, 10);

        vm.prank(artist);
        ticketingSystem.createConcert(1, 1, block.timestamp + 1 days, 100 ether);

        // Validate the concert
        vm.prank(artist);
        ticketingSystem.validateConcert(1);
    }

    function testBuyTicketWithERC20() public {
        uint256 ticketPriceInWei = 100 ether; // Ticket price in Wei
        uint256 tokenPrice = ticketPriceInWei * 3400; // Correctly scaled token price

        // Approve the contract to spend ERC20 tokens
        vm.prank(buyer);
        token.approve(address(exchange), tokenPrice);

        // Log configuration
        emit log_named_uint("Buyer token balance before purchase", token.balanceOf(buyer));
        emit log_named_uint("Token price for ticket", tokenPrice);
        emit log_named_uint("Allowance before purchase", token.allowance(buyer, address(exchange)));

        // Buyer pays for the ticket
        vm.prank(buyer);
        exchange.buyTicketWithERC20(1);

        // Verify ticket assignment
        (uint256 concertId, address owner, , , , ) = ticketingSystem.ticketsRegister(1);
        assertEq(concertId, 1, "Concert ID should be 1");
        assertEq(owner, buyer, "Ticket owner should be the buyer");

        // Verify token transfer
        assertEq(token.balanceOf(buyer), 500_000 ether - tokenPrice, "ERC20 tokens should be deducted");

        // Verify exchange balance
        assertEq(
            token.balanceOf(address(exchange)),
            10_000 ether + tokenPrice,
            "Tokens should be held by the exchange"
        );
    }

    function testResaleTicketERC20() public {
        uint256 concertId = 1;
        uint256 ticketId = 1;
        uint256 resalePrice = 50 ether;

        // Prerequisite: Initial ticket purchase by buyer
        vm.startPrank(buyer);
        token.approve(address(exchange), 100 ether);
        vm.stopPrank();

        vm.prank(artist); // Only the artist can issue the ticket
        ticketingSystem.emitTicket(concertId, payable(buyer));

        // Prerequisite: Approval of transfer by ContractExchange
        vm.prank(buyer);
        ticketingSystem.approve(address(exchange), ticketId);

        // Resale by ticket owner
        vm.startPrank(buyer);
        exchange.resellTicketWithERC20(ticketId, resalePrice);
        vm.stopPrank();

        // Verify ticket ownership
        assertEq(ticketingSystem.ownerOf(ticketId), buyer, "Ownership should be transferred to buyer");
    }

    function testFailBuyTicketWithoutAllowance() public {
        // Attempt to purchase the ticket without allowance
        vm.prank(buyer);
        exchange.buyTicketWithERC20(1);
    }

    function testFailResaleAlreadySoldTicket() public {
        // Initial purchase
        vm.prank(buyer);
        token.approve(address(exchange), 100 ether);

        vm.prank(buyer);
        exchange.buyTicketWithERC20(1);

        vm.prank(artist);
        ticketingSystem.emitTicket(1, payable(buyer));

        // Offer ticket for resale
        vm.prank(buyer);
        ticketingSystem.offerTicketForSale(1, 50 ether);

        // New buyer purchases the ticket
        vm.prank(newBuyer);
        token.approve(address(ticketingSystem), 50 ether);
        vm.prank(newBuyer);
        ticketingSystem.buySecondHandTicket(1);

        // Attempt to resell the ticket already transferred
        vm.expectRevert("Not the owner");
        vm.prank(buyer);
        ticketingSystem.offerTicketForSale(1, 60 ether);
    }

    function testFailBuyTicketUnvalidatedConcert() public {
        // Buyer attempts to purchase a ticket for an unvalidated concert
        vm.prank(buyer);
        token.approve(address(exchange), 100 ether);

        // Create a new unvalidated concert
        vm.prank(artist);
        ticketingSystem.createConcert(2, 1, block.timestamp + 1 days, 100 ether);

        vm.expectRevert("Concert not validated");
        vm.prank(buyer);
        exchange.buyTicketWithERC20(2);
    }
}