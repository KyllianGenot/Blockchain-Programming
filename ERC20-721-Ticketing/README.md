# ERC20-721-Ticketing Project

This guide explains how to set up and run the **ERC20-721-Ticketing Project**, a decentralized application (dApp) with smart contracts and a web interface. The project is developed using **Foundry** and **React** to manage ticketing for concerts, including creating artist and venue profiles, emitting tickets, and handling ticket sales.

---

## Live Demo

**Live Demo**: [https://ticketing-marketplace.vercel.app/](https://ticketing-marketplace.vercel.app/)

---

## Screenshot

<img width="1426" alt="website" src="website.png">

---

## Features and Objectives

1. **Smart Contracts**  
   - Create a **ticketing contract**.
   - Define artist and venue profiles with modifiable attributes.
   - Enable concert creation with validation by artists and venues.

2. **Ticket Management**  
   - Emit and use tickets for concerts.  
   - Enable ticket buying, transferring, and safe trading (within specified conditions).  
   - Support ticket redemption with unique identifiers.

3. **Revenue Management**  
   - Allow artists to cash out after the concert.  
   - Ensure revenue is split between artists and venues.

4. **Web Interface**  
   - Interact with the smart contracts through a React-based web interface.

---

## Prerequisites

1. **Foundry**  
   Install Foundry by following the [Foundry Installation Guide](https://book.getfoundry.sh/getting-started/installation).

2. **Node.js and npm**  
   Download and install Node.js: [Node.js Official Site](https://nodejs.org/).

3. **Metamask Wallet**  
   Install Metamask: [Metamask Browser Extension](https://metamask.io/).

4. **Clone the Repository**  
   Use sparse checkout to clone only the required folder from your repository:
   ```bash
   # Clone the repository with no checkout
   git clone --no-checkout https://github.com/KyllianGenot/Blockchain-Programming.git

   # Navigate to the repository
    cd Blockchain-Programming

   # Configure sparse checkout
   git sparse-checkout init --cone
   git sparse-checkout set ERC20-721-Ticketing

   # Pull the repository
   git checkout

   # Navigate to the folder
   cd ERC20-721-Ticketing
   ```
5. **Set Up Environment Variables**  
   Create a `.env` file in the root directory and add:
   ```env
   RPC_URL=<your_testnet_rpc_url>
   PRIVATE_KEY=<your_private_key>
   ```
   
---

## Project Structure

- **`frontend/`**: This folder contains the React-based frontend application, which provides a user interface for interacting with the smart contracts deployed on the blockchain.
- **`script/Deploy.s.sol`**: This is the deployment script for deploying the smart contracts (ERC20, ERC721, and related functionality) to a blockchain network.
- **`src/ContractERC20.sol`**: The implementation of the ERC20 token contract, which defines a standard fungible token used for ticket purchases and payments.
- **`src/ContractExchange.sol`**: The implementation of the exchange-related contract, which facilitates the trading and transfer of tokens while adhering to ERC223 standards for safety in token transfers.
- **`src/TicketingSystem.sol`**: The core smart contract implementing the ticketing system using the ERC721 standard, which supports non-fungible tokens (NFTs) to represent individual tickets.
- **`test/ContractExchange.t.sol`**: Test cases for the `ContractExchange` functionality, including minting, transferring, and safety checks for ERC20 and ERC223 tokens.
- **`test/TicketingSystem.t.sol`**: Test cases for the `TicketingSystem` contract, validating operations such as ticket emission, purchase, redemption, and post-concert revenue distribution.

---

## Setting Up the Project

### 1. Install Dependencies

#### For Smart Contracts:
Navigate to the project root and install Foundry dependencies:
```bash
forge install
```

#### For Frontend:
Navigate to the `frontend/` folder and install Node.js dependencies:
```bash
cd frontend/
npm install
```

---

### 2. Compile the Smart Contracts

Compile all smart contracts using Foundry:
```bash
forge build
```

---

### 3. Test the Smart Contracts

Run the test suite to ensure all functions behave as expected:
```bash
forge test
```

---

### 4. Deploy the Smart Contracts

Deploy the contracts to a test network using the following command:
```bash
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast --private-key $PRIVATE_KEY
```

---

### 5. Run the Web Interface

Start the React development server to interact with the contracts:
```bash
cd frontend/
npm start
```

The application will be available at **[http://localhost:3000](http://localhost:3000)**.

---

## How It Works

### Smart Contract Features

1. **Artist Profile Management**  
   - Create and modify profiles with:
     - `Name`
     - `Artist Type`
     - `Total Tickets Sold`

2. **Venue Profile Management**  
   - Create and modify venue profiles with:
     - `Name`
     - `Space Available`
     - `% of Ticket Price Going to Venue`

3. **Concert Management**  
   - Create concerts with:
     - `Date of Concert`
     - `Artist and Venue ID`
   - Require validation by both the artist and the venue before the concert takes place.

4. **Ticket Management**  
   - Emit tickets owned by artists.  
   - Allow ticket owners to use tickets within 24 hours of the concert.  
   - Enable ticket buying and transferring.  
   - Ensure safe trading of tickets (cannot be sold for more than the purchase price).  
   - Redeem distributed tickets using a chain of characters.

5. **Revenue Management**  
   - Allow artists to cash out after the concert:
     - Validate that the concert has passed.
     - Split the revenue between the artist and venue.

---

## Deployment

To deploy your version of the dApp:
1. Deploy the smart contracts as described above.
2. Configure the frontend to point to your deployed contract addresses.

Optionally, deploy the frontend to a hosting platform like **Vercel**:
```bash
vercel
```

---

## License

This project is licensed under the MIT License.

---

By following this guide, you can set up, deploy, and test the **ERC20-721-Ticketing Project** locally or deploy it on a live network. For any issues or improvements, please open an issue in the repository.
