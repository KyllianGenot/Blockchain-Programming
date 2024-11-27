// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20 is ERC20 {
    uint8 public _decimals = 8;
    uint256 public _totalSupply = 10000 * (10 ** uint256(_decimals));

    constructor() ERC20("KyllianToken20", "K20") {
        _mint(msg.sender, 150000);
    }
}