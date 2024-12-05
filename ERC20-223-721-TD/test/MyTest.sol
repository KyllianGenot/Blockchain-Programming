// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/MyERC20.sol";
import "../src/MyERC223.sol";
import "../src/MyERC721.sol";

contract MyTest is Test {
    MyERC20 erc20;    
    MyERC223 erc223;
    MyERC721Token erc721;

    address user = address(0x1234);

    function setUp() public {
        // Deploy all necessary contracts for testing
        erc20 = new MyERC20();
        erc223 = new MyERC223();
        erc721 = new MyERC721Token();

        // Provide an initial token balance to the test user
        vm.prank(address(this)); // Mock the deployer's address for the transfer
        erc20.transfer(user, 1000 * 10 ** erc20.decimals());
        erc223.transfer(user, 1000 * 10 ** 18);
    }

    function testMintWithERC20() public {
        // Allow the ERC721 contract to use the user's ERC20 tokens
        vm.startPrank(user); // Simulate the user's perspective for this transaction
        erc20.approve(address(erc721), 100 * 10 ** erc20.decimals());
        
        // Capture the deployer's initial ERC20 balance
        uint256 initialDeployerBalance = erc20.balanceOf(address(this));
        
        // Perform NFT minting using ERC20 tokens
        erc721.mintWithERC20(1, address(erc20));
        
        // Ensure the minted token belongs to the user
        assertEq(erc721.ownerOf(1), user);
        
        // Check that the user's ERC20 balance has been reduced by the correct amount
        assertEq(erc20.balanceOf(user), 900 * 10 ** erc20.decimals());
        
        // Verify that the ERC20 tokens were transferred to the deployer or contract
        assertEq(erc20.balanceOf(address(this)), initialDeployerBalance + 100 * 10 ** erc20.decimals());
        
        // Confirm the next token ID is updated correctly
        assertEq(erc721.nextTokenId(), 2);
        
        vm.stopPrank();
    }

    function testMintWithERC223() public {
        // Record the deployer's initial ERC223 token balance
        uint256 initialDeployerBalance = erc223.balanceOf(address(this));
        
        // Simulate the user performing the mint transaction
        vm.startPrank(user);
        
        // Execute the mintWithERC223 function
        erc721.mintWithERC223(1, address(erc223));
        
        // Ensure the minted token is assigned to the user
        assertEq(erc721.ownerOf(1), user);
        
        // Validate the user's ERC223 token balance after minting
        assertEq(erc223.balanceOf(user), 900 * 10 ** 18);
        
        // Confirm the ERC223 tokens were correctly transferred to the deployer
        assertEq(erc223.balanceOf(address(this)), initialDeployerBalance + 100 * 10 ** 18);
        
        // Check that the token ID has been incremented
        assertEq(erc721.nextTokenId(), 2);
        
        vm.stopPrank();
    }
}