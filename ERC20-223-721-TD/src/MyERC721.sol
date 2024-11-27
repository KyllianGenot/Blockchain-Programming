// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyERC721Token is ERC721 {
    uint8 public _decimals = 8;
    uint256 public _totalSupply = 10000 * (10 ** uint256(_decimals));

    constructor() ERC721("KyllianToken721", "K721") {
        _mint(msg.sender, 150000);
    }
}
