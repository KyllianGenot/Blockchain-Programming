// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./TicketingSystem.sol";

contract ContractExchange {
    IERC20 public paymentToken; // ERC20 token used for payments
    TicketingSystem public ticketingSystem; // TicketingSystem contract for tickets
    address public owner; // Administrator of the exchange
    uint256 public constant RATE = 3400; // Fixed exchange rate: 1 ETH = 3400 ERC20

    // Events
    event Exchanged(address indexed user, uint256 ethAmount, uint256 erc20Amount);
    event TicketPurchased(address indexed user, uint256 concertId, uint256 ticketPrice);
    event ERC20Withdrawn(address indexed owner, uint256 amount);
    event ETHWithdrawn(address indexed owner, uint256 amount);

    constructor(address _paymentToken, address _ticketingSystem) {
        paymentToken = IERC20(_paymentToken);
        ticketingSystem = TicketingSystem(_ticketingSystem);
        owner = msg.sender;
    }

    // On retire la logique du constructor et on la place ici
    function initialize(uint256 initialSupply) external onlyOwner {
        // Il faut évidemment que le test contract ait déjà fait
        //   token.approve(address(this), initialSupply)
        // avant d’appeler cette fonction
        require(
            paymentToken.transferFrom(msg.sender, address(this), initialSupply),
            "Initial ERC20 transfer failed"
        );
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    /**
     * @notice Allows a user to purchase a ticket with ERC20 tokens.
     * @param _concertId The ID of the concert.
     */
    function buyTicketWithERC20(uint256 _concertId) public {
        (, , , uint256 ticketPriceInWei, , , , ) = ticketingSystem.concertsRegister(_concertId);

        // Convertir le prix en Wei vers la quantité de tokens, par ex. 0.01 ETH => 34 MPT
        uint256 tokenPrice = (ticketPriceInWei * 3400);
        // => Si ticketPriceInWei = 1e16, on obtient tokenPrice = 34 * 1e18 / 1e18 = 34 * 1e0 = 34

        require(paymentToken.allowance(msg.sender, address(this)) >= tokenPrice, "ERC20 allowance insufficient");

        require(
            paymentToken.transferFrom(msg.sender, address(this), tokenPrice),
            "ERC20 transfer failed"
        );

        ticketingSystem.emitTicket(_concertId, payable(msg.sender));
        emit TicketPurchased(msg.sender, _concertId, tokenPrice);
    }

    /**
     * @notice Allows the owner to withdraw all collected ERC20 tokens.
     */
    function withdrawERC20() public onlyOwner {
        uint256 balance = paymentToken.balanceOf(address(this));
        require(balance > 0, "No ERC20 tokens to withdraw");

        paymentToken.transfer(owner, balance);
        emit ERC20Withdrawn(owner, balance);
    }

    /**
     * @notice Allows the owner to withdraw all collected ETH.
     */
    function withdrawETH() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");

        payable(owner).transfer(balance);
        emit ETHWithdrawn(owner, balance);
    }

    /**
     * @notice Exchanges ETH for ERC20 tokens at the fixed rate.
     */
    function exchangeEthForErc20() public payable {
        require(msg.value > 0, "You must send a valid ETH amount");

        uint256 erc20Amount = (msg.value * RATE);
        require(paymentToken.balanceOf(address(this)) >= erc20Amount, "Insufficient ERC20 tokens available");

        require(paymentToken.transfer(msg.sender, erc20Amount), "ERC20 transfer failed");
        emit Exchanged(msg.sender, msg.value, erc20Amount);
    }

    /**
     * @notice Allows a ticket owner to resell a ticket with ERC20 payment.
     * @param _ticketId The ID of the ticket to resell.
     * @param _price The price for which the ticket is being resold.
     */
    function resellTicketWithERC20(uint256 _ticketId, uint256 _price) public {
        (, address payable currentOwner, bool isAvailableForSale, , , ) = ticketingSystem.ticketsRegister(_ticketId);

        require(isAvailableForSale, "Ticket is not for sale");
        require(currentOwner == msg.sender, "Only the ticket owner can resell");

        require(
            paymentToken.allowance(msg.sender, address(this)) >= _price,
            "Insufficient ERC20 allowance"
        );

        require(
            ticketingSystem.getApproved(_ticketId) == address(this),
            "ContractExchange not approved to transfer this ticket"
        );

        paymentToken.transferFrom(msg.sender, currentOwner, _price);
        ticketingSystem.transferFrom(currentOwner, msg.sender, _ticketId);

        assert(ticketingSystem.ownerOf(_ticketId) == msg.sender);
    }
}
