import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import fakeBaycData from "../abi/FakeBayc.json";
import "./FakeBayc.css";

const fakeBaycABI = fakeBaycData.abi;
const contractAddress = "0xdecFAB04fb08cC5da6365C18B26A6B9b1D4BEDFE";

const FakeBayc = () => {
  const [tokenName, setTokenName] = useState("Loading...");
  const [totalTokens, setTotalTokens] = useState("Loading...");
  const [userAddress, setUserAddress] = useState(null);
  const [error, setError] = useState(null);
  const [nftData, setNftData] = useState([]);
  const navigate = useNavigate();

  const ipfsToHttp = (url) => {
    if (url.startsWith("ipfs://")) {
      return url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
    }
    return url;
  };

  const connectToMetaMask = useCallback(async () => {
    try {
      if (typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setUserAddress(accounts[0]);
      } else {
        alert("MetaMask is not installed. Please install MetaMask to continue.");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error.message);
      setError(error.message);
    }
  }, []);

  const fetchContractData = useCallback(async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        setError("MetaMask is not installed.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, fakeBaycABI, provider);

      const name = await contract.name();
      const totalSupply = await contract.totalSupply();

      setTokenName(name);
      setTotalTokens(totalSupply.toString());

      const nftList = [];
      for (let i = 0; i < parseInt(totalSupply.toString(), 10); i++) {
        try {
          const tokenURI = await contract.tokenURI(i);
          const response = await fetch(tokenURI);
          const metadata = await response.json();
          nftList.push({
            id: i,
            name: metadata.name,
            image: ipfsToHttp(metadata.image),
            description: metadata.description,
          });
        } catch (fetchError) {
          console.error(`Error fetching metadata for token ${i}:`, fetchError);
        }
      }
      setNftData(nftList);
    } catch (error) {
      console.error("Error fetching contract data:", error.message);
      setError(error.message);
    }
  }, []);

  const claimNFT = useCallback(async () => {
    try {
      if (!userAddress) {
        alert("Please connect to MetaMask first.");
        return;
      }

      if (typeof window.ethereum === "undefined") {
        setError("MetaMask is not installed.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, fakeBaycABI, signer);

      const tx = await contract.claimAToken();
      console.log("Transaction sent:", tx);
      await tx.wait();

      alert("NFT claimed successfully!");
      fetchContractData();
    } catch (error) {
      console.error("Error claiming NFT:", error.message);
      setError(error.message);
    }
  }, [userAddress, fetchContractData]);

  useEffect(() => {
    connectToMetaMask();
    fetchContractData();
  }, [connectToMetaMask, fetchContractData]);

  return (
    <PageWrapper>
      <div className="fakebayc-container">
        <h1 className="fakebayc-title">Fake BAYC</h1>
        {error && <p className="fakebayc-error">Error: {error}</p>}
        <div className="fakebayc-info">
          <p>
            <strong>Token Name:</strong> {tokenName}
          </p>
          <p>
            <strong>Total Tokens:</strong> {totalTokens}
          </p>
          <p>
            <strong>Your Address:</strong> {userAddress || "Not connected"}
          </p>
          {userAddress && (
            <button className="fakebayc-claim-button" onClick={claimNFT}>
              Claim NFT
            </button>
          )}
        </div>
        <h2 className="fakebayc-subtitle">NFT Collection</h2>
        {nftData.length > 0 ? (
          <div className="fakebayc-grid">
            {nftData.map((nft) => (
              <div
                key={nft.id}
                className="fakebayc-card"
                onClick={() => navigate(`/fakeBayc/${nft.id}`)}
              >
                <img src={nft.image} alt={nft.name} className="fakebayc-image" />
                <h3 className="fakebayc-nft-name">{nft.name}</h3>
                <p className="fakebayc-nft-id">Fake BAYC #{nft.id}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="fakebayc-loading-text">Loading NFTs...</p>
        )}
      </div>
    </PageWrapper>
  );
};

export default FakeBayc;