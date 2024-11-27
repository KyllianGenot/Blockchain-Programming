// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("ERC20-Kyllian", "x7f0hyu") {
        uint256 initialSupply = 372691326000000000000000000;
        _mint(msg.sender, initialSupply);
    }
    function getToken() external {
        uint256 amount = 100 * 10 ** decimals();
        _mint(msg.sender, amount);
    }
}
