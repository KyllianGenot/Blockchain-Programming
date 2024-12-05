// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ERC223/ERC223.sol";
import "./ERC223/IERC223.sol";
import "./ERC223/IERC223Recipient.sol";
import "./ERC223/Address.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyERC721Token is ERC721 {
    uint256 public _totalSupply;
    uint256 public nextTokenId;
    address public contractOwner;
    ERC20 public erc20;
    ERC223Token public erc223;

    constructor() ERC721("KyllianToken721", "K721") {
        _totalSupply = 1000;
        nextTokenId = 1;
        contractOwner = msg.sender;
    }

    function mintWithERC20(uint256 amount, address _erc20Address) public {
        erc20 = ERC20(_erc20Address);
        require(nextTokenId <= _totalSupply, "Total supply reached");
        uint256 cost = 100 * 10 ** erc20.decimals();
        require(erc20.balanceOf(msg.sender) >= cost * amount, "Not enough ERC20 tokens");
        erc20.transferFrom(msg.sender, contractOwner, cost * amount);
        for (uint256 i = 0; i < amount; i++) {
            _mint(msg.sender, nextTokenId);
            nextTokenId++;
        }
    }

    // ERC721 minting function with payment in ERC223 tokens
    function mintWithERC223(uint256 amount, address _erc223Address) public {
        erc223 = ERC223Token(_erc223Address);
        uint256 cost = 100 * 10 ** 18;
        require(nextTokenId + amount - 1 <= _totalSupply, "Max supply reached");
        require(erc223.balanceOf(msg.sender) >= cost * amount, "Not enough ERC223 tokens");
        erc223.transferFrom(msg.sender, contractOwner, cost * amount);
        for (uint256 i = 0; i < amount; i++) {
            _mint(msg.sender, nextTokenId);
            nextTokenId++;
        }
    }
}
