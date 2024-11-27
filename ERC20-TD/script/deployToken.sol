// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "forge-std/Script.sol";
import "src/myToken.sol"; // Remplacez avec le chemin de votre contrat

contract DeployTokenScript is Script {
    function run() external {
        vm.startBroadcast();

        // Déployez votre token ici
        MyToken token = new MyToken();

        vm.stopBroadcast();
    }
}
