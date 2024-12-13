import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import PageWrapper from "../components/PageWrapper";
import fakeNefturiansData from "../abi/FakeNefturians.json";
import "./FakeNefturiansUser.css";

const fakeNefturiansABI = fakeNefturiansData.abi;
const contractAddress = "0x92Da472BE336A517778B86D7982e5fde0C7993c1";

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

const FakeNefturiansUser = () => {
  const { userAddress } = useParams();
  const [ownedTokens, setOwnedTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserTokens = async () => {
      try {
        if (typeof window.ethereum === "undefined") {
          setError("MetaMask is not installed.");
          setIsLoading(false);
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, fakeNefturiansABI, provider);

        const totalSupply = await contract.totalSupply();

        const requests = Array.from({ length: Number(totalSupply) }, (_, tokenId) =>
          contract.ownerOf(tokenId).then(async (owner) => {
            if (owner.toLowerCase() === userAddress.toLowerCase()) {
              try {
                const tokenURI = await contract.tokenURI(tokenId);
                const resolvedTokenURI = await ipfsToHttp(tokenURI);
                const response = await fetch(resolvedTokenURI);
                const metadata = await response.json();
                const resolvedImage = await ipfsToHttp(metadata.image);

                return {
                  tokenId,
                  name: metadata.name,
                  description: metadata.description,
                  image: resolvedImage,
                };
              } catch (fetchError) {
                console.error(`Failed to fetch metadata for token ${tokenId}:`, fetchError);
              }
            }
            return null;
          })
        );

        const tokens = await Promise.all(requests);
        const filteredTokens = tokens.filter((token) => token !== null);
        setOwnedTokens(filteredTokens);
      } catch (error) {
        console.error("Error fetching user tokens:", error.message);
        setError("Failed to load tokens. Please try again.");
      } finally {
        setIsLoading(false);
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

        {isLoading ? (
          <div className="fakenefturians-loading">Loading NFTs...</div>
        ) : error ? (
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