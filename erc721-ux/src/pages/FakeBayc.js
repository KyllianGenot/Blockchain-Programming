import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import fakeBaycData from "../abi/FakeBayc.json";
import "./FakeBayc.css";

const fakeBaycABI = fakeBaycData.abi;
const contractAddress = "0xdecFAB04fb08cC5da6365C18B26A6B9b1D4BEDFE";

const ipfsGateways = ["https://ipfs.io/ipfs/", "https://dweb.link/ipfs/"];

const ipfsToHttp = async (url) => {
  if (!url.startsWith("ipfs://")) return url;
  const cid = url.replace("ipfs://", "");
  for (let gateway of ipfsGateways) {
    const testUrl = `${gateway}${cid}`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(testUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) return testUrl;
    } catch (error) {
      console.warn(`Gateway failed: ${gateway}`, error.message);
    }
  }
  throw new Error("All IPFS gateways failed.");
};

const FakeBayc = () => {
  const [tokenName, setTokenName] = useState("Loading...");
  const [totalTokens, setTotalTokens] = useState(0);
  const [userAddress, setUserAddress] = useState(null);
  const [error, setError] = useState(null);
  const [nftData, setNftData] = useState([]);
  const [isSearching, setIsSearching] = useState(true);
  const [showCompleteMessage, setShowCompleteMessage] = useState(false);
  const navigate = useNavigate();

  const connectToMetaMask = useCallback(async () => {
    try {
      if (window.ethereum?.isMetaMask) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setUserAddress(accounts[0]);
      } else {
        alert("MetaMask is not installed. Please install MetaMask.");
      }
    } catch (error) {
      console.error("MetaMask Connection Error:", error.message);
      setError("Failed to connect to MetaMask. Try again.");
    }
  }, []);

  const fetchContractData = useCallback(async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, fakeBaycABI, provider);
  
      const name = await contract.name();
      const totalSupply = Number(await contract.totalSupply());
  
      setTokenName(name);
      setTotalTokens(totalSupply);
  
      const cachedNFTs = JSON.parse(localStorage.getItem("fakeBaycNFTs")) || [];
      setNftData(cachedNFTs);
  
      const loadedIds = new Set(cachedNFTs.map((nft) => nft.id));
  
      const loadMissingTokens = async () => {
        for (let i = 0; i < totalSupply; i++) {
          if (!loadedIds.has(i)) {
            try {
              const uri = await contract.tokenURI(i);
              const resolvedUri = await ipfsToHttp(uri);
              const metadataResponse = await fetch(resolvedUri);
              const metadata = await metadataResponse.json();
              const imageUrl = await ipfsToHttp(metadata.image);
  
              const newNFT = { id: i, name: metadata.name, image: imageUrl };
  
              setNftData((prev) => {
                const updatedData = [...prev, newNFT];
                localStorage.setItem("fakeBaycNFTs", JSON.stringify(updatedData));
                return updatedData;
              });
  
              loadedIds.add(i);
            } catch (error) {
              console.warn(`Error fetching token ${i}:`, error.message);
            }
          }
        }
      };
  
      await loadMissingTokens();
  
      while (loadedIds.size < totalSupply) {
        console.log("Retrying to load missing NFTs...");
        await loadMissingTokens();
      }
      
      setIsSearching(false);

      if (loadedIds.size >= totalSupply) {
        setIsSearching(false);
        setShowCompleteMessage(true);
        setTimeout(() => {
          setShowCompleteMessage(false);
        }, 5000);
      }      

    } catch (error) {
      console.error("Error fetching contract data:", error.message);
      setError("Failed to load NFT collection. Please try again.");
      setIsSearching(false);
    }
  }, []);  

  const claimNFT = useCallback(async () => {
    try {
      if (!userAddress) {
        alert("Please connect to MetaMask first.");
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
      setError("Failed to claim NFT. Please try again.");
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
        {error && <p className="fakebayc-error">{error}</p>}
        <div className="fakebayc-info">
          <p><strong>Token Name:</strong> {tokenName}</p>
          <p><strong>Total Tokens:</strong> {totalTokens}</p>
          <p><strong>Your Address:</strong> {userAddress || "Not connected"}</p>
          {userAddress && (
            <button className="fakebayc-claim-button" onClick={claimNFT}>
              Claim NFT
            </button>
          )}
        </div>
        <h2 className="fakebayc-subtitle">NFT Collection</h2>
        <div className="fakebayc-grid">
          {[...nftData]
            .sort((a, b) => a.id - b.id)
            .map((nft) => (
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
        {isSearching && nftData.length < totalTokens && (
          <p className="fakebayc-loading-text">Searching for missing NFTs... This might take a few moments.</p>
        )}
        {!isSearching && showCompleteMessage && (
          <p className="fakebayc-complete-text">All NFTs have been loaded!</p>
        )}
      </div>
    </PageWrapper>
  );
};

export default FakeBayc;