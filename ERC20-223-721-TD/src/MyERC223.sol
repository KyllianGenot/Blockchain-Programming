// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC223/ERC223.sol";
import "@openzeppelin/contracts/token/ERC223/IERC223.sol";
import "@openzeppelin/contracts/token/ERC223/IERC223Recipient.sol";
import "@openzeppelin/contracts/token/ERC223/Address.sol";

contract MyERC223 is ERC223Token {
    uint8 public _decimals = 18;
    uint256 public _totalSupply = 1000 * (10 ** uint256(_decimals));

    constructor() ERC223Token("KyllianToken223", "K223", _decimals) {
        _mint(_totalSupply);
    }
}