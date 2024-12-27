// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ContractERC20} from "../src/ContractERC20.sol";
import {ContractExchange} from "../src/ContractExchange.sol";
import {TicketingSystem} from "../src/TicketingSystem.sol";

contract DeployScript is Script {
    address public tokenAddress;
    address public exchangeAddress;
    address public ticketingSystemAddress;

    ContractERC20 public token;
    ContractExchange public exchange;
    TicketingSystem public ticketingSystem;

    function setUp() public {}

    function run() public {
        vm.startBroadcast(); // Commence la diffusion des transactions

        // 1) Déployer le contrat ERC20
        token = new ContractERC20(1_000_000 ether); 
        tokenAddress = address(token);
        console.log("ERC20 Token deployed at: ", tokenAddress);

        // 2) Déployer le contrat TicketingSystem
        ticketingSystem = new TicketingSystem();
        ticketingSystemAddress = address(ticketingSystem);
        console.log("TicketingSystem deployed at: ", ticketingSystemAddress);

        // 3) Déployer le contrat Exchange (sans transfert initial)
        exchange = new ContractExchange(tokenAddress, ticketingSystemAddress);
        exchangeAddress = address(exchange);
        console.log("Exchange deployed at: ", exchangeAddress);

        // 4) Approuver l’Exchange pour qu’il puisse faire le transferFrom(...)
        uint256 initialSupply = 10_000 ether;
        token.approve(exchangeAddress, initialSupply);
        console.log("ERC20 tokens approved for the Exchange.");

        // 5) Initialize => transfère réellement initialSupply vers Exchange
        exchange.initialize(initialSupply);

        vm.stopBroadcast(); // Arrête la diffusion des transactions
    }
}