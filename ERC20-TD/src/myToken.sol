// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    uint256 public constant TOKEN_PRICE = 0.001 ether;

    mapping(address => uint256) private allowList;

    address private owner;
    address public constant evaluatorAddress = 0xB8d4fDEe700263F6f07800AECd702C3D0D74E601;

    constructor() ERC20("ERC20-Kyllian", "x7f0hyu") {
        uint256 initialSupply = 372691326000000000000000000;
        _mint(msg.sender, initialSupply);
        owner = msg.sender;

        allowList[evaluatorAddress] = 2;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function updateAllowList(address user, uint256 tier) external onlyOwner {
        allowList[user] = tier;
    }

    function isCustomerWhiteListed(address customerAddress) public view returns (bool) {
        return allowList[customerAddress] > 0;
    }

    function customerTierLevel(address customerAddress) public view returns (uint256) {
        return allowList[customerAddress];
    }

    function getToken() external returns (bool) {
        require(isCustomerWhiteListed(msg.sender), "You are not on the allow-list");

        uint256 tier = allowList[msg.sender];
        uint256 amount = tier * 100 * 10 ** decimals();

        require(amount > 0, "Invalid tier level for free tokens");
        _mint(msg.sender, amount);

        return true;
    }

    function buyToken() external payable returns (bool) {
        require(isCustomerWhiteListed(msg.sender), "You are not on the allow-list");
        require(msg.value > 0, "You must send ETH to buy tokens");

        uint256 tier = allowList[msg.sender];
        require(tier > 0, "You are not allowed to buy tokens");

        uint256 baseTokensToBuy = (msg.value * (10 ** decimals())) / TOKEN_PRICE;
        uint256 tokensToBuy = baseTokensToBuy * tier;

        require(tokensToBuy > 0, "Not enough ETH sent to buy tokens");
        _mint(msg.sender, tokensToBuy);

        return true;
    }
}
