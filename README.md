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

### 3. **ERC721-TD: Development of an ERC721 Token**

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

## License

This repository is licensed under the MIT License.

---

By exploring this repository, you’ll gain hands-on experience with Ethereum smart contracts, token standards, and blockchain interactions. For further inquiries, refer to the `README.md` in each project folder or open an issue on the repository.
