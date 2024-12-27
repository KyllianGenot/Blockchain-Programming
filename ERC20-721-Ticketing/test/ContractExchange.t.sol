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
        // 1. Déployer le token & TicketingSystem
        token = new ContractERC20(1_000_000 ether);
        ticketingSystem = new TicketingSystem();

        // 2) Deploy l’exchange (on ne passe plus le `initialSupply` au constructor)
        exchange = new ContractExchange(address(token), address(ticketingSystem));

        // 3) On approuve l’exchange pour initialSupply
        uint256 initialSupply = 10_000 ether;
        token.approve(address(exchange), initialSupply);

        // On log l’adresse de l’exchange déployé (elle ne sera plus 0x0 !)
        emit log_named_address("Address of Exchange contract", address(exchange));

        // 4) On appelle initialize(...) maintenant que l’exchange est déployé
        exchange.initialize(initialSupply);

        // On log pour vérifier l’allowance
        emit log_named_uint(
            "Allowance for Exchange contract",
            token.allowance(address(this), address(exchange))
        );

        // Vérifier le solde de l’exchange
        emit log_named_uint(
            "Token balance of Exchange contract",
            token.balanceOf(address(exchange))
        );
        assertEq(token.balanceOf(address(exchange)), initialSupply, "Le transfert initial a fail.");

        // Transférer des ERC20 tokens aux acheteurs
        token.transfer(buyer, 500 ether);
        token.transfer(newBuyer, 500 ether);

        emit log_named_uint("Buyer token balance", token.balanceOf(buyer));
        emit log_named_uint("New buyer token balance", token.balanceOf(newBuyer));

        ticketingSystem.approveContract(address(exchange));

        // Créer un artiste, une salle et un concert
        vm.prank(artist);
        ticketingSystem.createArtist("Artist1", 1);

        vm.prank(artist);
        ticketingSystem.createVenue("Venue1", 500, 10);

        vm.prank(artist);
        ticketingSystem.createConcert(1, 1, block.timestamp + 1 days, 100 ether);

        // Valider le concert
        vm.prank(artist);
        ticketingSystem.validateConcert(1);
    }

    function testBuyTicketWithERC20() public {       
        // Approve the contract to spend ERC20 tokens
        vm.prank(buyer);
        token.approve(address(exchange), 100 ether);

        // Buyer pays for the ticket
        vm.prank(buyer);
        exchange.buyTicketWithERC20(1);

        // Simulate the artist issuing the ticket
        vm.prank(artist);
        ticketingSystem.emitTicket(1, payable(buyer));

        // Verify that the ticket is assigned to the buyer
        (uint256 concertId, address owner, , , , ) = ticketingSystem.ticketsRegister(1);
        assertEq(concertId, 1, "Concert ID should be 1");
        assertEq(owner, buyer, "Ticket owner should be the buyer");

        // Verify that tokens were transferred
        assertEq(token.balanceOf(buyer), 400 ether, "ERC20 tokens should be deducted");

        // Si l'Exchange démarre avec 10,000 tokens, +100 après l'achat => 10,100
        assertEq(token.balanceOf(address(exchange)), 10_100 ether, "Tokens should be held by the exchange");
    }

    function testResaleTicketERC20() public {
        uint256 concertId = 1;
        uint256 ticketId = 1;
        uint256 resalePrice = 50 ether;

        // Prérequis : Achat initial du ticket par buyer
        vm.startPrank(buyer);
        token.approve(address(exchange), 100 ether);
        vm.stopPrank();

        vm.prank(artist); // Seul l'artiste peut émettre le ticket
        ticketingSystem.emitTicket(concertId, payable(buyer));

        // Prérequis : Approbation du transfert par ContractExchange
        vm.prank(buyer);
        ticketingSystem.approve(address(exchange), ticketId);

        // Resale par le propriétaire du ticket
        vm.startPrank(buyer);
        exchange.resellTicketWithERC20(ticketId, resalePrice);
        vm.stopPrank();

        // Vérification : Le ticket appartient au nouveau propriétaire
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

        // Offer the ticket for resale
        vm.prank(buyer);
        ticketingSystem.offerTicketForSale(1, 50 ether);

        // New buyer purchases the ticket
        vm.prank(newBuyer);
        token.approve(address(ticketingSystem), 50 ether);
        vm.prank(newBuyer);
        ticketingSystem.buySecondHandTicket(1);

        // Attempt to resell the ticket that has already been transferred
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
