import React, { useState } from "react";
import { BrowserProvider, Contract, parseEther } from "ethers";
import fakeMeebitsClaimerData from "../abi/FakeMeebitsClaimer.json";
import signatureData from "../data/output-sig.json";
import PageWrapper from "../components/PageWrapper";
import "./FakeMeebits.css";

const fakeMeebitsClaimerABI = fakeMeebitsClaimerData.abi;
const claimerContractAddress = "0x9B6F990793347005bb8a252A67F0FA4d56521447";

const FakeMeebits = () => {
  const [tokenId, setTokenId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClaimed, setIsClaimed] = useState(null);

  const checkTokenStatus = async () => {
    if (!tokenId || isNaN(tokenId) || tokenId < 0 || tokenId > 19999) {
      setMessage("Please enter a valid Token ID (0-19999).");
      return;
    }

    try {
      if (typeof window.ethereum === "undefined") {
        setMessage("MetaMask is not installed.");
        return;
      }

      setLoading(true);
      setMessage("");

      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(
        claimerContractAddress,
        fakeMeebitsClaimerABI,
        provider
      );

      const claimed = await contract.tokensThatWereClaimed(tokenId);
      setIsClaimed(claimed);

      if (claimed) {
        setMessage(`Token #${tokenId} has already been minted.`);
      } else {
        setMessage(`Token #${tokenId} is available to claim.`);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message || "An error occurred while checking the token status.");
    } finally {
      setLoading(false);
    }
  };

  const claimToken = async () => {
    if (!tokenId || isNaN(tokenId) || tokenId < 0 || tokenId > 19999) {
      setMessage("Please select a valid Token ID (0-19999).");
      return;
    }

    if (isClaimed) {
      setMessage(`Token #${tokenId} has already been minted.`);
      return;
    }

    try {
      if (typeof window.ethereum === "undefined") {
        setMessage("MetaMask is not installed.");
        return;
      }

      setLoading(true);

      const signatureEntry = signatureData.find(
        (entry) => entry.tokenNumber === Number(tokenId)
      );

      if (!signatureEntry) {
        setMessage("Signature not found for the selected Token ID.");
        return;
      }

      const signature = signatureEntry.signature;

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(
        claimerContractAddress,
        fakeMeebitsClaimerABI,
        signer
      );

      const tx = await contract.claimAToken(tokenId, signature, {
        value: parseEther("0"),
      });
      await tx.wait();

      setMessage(`Token #${tokenId} claimed successfully!`);
      setIsClaimed(true);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "An error occurred while claiming the token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="fakemeebits-container">
        <h1 className="fakemeebits-title">Fake Meebits - Claim Your Token</h1>
        {message && (
          <p
            className={
              message.includes("successfully") || message.includes("available")
                ? "fakemeebits-success"
                : "fakemeebits-error"
            }
          >
            {message}
          </p>
        )}
        <div className="fakemeebits-input-section">
          <input
            type="number"
            placeholder="Enter Token ID (0-19999)"
            value={tokenId}
            onChange={(e) => {
              setTokenId(e.target.value);
              setIsClaimed(null);
              setMessage("");
            }}
            className="fakemeebits-input"
            min="0"
            max="19999"
          />
          <div className="fakemeebits-button-container">
            <button
              onClick={checkTokenStatus}
              className="fakemeebits-button fakemeebits-check-button"
              disabled={loading}
            >
              {loading ? "Checking..." : "Check Token"}
            </button>
            <button
              onClick={claimToken}
              className="fakemeebits-button fakemeebits-claim-button"
              disabled={loading || isClaimed === true || isClaimed === null}
            >
              {loading ? "Processing..." : "Claim Token"}
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default FakeMeebits;
