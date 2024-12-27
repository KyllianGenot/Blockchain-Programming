// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ContractERC20 is ERC20 {
    constructor(uint256 initialSupply) ERC20("MarketplaceToken", "MPT") {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }
}