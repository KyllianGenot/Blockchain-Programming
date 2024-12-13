import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import PageWrapper from "../components/PageWrapper";
import fakeBaycData from "../abi/FakeBayc.json";
import "./FakeBaycToken.css";

const fakeBaycABI = fakeBaycData.abi;
const contractAddress = "0xdecFAB04fb08cC5da6365C18B26A6B9b1D4BEDFE";

const ipfsGateways = [
  "https://gateway.pinata.cloud/ipfs/",
  "https://ipfs.io/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
];

const ipfsToHttp = async (url) => {
  if (!url.startsWith("ipfs://")) return url;

  const cid = url.replace("ipfs://", "");
  for (let gateway of ipfsGateways) {
    const testUrl = `${gateway}${cid}`;
    try {
      const response = await fetch(testUrl, { method: "HEAD" });
      if (response.ok) return testUrl;
    } catch (error) {
      console.warn(`Gateway failed: ${gateway}`, error);
    }
  }
  throw new Error("All IPFS gateways failed.");
};

const FakeBaycToken = () => {
  const { tokenId } = useParams();
  const [tokenData, setTokenData] = useState(null);
  const [ownerAddress, setOwnerAddress] = useState("Loading...");
  const [error, setError] = useState(null);

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
        const resolvedTokenURI = await ipfsToHttp(tokenURI);

        const response = await fetch(resolvedTokenURI);
        const metadata = await response.json();
        const resolvedImage = await ipfsToHttp(metadata.image);
        metadata.image = resolvedImage;

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
        <div className="image-container">
          <img
            src={tokenData.image}
            alt={`Token ${tokenId}`}
            className="token-image"
          />
        </div>

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