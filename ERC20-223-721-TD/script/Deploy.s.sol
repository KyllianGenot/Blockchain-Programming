// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/MyERC20.sol";
import "../src/MyERC223.sol";
import "../src/MyERC721.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        MyERC20 erc20 = new MyERC20();
        MyERC223 erc223 = new MyERC223();
        MyERC721Token erc721 = new MyERC721Token();

        console.log("ERC20 deployed at:", address(erc20));
        console.log("ERC223 deployed at:", address(erc223));
        console.log("ERC721 deployed at:", address(erc721));

        vm.stopBroadcast();
    }
}