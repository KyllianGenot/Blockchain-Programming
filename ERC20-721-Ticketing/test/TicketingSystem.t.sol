// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/TicketingSystem.sol";

contract TicketingSystemTest is Test {
    TicketingSystem ticketingSystem;

    address payable artistOwner = payable(address(0x123));
    address payable venueOwner = payable(address(0x456));
    address payable buyer = payable(address(0x789));

    function setUp() public {
        ticketingSystem = new TicketingSystem();
        vm.deal(artistOwner, 10 ether);
        vm.deal(venueOwner, 10 ether);
        vm.deal(buyer, 10 ether);
    }

    // Test 1: createArtist
    function testCreateArtist() public {
        vm.prank(artistOwner);
        ticketingSystem.createArtist("Artist1", 1);

        (bytes32 name, uint256 category, address owner, ) = ticketingSystem.artistsRegister(1);
        assertEq(name, "Artist1");
        assertEq(category, 1);
        assertEq(owner, artistOwner);
    }

    // Test 2: modifyArtist
    function testModifyArtist() public {
        vm.prank(artistOwner);
        ticketingSystem.createArtist("Artist1", 1);

        vm.prank(artistOwner);
        ticketingSystem.modifyArtist(1, "NewArtist", 2, payable(address(0x111)));

        (bytes32 name, uint256 category, address owner, ) = ticketingSystem.artistsRegister(1);
        assertEq(name, "NewArtist");
        assertEq(category, 2);
        assertEq(owner, address(0x111));
    }

    // Test 3: createVenue
    function testCreateVenue() public {
        vm.prank(venueOwner);
        ticketingSystem.createVenue("Venue1", 500, 10);

        (bytes32 name, uint256 capacity, uint256 commission, address owner) = ticketingSystem.venuesRegister(1);
        assertEq(name, "Venue1");
        assertEq(capacity, 500);
        assertEq(commission, 10);
        assertEq(owner, venueOwner);
    }

    // Test 4: createConcert
    function testCreateConcert() public {
        vm.prank(artistOwner);
        ticketingSystem.createArtist("Artist1", 1);

        vm.prank(venueOwner);
        ticketingSystem.createVenue("Venue1", 500, 10);

        vm.prank(artistOwner);
        ticketingSystem.createConcert(1, 1, block.timestamp + 1 days, 1 ether);

        (uint256 artistId, uint256 venueId, uint256 date, uint256 price, , , , ) = ticketingSystem.concertsRegister(1);
        assertEq(artistId, 1);
        assertEq(venueId, 1);
        assertEq(price, 1 ether);
        assertGt(date, block.timestamp);
    }

    // Test 5: emitTicket
    function testEmitTicket() public {
        vm.prank(artistOwner);
        ticketingSystem.createArtist("Artist1", 1);

        vm.prank(venueOwner);
        ticketingSystem.createVenue("Venue1", 500, 10);

        vm.prank(artistOwner);
        ticketingSystem.createConcert(1, 1, block.timestamp + 1 days, 1 ether);

        vm.prank(artistOwner);
        ticketingSystem.emitTicket(1, buyer);

        (uint256 concertId, address owner, , , , ) = ticketingSystem.ticketsRegister(1);
        assertEq(concertId, 1);
        assertEq(owner, buyer);
    }

    // Test 6: buyTicket
    function testBuyTicket() public {
        vm.prank(artistOwner);
        ticketingSystem.createArtist("Artist1", 1);

        vm.prank(venueOwner);
        ticketingSystem.createVenue("Venue1", 500, 10);

        vm.prank(artistOwner);
        ticketingSystem.createConcert(1, 1, block.timestamp + 1 days, 1 ether);

        vm.prank(artistOwner);
        ticketingSystem.validateConcert(1);

        vm.prank(venueOwner);
        ticketingSystem.validateConcert(1);

        vm.prank(buyer);
        vm.deal(buyer, 2 ether);
        ticketingSystem.buyTicket{value: 1 ether}(1);

        // Récupérer dynamiquement l'ID du ticket en utilisant le compteur
        uint256 ticketId = ticketingSystem.ticketCount();

        (uint256 concertId, address owner, , , , ) = ticketingSystem.ticketsRegister(ticketId);

        assertEq(concertId, 1, "Concert ID doit etre 1");
        assertEq(owner, buyer, "Le proprietaire du ticket doit etre l'acheteur");
    }

        // Test 7: validateConcert only by authorized users
    function testValidateConcertUnauthorized() public {
        vm.prank(artistOwner);
        ticketingSystem.createArtist("Artist1", 1);

        vm.prank(venueOwner);
        ticketingSystem.createVenue("Venue1", 500, 10);

        vm.prank(artistOwner);
        ticketingSystem.createConcert(1, 1, block.timestamp + 1 days, 1 ether);

        address unauthorized = address(0x999);
        vm.prank(unauthorized);
        vm.expectRevert("Only artist or venue owner can validate");
        ticketingSystem.validateConcert(1);
    }

    // Test 8: buyTicket fails if concert not validated
    function testBuyTicketFailsUnvalidatedConcert() public {
        vm.prank(artistOwner);
        ticketingSystem.createArtist("Artist1", 1);

        vm.prank(venueOwner);
        ticketingSystem.createVenue("Venue1", 500, 10);

        vm.prank(artistOwner);
        ticketingSystem.createConcert(1, 1, block.timestamp + 1 days, 1 ether);

        vm.prank(buyer);
        vm.expectRevert("Concert must be validated");
        ticketingSystem.buyTicket{value: 1 ether}(1);
    }

    // Test 9: useTicket within 24 hours of concert
    function testUseTicketValidTime() public {
        vm.prank(artistOwner);
        ticketingSystem.createArtist("Artist1", 1);

        vm.prank(venueOwner);
        ticketingSystem.createVenue("Venue1", 500, 10);

        vm.prank(artistOwner);
        ticketingSystem.createConcert(1, 1, block.timestamp + 1 days, 1 ether);

        vm.prank(artistOwner);
        ticketingSystem.validateConcert(1);

        vm.prank(venueOwner);
        ticketingSystem.validateConcert(1);

        // Achat du ticket
        vm.prank(buyer);
        ticketingSystem.buyTicket{value: 1 ether}(1);

        uint256 ticketId = ticketingSystem.ticketCount();

        // Avance le temps pour que le concert soit dans les 24 heures
        vm.warp(block.timestamp + 1 days - 23 hours);

        vm.prank(buyer);
        ticketingSystem.useTicket(ticketId);

        // Vérification : le ticket doit être marqué comme utilisé
        (, , , , bool used, ) = ticketingSystem.ticketsRegister(ticketId);
        assertTrue(used, "Le ticket devrait etre utilise avec succes");
    }

    // Test 10: offer and buy second-hand ticket
    function testSecondHandTicketSale() public {
        vm.prank(artistOwner);
        ticketingSystem.createArtist("Artist1", 1);

        vm.prank(venueOwner);
        ticketingSystem.createVenue("Venue1", 500, 10);

        vm.prank(artistOwner);
        ticketingSystem.createConcert(1, 1, block.timestamp + 1 days, 1 ether);

        vm.prank(artistOwner);
        ticketingSystem.validateConcert(1);
        vm.prank(venueOwner);
        ticketingSystem.validateConcert(1);

        vm.prank(buyer);
        ticketingSystem.buyTicket{value: 1 ether}(1);

        uint256 ticketId = ticketingSystem.ticketCount();

        // Revente du ticket
        vm.prank(buyer);
        ticketingSystem.offerTicketForSale(ticketId, 0.5 ether);

        address payable newBuyer = payable(address(0x111));
        vm.deal(newBuyer, 1 ether);

        vm.prank(newBuyer);
        ticketingSystem.buySecondHandTicket{value: 0.5 ether}(ticketId);

        (, address owner, , , , uint256 price) = ticketingSystem.ticketsRegister(ticketId);
        assertEq(owner, newBuyer, "Le nouveau proprietaire devrait etre l'acheteur secondaire");
        assertEq(price, 0.5 ether, "Le prix devrait correspondre a la revente");
    }

    // Test 11: transferTicket fails for used ticket
    function testTransferTicketFailsIfUsed() public {
        vm.prank(artistOwner);
        ticketingSystem.createArtist("Artist1", 1);

        vm.prank(venueOwner);
        ticketingSystem.createVenue("Venue1", 500, 10);

        vm.prank(artistOwner);
        ticketingSystem.createConcert(1, 1, block.timestamp + 1 days, 1 ether);

        vm.prank(artistOwner);
        ticketingSystem.validateConcert(1);
        vm.prank(venueOwner);
        ticketingSystem.validateConcert(1);

        vm.prank(buyer);
        ticketingSystem.buyTicket{value: 1 ether}(1);

        uint256 ticketId = ticketingSystem.ticketCount();

        // Utilisation du ticket
        vm.warp(block.timestamp + 1 days - 23 hours);
        vm.prank(buyer);
        ticketingSystem.useTicket(ticketId);

        // Attendre le bon message d'erreur
        vm.expectRevert("Ticket has already been used");
        vm.prank(buyer);
        ticketingSystem.transferTicket(ticketId, payable(address(0x111)));
    }
}