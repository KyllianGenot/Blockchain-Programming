// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "forge-std/Script.sol";
import "../src/MyERC721.sol";

contract DeployMyERC721 is Script {
    function run() external {
        uint256 privateKey = vm.envUint("privateKey");

        vm.startBroadcast(privateKey);
        MyERC721 myERC721 = new MyERC721();
        vm.stopBroadcast();

        console.log("MyERC721 deployed to:", address(myERC721));
    }
}