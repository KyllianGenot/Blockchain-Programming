import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import PageWrapper from "../components/PageWrapper"; // Import PageWrapper
import fakeBaycData from "../abi/FakeBayc.json";
import "./FakeBaycToken.css"; // Import the CSS

const fakeBaycABI = fakeBaycData.abi;
const contractAddress = "0xdecFAB04fb08cC5da6365C18B26A6B9b1D4BEDFE";

const FakeBaycToken = () => {
  const { tokenId } = useParams();
  const [tokenData, setTokenData] = useState(null);
  const [ownerAddress, setOwnerAddress] = useState("Loading...");
  const [error, setError] = useState(null);

  const ipfsToHttp = (url) => {
    if (url.startsWith("ipfs://")) {
      return url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
    }
    return url;
  };

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        if (typeof window.ethereum === "undefined") {
          setError("MetaMask is not installed.");
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, fakeBaycABI, provider);

        const totalSupply = await contract.totalSupply();
        if (parseInt(tokenId) >= parseInt(totalSupply.toString())) {
          setError(`The token #${tokenId} does not exist.`);
          return;
        }

        const tokenURI = await contract.tokenURI(tokenId);
        const response = await fetch(tokenURI);
        const metadata = await response.json();
        metadata.image = ipfsToHttp(metadata.image);
        setTokenData(metadata);

        const owner = await contract.ownerOf(tokenId);
        setOwnerAddress(owner);
      } catch (error) {
        console.error("Error fetching token data:", error.message);
        setError("Failed to load token data. Please ensure the token exists.");
      }
    };

    fetchTokenData();
  }, [tokenId]);

  if (error) {
    return (
      <PageWrapper>
        <div className="error-container">
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      </PageWrapper>
    );
  }

  if (!tokenData) {
    return (
      <PageWrapper>
        <div className="loading">Loading...</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="fakebayc-token-container">
        {/* Image Container */}
        <div className="image-container">
          <img
            src={tokenData.image}
            alt={`Token ${tokenId}`}
            className="token-image"
          />
        </div>

        {/* Information Container */}
        <div className="info-container">
          <div className="text-wrapper">
            <h1 className="fakebayc-title">Fake BAYC Token #{tokenId}</h1>
            <h3 className="nft-name">{tokenData.name}</h3>
            <p className="description">{tokenData.description}</p>

            <div className="attributes">
              {tokenData.attributes?.map((attr, index) => (
                <div key={index} className="attribute-item">
                  <strong>{attr.trait_type}:</strong> {attr.value}
                </div>
              ))}
            </div>

            <div className="owner">
              <h4>Owner:</h4>
              <p>{ownerAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default FakeBaycToken;
