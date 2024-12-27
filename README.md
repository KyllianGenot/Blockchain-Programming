# Blockchain Programming

Welcome to my repository dedicated to the **Blockchain Programming** course. Here, you will find all the assignments and projects I completed as part of this course.

---

## Repository Content

### 1. **ERC20-TD: Development of an ERC20 Token**

This project involves the creation and deployment of a custom ERC20 token and its integration with an evaluator smart contract. Tasks included:

- Implementing an ERC20 token with customizable ticker, total supply, and decimals.
- Deploying the token on the Holesky test network.
- Adding features for token distribution and purchase functionality.
- Integrating multi-tiered access control mechanisms.
- Completing the workshop requirements by integrating all exercises into a single transaction.

📁 Folder: `ERC20-TD`
- **`src/myToken.sol`**: Contains the ERC20 token implementation.
- **`script/deployToken.sol`**: Deployment script for the ERC20 token.
- **`README.md`**: Detailed documentation for the ERC20-TD project.
- **`lib/forge-std`**: Utilities and libraries for Foundry.
- **`foundry.toml`**: Configuration file for Foundry.

Refer to the detailed [ERC20-TD Guide](./ERC20-TD/README.md) for setup and execution.

---

### 2. **ERC20-223-721-TD Project**

This project demonstrates the development of ERC20, ERC223, and ERC721 smart contracts, emphasizing their interactions and token standards.

#### Features:
- Implemented ERC20 and ERC223 tokens with shared parameters (ticker, total supply, decimals).
- Developed an ERC721 token with minting functionality.
- Enabled purchasing of ERC721 tokens using both ERC20 and ERC223 tokens.
- Created a comprehensive testing suite to validate interactions between tokens.

📁 Folder: `ERC20-223-721-TD`
- **`src/MyERC20.sol`**: ERC20 token implementation.
- **`src/MyERC223.sol`**: ERC223 token implementation.
- **`src/MyERC721.sol`**: ERC721 token implementation.
- **`script/Deploy.s.sol`**: Deployment script for all contracts.
- **`test/MyTest.t.sol`**: Tests for minting and purchasing ERC721 tokens.

Refer to the detailed [ERC20-223-721-TD Guide](./ERC20-223-721-TD/README.md) for setup and execution.

---

### 3. **ERC20-721-Ticketing Project**

This project combines the development of ERC20 and ERC721 smart contracts with a React-based web interface for managing a ticketing system for concerts. It focuses on creating artist and venue profiles, managing ticket emission and sales, and handling post-concert revenue distribution.

#### Features:
- Create and modify artist profiles with attributes such as name, type, and total tickets sold.
- Define venue profiles, including available space and revenue percentage.
- Enable concert creation, with validation by artists and venues before the concert.
- Implement ticket emission, usage, and transfer functionality.
- Ensure secure and fair trading of tickets (cannot be sold for more than the purchase price).
- Allow artists to cash out revenue post-concert, with automatic revenue splitting between artist and venue.

📁 Folder: `ERC20-721-Ticketing`
- **`frontend/`**: React-based frontend for interacting with the contracts.
- **`script/Deploy.s.sol`**: Deployment script for all contracts.
- **`src/ContractERC20.sol`**: ERC20 token implementation for fungible payments.
- **`src/TicketingSystem.sol`**: ERC721 token implementation for non-fungible ticket representation.
- **`test/ContractExchange.t.sol`**: Test cases for token trading and validation.
- **`test/TicketingSystem.t.sol`**: Test cases for ticket emission, redemption, and revenue management.

Refer to the detailed [ERC20-721-Ticketing Guide](./ERC20-721-Ticketing/README.md) for setup and execution.

---

### 4. **ERC721-TD: Development of an ERC721 Token**

This project focuses on developing and deploying a custom ERC721 non-fungible token contract.

#### Features:
- Implemented a fully functional ERC721 token contract.
- Designed a deployment script for testnet deployment.
- Created a test suite to ensure token functionality and proper ownership management.

📁 Folder: `ERC721-TD`
- **`src/MyERC721.sol`**: Contains the ERC721 token implementation.
- **`script/DeployERC721.s.sol`**: Deployment script for the ERC721 token.
- **`README.md`**: Detailed documentation for the ERC721-TD project.
- **`lib/forge-std`**: Utilities and libraries for Foundry.
- **`foundry.toml`**: Configuration file for Foundry.

Refer to the detailed [ERC721-TD Guide](./ERC721-TD/README.md) for setup and execution.

---

### 5. **ERC721-UX: ERC721 Token Visualization and Manipulation**

This project involves building a user-friendly React-based dApp for interacting with ERC721 tokens deployed on the **Holesky Testnet**. The application allows users to visualize and manipulate ERC721 tokens from **Fake BAYC**, **Fake Nefturians**, and **Fake Meebits** contracts.

#### Features:
- Connects to the **Holesky Testnet** via **Metamask**.
- Displays ChainId, block number, and user address.
- Provides functionality to claim, buy, and view token metadata (image and attributes).
- Includes a minting function for selecting unminted tokens using signature data.

📁 Folder: `ERC721-UX`
- **`public/`**: Static assets and images.
- **`src/abi/`**: ABIs for interacting with the ERC721 contracts.
- **`src/pages/`**: React pages:
   - `/chain-info`: Displays blockchain details.
   - `/fakeBayc`: Displays collection and minting functionality.
   - `/fakeBayc/{tokenId}`: Token metadata details.
   - `/fakeNefturians`: Buy tokens.
   - `/fakeNefturians/{userAddress}`: Tokens owned by a user.
   - `/fakeMeebits`: Mint tokens with signature-based functionality.
- **`src/components/`**: Reusable components.
- **`src/data/`**: Utility functions for smart contract interactions.
- **`App.js`**: Main React file.

Refer to the detailed [ERC721-UX Guide](./erc721-ux/README.md) for setup and execution.

---

## License

This repository is licensed under the MIT License.

---

By exploring this repository, you’ll gain hands-on experience with Ethereum smart contracts, token standards, and blockchain interactions. For further inquiries, refer to the `README.md` in each project folder or open an issue on the repository.
