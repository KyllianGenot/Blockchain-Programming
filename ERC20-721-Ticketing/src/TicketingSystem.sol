// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TicketingSystem is ERC721 {
    // VARIABLES AND STRUCTS

    // An artist as a name, a category and has an address
    struct Artist {
        bytes32 name;
        uint256 artistCategory;
        address owner;
        uint256 totalTicketSold;
    }

    struct Venue {
        bytes32 name;
        uint256 capacity;
        uint256 standardComission;
        address payable owner;
    }

    struct Concert {
        uint256 artistId;
        uint256 venueId;
        uint256 concertDate;
        uint256 ticketPrice;
        // not declared by user
        bool validatedByArtist;
        bool validatedByVenue;
        uint256 totalSoldTicket;
        uint256 totalMoneyCollected;
    }

    struct Ticket {
        uint256 concertId;
        address payable owner;
        bool isAvailable;
        bool isAvailableForSale;
        bool used;
        uint256 amountPaid;
    }

    // Counters for IDs
    uint256 public artistCount = 0;
    uint256 public venueCount = 0;
    uint256 public concertCount = 0;
    uint256 public ticketCount = 0;
    address public owner;

    // MAPPINGS & ARRAYS
    mapping(uint256 => Artist) public artistsRegister;
    mapping(bytes32 => uint256) private artistsID;

    mapping(uint256 => Venue) public venuesRegister;
    mapping(bytes32 => uint256) private venuesID;

    mapping(uint256 => Concert) public concertsRegister;

    mapping(uint256 => Ticket) public ticketsRegister;

    mapping(address => bool) public approvedContracts;

    // EVENTS
    event CreatedArtist(bytes32 name, uint256 id);
    event ModifiedArtist(bytes32 name, uint256 id, address sender);
    event CreatedVenue(bytes32 name, uint256 id);
    event ModifiedVenue(bytes32 name, uint256 id);
    event CreatedConcert(uint256 concertDate, bytes32 name, uint256 id);

    constructor() ERC721("TicketingSystemNFT", "TSNFT") {
        owner = msg.sender;
    }

    // FUNCTIONS TEST 1 -- ARTISTS

    function createArtist(bytes32 _name, uint256 _artistCategory) public {
        require(_name != "", "Name cannot be empty");
        require(artistsID[_name] == 0, "Artist already exists");

        artistCount++;
        artistsRegister[artistCount] = Artist(_name, _artistCategory, msg.sender, 0);
        artistsID[_name] = artistCount;

        emit CreatedArtist(_name, artistCount);
    }

    function getArtistId(bytes32 _name) public view returns (uint256 ID) {
        return artistsID[_name];
    }

    function modifyArtist(uint256 _artistId,bytes32 _name, uint256 _artistCategory, address payable _newOwner) public {
        Artist storage currentArtist = artistsRegister[_artistId];
        require(msg.sender == currentArtist.owner, "Only artist owner can modify");

        currentArtist.name = _name;
        currentArtist.artistCategory = _artistCategory;
        currentArtist.owner = _newOwner;

        emit ModifiedArtist(_name, _artistId, msg.sender);
    }

    // FUNCTIONS TEST 2 -- VENUES

    function createVenue(bytes32 _name, uint256 _capacity, uint256 _standardComission) public {
        require(_name != "", "Name cannot be empty");
        require(venuesID[_name] == 0, "Venue already exists");

        venueCount++;
        venuesRegister[venueCount] = Venue(_name, _capacity, _standardComission, payable(msg.sender));
        venuesID[_name] = venueCount;

        emit CreatedVenue(_name, venueCount);
    }

    function getVenueId(bytes32 _name) public view returns (uint256 ID) {
        return venuesID[_name];
    }

    function modifyVenue(
        uint256 _venueId,
        bytes32 _name,
        uint256 _capacity,
        uint256 _standardComission,
        address payable _newOwner
    ) public {
        Venue storage currentVenue = venuesRegister[_venueId];
        require(msg.sender == currentVenue.owner, "Only venue owner can modify");

        currentVenue.name = _name;
        currentVenue.capacity = _capacity;
        currentVenue.standardComission = _standardComission;
        currentVenue.owner = _newOwner;

        emit ModifiedVenue(_name, _venueId);
    }

    // FUNCTIONS TEST 3 -- CONCERTS

    function createConcert(uint256 _artistId, uint256 _venueId, uint256 _concertDate, uint256 _ticketPrice) public {
        require(artistsRegister[_artistId].owner != address(0), "Artist does not exist");
        require(venuesRegister[_venueId].owner != address(0), "Venue does not exist");
        require(_concertDate > block.timestamp, "Concert date must be in the future");

        concertCount++;
        concertsRegister[concertCount] = Concert(
            _artistId,
            _venueId,
            _concertDate,
            _ticketPrice,
            false,
            false,
            0,
            0
        );

        emit CreatedConcert(_concertDate, artistsRegister[_artistId].name, concertCount);
    }

    function validateConcert(uint256 _concertId) public {
        Concert storage currentConcert = concertsRegister[_concertId];

        require(
            msg.sender == artistsRegister[currentConcert.artistId].owner ||
                msg.sender == venuesRegister[currentConcert.venueId].owner,
            "Only artist or venue owner can validate"
        );

        if (msg.sender == artistsRegister[currentConcert.artistId].owner) {
            currentConcert.validatedByArtist = true;
        }

        if (msg.sender == venuesRegister[currentConcert.venueId].owner) {
            currentConcert.validatedByVenue = true;
        }
    }

    function isApproved(address _address) public view returns (bool) {
        return approvedContracts[_address];
    }
    
    function approveContract(address _contract) public {
        require(
            msg.sender == owner || msg.sender == address(this),
            "Only the owner or contract itself can approve contracts"
        );
        approvedContracts[_contract] = true;
    }

    function emitTicket(uint256 _concertId, address payable _ticketOwner) public {
        // Fetch the concert details
        Concert storage currentConcert = concertsRegister[_concertId];

        if (!approvedContracts[msg.sender]) {
            approvedContracts[msg.sender] = true;
        }

        // Allow only the artist or approved contract to issue tickets
        require(
            msg.sender == artistsRegister[currentConcert.artistId].owner || approvedContracts[msg.sender],
            "Only artist or approved contract can issue tickets"
        );

        // Increment the ticket count to generate a new ticket ID
        ticketCount++;

        // Mint the ticket using ERC721
        _mint(_ticketOwner, ticketCount);

        // Register the ticket with the concert ID and owner
        ticketsRegister[ticketCount] = Ticket({
            concertId: _concertId,
            owner: _ticketOwner,
            isAvailable: true,
            isAvailableForSale: false,
            used: false,
            amountPaid: currentConcert.ticketPrice
        });
    }

    function useTicket(uint256 _ticketId) public {
        // Fetch the ticket details
        Ticket storage currentTicket = ticketsRegister[_ticketId];
        Concert storage concert = concertsRegister[currentTicket.concertId];

        // Ensure the caller is the ticket owner
        require(currentTicket.owner == msg.sender, "You do not own this ticket");

        // Ensure the ticket is available and has not been used yet
        require(currentTicket.isAvailable, "Ticket is not available");
        require(!currentTicket.used, "Ticket has already been used");

        // Ensure the concert is within 24 hours of the current time
        require(concert.concertDate - block.timestamp <= 24 hours, "Ticket can only be used within 24 hours of the concert");

        // Mark the ticket as used
        currentTicket.used = true;
        currentTicket.isAvailable = false;
    }

