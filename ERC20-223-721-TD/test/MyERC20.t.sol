// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/MyERC20.sol";

contract MyTokenTest is Test {
    MyERC20 token;

    function setUp() public {
        token = new MyERC20();
    }

    function testTotalSupply() public view {
        assertEq(token.totalSupply(), 1000000 * 10 ** token.decimals());
    }

    function testNameAndSymbol() public view {
        assertEq(token.name(), "KyllianToken");
        assertEq(token.symbol(), "KYL");
    }

    function testMintedBalance() public view {
        assertEq(token.balanceOf(address(this)), 1000000 * 10 ** token.decimals());
    }
}
