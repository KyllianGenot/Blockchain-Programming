# ERC20-223-721-TD Project

This guide explains how to set up and run the **ERC20-223-721-TD project**, developed using **Foundry**. The project demonstrates the creation and interaction of ERC20, ERC223, and ERC721 smart contracts.

---

## Features and Objectives

1. **Install Foundry and Create a Foundry Project**  
   - Ensure Foundry is installed and the project is set up.

2. **ERC20 Token Contract**  
   - Create an ERC20 token contract with:  
     - A chosen ticker, total supply, and decimals.

3. **ERC223 Token Contract**  
   - Create an ERC223 token contract with similar parameters to the ERC20.

4. **ERC721 Token Contract**  
   - Implement an ERC721 token contract.

5. **Migration Script**  
   - Deploy all contracts with a migration script.

6. **Minting Functionality**  
   - Implement a function to mint ERC721 tokens using:
     - **ERC20** tokens.
     - **ERC223** tokens via the `transfer` function.

7. **Testing**  
   - Showcase the following with comprehensive tests:
     - Buying an ERC721 token with ERC20.
     - Buying an ERC721 token with ERC223.

---

## Prerequisites

1. **Install Foundry**  
   Follow the [Foundry Installation Guide](https://book.getfoundry.sh/getting-started/installation).

2. **Clone the Repository**  
   Use sparse checkout to clone only the required folder:
   ```bash
   # Clone the repository with no checkout
   git clone --no-checkout https://github.com/KyllianGenot/Blockchain-Programming.git
   
   # Navigate to the repository
   cd Blockchain-Programming
   
   # Configure sparse checkout
   git sparse-checkout init --cone
   git sparse-checkout set ERC20-223-721-TD
   
   # Pull the specified folder
   git checkout

   # Navigate to the folder
   cd ERC20-223-721-TD
   ```

---

## Project Structure

- **`src/MyERC20.sol`**: ERC20 token implementation.
- **`src/MyERC223.sol`**: ERC223 token implementation.
- **`src/MyERC721.sol`**: ERC721 token implementation.
- **`script/Deploy.s.sol`**: Deployment script for all contracts.
- **`test/MyTest.t.sol`**: Tests for minting ERC721 tokens with ERC20 and ERC223.

---

## Running the Project

### 1. **Install Dependencies**
Install required dependencies:
```bash
forge install
```

### 2. **Compile the Contracts**
Compile all contracts to ensure there are no errors:
```bash
forge build
```

### 3. **Deploy the Contracts**
Run the deployment script:
```bash
forge script script/Deploy.s.sol
```

### 4. **Run the Tests**
Execute the test suite to validate the implementation:
```bash
forge test
```

---

## How It Works

### ERC20 Token
- Standard implementation with user-defined ticker, total supply, and decimals.
- Allows transferring tokens and approving spending by other contracts.

### ERC223 Token
- Extends ERC20 with additional safety checks for contract transfers.

### ERC721 Token
- Non-fungible token implementation.
- Features:
  - Minting NFTs using ERC20 tokens.
  - Minting NFTs using ERC223 tokens via the `transfer` function.

### Tests
- Validate the minting process for ERC721 with both ERC20 and ERC223.
- Ensure proper token ownership and balance deductions.

---

## License

This project is licensed under the MIT License.

---

By following this guide, you can set up, deploy, and test the **ERC20-223-721-TD project**. For further inquiries or clarifications, refer to the code comments or open an issue on the repository.
