# Running the ERC20-TD Project

This guide explains how to set up and run the **ERC20-TD project**, developed using **Foundry**.

---

## Prerequisites

1. **Install Foundry**  
   Install Foundry to compile, deploy, and test the project. Follow the [Foundry Installation Guide](https://book.getfoundry.sh/getting-started/installation).

2. **Set Up an Ethereum Testnet Provider**  
   - Use a provider like **Alchemy** or **Infura** for the Holesky test network.  
   - Obtain an API key and RPC URL.  
   - Ensure your wallet is funded with test ETH from the Holesky faucet.

3. **Clone the Repository**  
   Use sparse checkout to clone only the required folder:
   ```bash
   # Clone the repository with no checkout
   git clone --no-checkout https://github.com/KyllianGenot/Blockchain-Programming.git
   
   # Navigate to the repository
   cd Blockchain-Programming
   
   # Configure sparse checkout
   git sparse-checkout init --cone
   git sparse-checkout set ERC20-TD
   
   # Pull the specified folder
   git checkout

   # Navigate to the folder
   cd ERC20-TD
   ```

4. **Set Up Environment Variables**  
   Create a `.env` file in the root directory and add:
   ```env
   MNEMONIC=<your_wallet_mnemonic>
   RPC_URL=<your_testnet_rpc_url>
   PRIVATE_KEY=<your_private_key>
   ```

---

## Project Structure

- **`src/myToken.sol`**: Contains the implementation of the ERC20 token.
- **`script/deployToken.sol`**: Script to deploy the token to a blockchain network.
- **`lib/forge-std`**: A standard library for testing and utilities in Foundry.
- **`foundry.toml`**: Configuration file for Foundry.

---

## Running the Project

### 1. **Install Dependencies**
Run the following command to install dependencies:
```bash
forge install
```

---

### 2. **Compile the Project**
Compile the smart contracts to ensure no errors:
```bash
forge build
```

---

### 3. **Deploy the Token**

#### Local Deployment (for testing):
Run the deployment script locally using a forked network:
```bash
forge script script/deployToken.sol --fork-url http://localhost:8545 --broadcast
```

#### Deployment to Holesky Testnet:
Deploy the ERC20 token contract to the Holesky test network:
```bash
forge script script/deployToken.sol --rpc-url $RPC_URL --broadcast --private-key $PRIVATE_KEY
```

---

### 4. **Testing the Implementation**

Run the test suite to validate the functionality:
```bash
forge test
```

---

### 5. **Interact with the Token**

Once deployed, interact with the token using the `deployToken.sol` script or via web3 tools like Remix, Hardhat, or Ethers.js.

---

## Additional Notes

- **Environment Variables**: Ensure the `.env` file is correctly configured with your RPC URL and wallet details.
- **Test Thoroughly**: Test in the local environment before deploying to a testnet.
- **Documentation**: Refer to the `README.md` in each directory for specific implementation details.

---

## License
This project is licensed under the MIT License.

---

By following this guide, you can successfully set up, run, and test the **ERC20-TD project**.
