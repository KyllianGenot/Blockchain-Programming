import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import fakeNefturiansData from "../abi/FakeNefturians.json";
import "./FakeNefturians.css";

const fakeNefturiansABI = fakeNefturiansData.abi;
const contractAddress = "0x92Da472BE336A517778B86D7982e5fde0C7993c1";

const FakeNefturians = () => {
  const [tokenPrice, setTokenPrice] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTokenPrice = async () => {
      try {
        if (typeof window.ethereum === "undefined") {
          setError("MetaMask is not installed.");
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, fakeNefturiansABI, provider);

        const price = await contract.tokenPrice();
        setTokenPrice(ethers.formatEther(price));
      } catch (err) {
        console.error("Error fetching token price:", err.message);
        setError(err.message);
      }
    };

    fetchTokenPrice();
  }, []);

  const buyToken = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        setError("MetaMask is not installed.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, fakeNefturiansABI, signer);

      const value = ethers.parseEther((parseFloat(tokenPrice) + 0.005).toFixed(2));
      const tx = await contract.buyAToken({ value });
      await tx.wait();

      setSuccess("Token purchased successfully!");
      setError(null);
    } catch (err) {
      console.error("Error buying token:", err.message);
      setError("Transaction failed. Please ensure you send more than the minimum token price.");
      setSuccess(null);
    }
  };

  return (
    <PageWrapper>
      <div className="fakenefturians-container">
        <h1 className="fakenefturians-title">Fake Nefturians</h1>
        {error && <p className="fakenefturians-error">{error}</p>}
        {success && <p className="fakenefturians-success">{success}</p>}
        <div className="fakenefturians-info">
          <p>
            <strong>Minimum Token Price:</strong>{" "}
            {tokenPrice ? `${tokenPrice} ETH` : "Loading..."}
          </p>
        </div>
        <button onClick={buyToken} className="fakenefturians-button">
          Buy Token
        </button>
        <div className="fakenefturians-subtitle">Search User's NFTs</div>
        <div className="fakenefturians-search">
          <input
            type="text"
            placeholder="Enter user address"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
            className="fakenefturians-input"
          />
          <button
            onClick={() => navigate(`/fakeNefturians/${userAddress}`)}
            className="fakenefturians-button"
          >
            View NFTs
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default FakeNefturians;
