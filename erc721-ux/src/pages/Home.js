import React from "react";
import PageWrapper from "../components/PageWrapper";
import "./Home.css"; // Importation des styles locaux

const Home = () => {
  return (
    <PageWrapper>
      <div className="home-container glassmorphism">
        <h1 className="home-title text-title">Blockchain Info App</h1>
        <p className="home-description text-lg">
          Welcome to the <strong>Blockchain Info App!</strong> This project demonstrates how to interact with blockchain networks and smart contracts using modern web technologies.
        </p>
        <ul className="home-list text-md">
          <li>🔗 Connecting to blockchain networks via MetaMask.</li>
          <li>🖼️ Exploring and claiming NFT tokens from different collections.</li>
          <li>📊 Retrieving blockchain data, such as chain IDs and block information.</li>
          <li>⚙️ Interacting with multiple smart contracts, including Fake BAYC, Fake Nefturians, and Fake Meebits.</li>
        </ul>
        <p className="home-description">
          The project is built using <strong>React.js</strong> and <strong>Ethers.js</strong>, adhering to modern frontend design principles.
          It provides a practical learning example for developers and enthusiasts to experiment with blockchain-based applications.
        </p>
      </div>
    </PageWrapper>
  );
};

export default Home;
