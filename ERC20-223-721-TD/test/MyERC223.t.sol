// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/MyERC223.sol";

contract MyERC223Test is Test {
    MyERC223 token;

    address owner = address(this); // Simule le déployeur du contrat
    address recipient = address(0x456); // Adresse pour les tests de transfert

    function setUp() public {
        // Déployer le contrat avant chaque test
        token = new MyERC223();
    }

    function testInitialSupply() public view {
        // Vérifier que l'offre initiale est correcte
        uint256 expectedSupply = 200000 * (10 ** uint256(token.decimals()));
        assertEq(token.totalSupply(), expectedSupply);
        assertEq(token.balanceOf(owner), expectedSupply);
    }

    function testTransfer() public {
        uint256 transferAmount = 100 * (10 ** uint256(token.decimals()));
        uint256 initialOwnerBalance = token.balanceOf(owner);

        // Transférer des jetons
        token.transfer(recipient, transferAmount);

        // Vérifier les soldes après transfert
        assertEq(token.balanceOf(owner), initialOwnerBalance - transferAmount);
        assertEq(token.balanceOf(recipient), transferAmount);
    }

    function testTransferToContract() public {
        uint256 transferAmount = 50 * (10 ** uint256(token.decimals()));

        // Créer un contrat destinataire compatible ERC223
        Receiver receiver = new Receiver();

        // Transférer des jetons au contrat destinataire
        token.transfer(address(receiver), transferAmount);

        // Vérifier les soldes après transfert
        assertEq(token.balanceOf(address(receiver)), transferAmount);
    }
}

// Contrat destinataire pour tester les transferts ERC223
contract Receiver {
    event TokensReceived(address sender, uint256 amount, bytes data);

    function tokenFallback(
        address sender,
        uint256 amount,
        bytes memory data
    ) public {
        emit TokensReceived(sender, amount, data);
    }
}