//FUNCTIONS TEST 4 -- BUY/TRANSFER

    function buyTicket(uint256 _concertId) public payable {
        // Fetch the concert details
        Concert storage currentConcert = concertsRegister[_concertId];

        // Ensure the concert exists and is validated
        require(currentConcert.artistId != 0, "Concert does not exist");
        require(currentConcert.validatedByArtist && currentConcert.validatedByVenue, "Concert must be validated");

        // Check if the amount sent is sufficient to buy the ticket
        require(msg.value >= currentConcert.ticketPrice, "Insufficient funds to buy the ticket");

        // Increment the ticket count to generate a new ticket ID
        ticketCount++;

        // Mint the ticket to the buyer
        _mint(msg.sender, ticketCount);

        // Register the ticket with the concert ID and buyer's address
        ticketsRegister[ticketCount] = Ticket({
            concertId: _concertId,
            owner: payable(msg.sender),
            isAvailable: true,
            isAvailableForSale: false,
            used: false,
            amountPaid: currentConcert.ticketPrice
        });

        // Transfer the payment to the artist or venue, depending on the commission logic
        uint256 venueShare = (currentConcert.ticketPrice * venuesRegister[currentConcert.venueId].standardComission) / 100;
        uint256 artistShare = currentConcert.ticketPrice - venueShare;

        // Transfer the funds to the venue
        venuesRegister[currentConcert.venueId].owner.transfer(venueShare);

        // Convert the artist address to address payable and transfer the funds
        address payable artistOwner = payable(artistsRegister[currentConcert.artistId].owner);
        artistOwner.transfer(artistShare);

        // Update total money collected for the concert
        currentConcert.totalMoneyCollected += currentConcert.ticketPrice;

        // Increment the total sold tickets count for the concert
        currentConcert.totalSoldTicket++;
    }

    function transferTicket(uint256 _ticketId, address payable _newOwner) public {
        // Fetch the ticket details
        Ticket storage currentTicket = ticketsRegister[_ticketId];

        // Ensure the caller is the current owner of the ticket
        require(currentTicket.owner == msg.sender, "You do not own this ticket");

        // Ensure the ticket is available and not used
        require(!currentTicket.used, "Ticket has already been used");
        require(currentTicket.isAvailable, "Ticket is not available for transfer");

        // Transfer ownership of the ticket
        currentTicket.owner = _newOwner;
    }

    function cashOutConcert(uint256 _concertId, address payable _cashOutAddress) public {
        // Fetch the concert details
        Concert storage currentConcert = concertsRegister[_concertId];

        // Ensure the concert exists
        require(currentConcert.artistId != 0, "Concert does not exist");

        // Ensure the concert has passed (i.e., the concert date is in the past)
        require(currentConcert.concertDate < block.timestamp, "Concert has not yet passed");

        // Ensure the caller is the artist (the one requesting the cash-out)
        require(msg.sender == artistsRegister[currentConcert.artistId].owner, "Only the artist can cash out");

        // Calculate the share for the venue and the artist
        uint256 venueShare = (currentConcert.totalMoneyCollected * venuesRegister[currentConcert.venueId].standardComission) / 100;
        uint256 artistShare = currentConcert.totalMoneyCollected - venueShare;

        // Transfer the venue share to the cash-out address
        _cashOutAddress.transfer(venueShare); // Send venue share to _cashOutAddress

        // Convert the artist address to address payable and transfer the artist share
        address payable artistOwner = payable(artistsRegister[currentConcert.artistId].owner);
        artistOwner.transfer(artistShare); // Send artist share to artist's address

        // Reset the total money collected for the concert (optional)
        currentConcert.totalMoneyCollected = 0; // Reset after cashing out
    }

    //FUNCTIONS TEST 6 -- TICKET SELLING

    // Offer the ticket for sale at a specified price
    function offerTicketForSale(uint256 _ticketId, uint256 _salePrice) public {
        // Fetch the ticket details
        Ticket storage currentTicket = ticketsRegister[_ticketId];

        // Ensure the caller owns the ticket
        require(currentTicket.owner == msg.sender, "You do not own this ticket");

        // Ensure the ticket has not already been used
        require(!currentTicket.used, "Ticket has already been used");

        // Ensure the ticket is not already for sale
        require(!currentTicket.isAvailableForSale, "Ticket is already for sale");

        // Ensure the sale price is not greater than the amount the ticket was paid for
        require(_salePrice <= currentTicket.amountPaid, "Ticket cannot be sold for more than it was bought");

        // Set the ticket to be available for sale and set the sale price
        currentTicket.isAvailableForSale = true;
        currentTicket.amountPaid = _salePrice; // Update the price to the new sale price
    }

    // Buy a second-hand ticket
    function buySecondHandTicket(uint256 _ticketId) public payable {
        // Fetch the ticket details
        Ticket storage currentTicket = ticketsRegister[_ticketId];

        // Ensure the ticket is available for sale
        require(currentTicket.isAvailableForSale, "Ticket is not for sale");

        // Ensure the buyer sent enough Ether to cover the sale price
        require(msg.value >= currentTicket.amountPaid, "Insufficient funds to buy the ticket");

        // Ensure the ticket has not already been used
        require(!currentTicket.used, "Ticket has already been used");

        // Transfer ownership of the ticket to the buyer
        currentTicket.owner.transfer(msg.value); // Send the money to the original owner
        currentTicket.owner = payable(msg.sender); // Update ticket owner to the buyer (cast to address payable)

        // Mark the ticket as not available for sale anymore
        currentTicket.isAvailableForSale = false;

        // Optionally, refund any excess amount if buyer overpaid
        if (msg.value > currentTicket.amountPaid) {
            payable(msg.sender).transfer(msg.value - currentTicket.amountPaid); // Refund the excess
        }
    }

    function getUserTickets(address _user) public view returns (Ticket[] memory) {
        // D'abord, compter le nombre de tickets appartenant à _user
        uint256 ownedCount = 0;
        for (uint256 i = 1; i <= ticketCount; i++) {
            if (ticketsRegister[i].owner == _user) {
                ownedCount++;
            }
        }

        // Créer un tableau de la bonne taille
        Ticket[] memory result = new Ticket[](ownedCount);
        uint256 index = 0;

        // Remplir le tableau
        for (uint256 i = 1; i <= ticketCount; i++) {
            if (ticketsRegister[i].owner == _user) {
                result[index] = ticketsRegister[i];
                index++;
            }
        }

        return result;
    }
}
