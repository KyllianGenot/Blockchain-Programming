import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import PageWrapper from "../components/PageWrapper"; // Import PageWrapper
import fakeNefturiansData from "../abi/FakeNefturians.json";
import "./FakeNefturiansUser.css"; // Import the CSS

const fakeNefturiansABI = fakeNefturiansData.abi;
const contractAddress = "0x92Da472BE336A517778B86D7982e5fde0C7993c1";

const FakeNefturiansUser = () => {
  const { userAddress } = useParams();
  const [ownedTokens, setOwnedTokens] = useState([]);
  const [error, setError] = useState(null);

  const ipfsToHttp = (url) => {
    return url.startsWith("ipfs://")
      ? url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
      : url;
  };

  useEffect(() => {
    const fetchUserTokens = async () => {
      try {
        if (typeof window.ethereum === "undefined") {
          setError("MetaMask is not installed.");
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, fakeNefturiansABI, provider);

        const totalSupply = await contract.totalSupply();
        const tokens = [];

        for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
          const owner = await contract.ownerOf(tokenId);
          if (owner.toLowerCase() === userAddress.toLowerCase()) {
            const tokenURI = await contract.tokenURI(tokenId);
            const response = await fetch(ipfsToHttp(tokenURI));
            const metadata = await response.json();
            tokens.push({
              tokenId,
              name: metadata.name,
              description: metadata.description,
              image: ipfsToHttp(metadata.image),
            });
          }
        }
        setOwnedTokens(tokens);
      } catch (error) {
        console.error("Error fetching user tokens:", error.message);
        setError(error.message);
      }
    };

    fetchUserTokens();
  }, [userAddress]);

  return (
    <PageWrapper>
      <div className="fakenefturians-container">
        <h1 className="fakenefturians-title">Fake Nefturians</h1>
        <h2 className="fakenefturians-subtitle">
          User Address: <span>{userAddress}</span>
        </h2>
        {error ? (
          <div className="fakenefturians-error">{error}</div>
        ) : ownedTokens.length > 0 ? (
          <div className="fakenefturians-grid">
            {ownedTokens.map((token) => (
              <div key={token.tokenId} className="fakenefturians-card">
                <img
                  src={token.image}
                  alt={`Token ${token.tokenId}`}
                  className="fakenefturians-image"
                />
                <h3 className="fakenefturians-nft-name">{token.name}</h3>
                <p className="fakenefturians-description">{token.description}</p>
                <p className="fakenefturians-tokenid">Token ID: #{token.tokenId}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="fakenefturians-no-tokens">
            This user does not own any Fake Nefturians tokens.
          </p>
        )}
      </div>
    </PageWrapper>
  );
};

export default FakeNefturiansUser;
