import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { Navigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import "./ChainInfo.css";

const ChainInfo = () => {
  const [chainId, setChainId] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [isInvalidChain, setIsInvalidChain] = useState(false);

  const connectToMetaMask = useCallback(async () => {
    try {
      if (typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.BrowserProvider(window.ethereum);

        const network = await provider.getNetwork();
        const chainId = network.chainId.toString();
        setChainId(chainId);

        if (chainId !== "17000") {
          setIsInvalidChain(true);
          return;
        }

        const blockNumber = await provider.getBlockNumber();
        setBlockNumber(blockNumber);

        setUserAddress(accounts[0]);

        window.ethereum.on("accountsChanged", (accounts) => {
          setUserAddress(accounts[0] || null);
        });

        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
      } else {
        alert("MetaMask is not installed!");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  }, []);

  useEffect(() => {
    connectToMetaMask();
  }, [connectToMetaMask]);

  if (isInvalidChain) {
    return <Navigate to="/error" />;
  }

  return (
    <PageWrapper>
      <div className="chain-info-container">
        <h1 className="chain-info-title">Chain Info</h1>
        {!userAddress ? (
          <button onClick={connectToMetaMask} className="chain-info-button">
            Connect to MetaMask
          </button>
        ) : (
          <div className="chain-info-details">
            <p className="chain-info-item">
              <strong>Chain ID:</strong> {chainId || "Loading..."}
            </p>
            <p className="chain-info-item">
              <strong>Last Block Number:</strong> {blockNumber || "Loading..."}
            </p>
            <p className="chain-info-item">
              <strong>User Address:</strong> {userAddress}
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default ChainInfo;