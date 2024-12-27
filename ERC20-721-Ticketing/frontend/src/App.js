import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BrowserProvider } from "ethers";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import "./styles/App.css";

// Import components
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorPage from "./components/ErrorPage";

// Import pages
import HomePage from "./pages/HomePage";
import ArtistsPage from "./pages/ArtistsPage";
import VenuesPage from "./pages/VenuesPage";
import ConcertsPage from "./pages/ConcertsPage";
import TicketsPage from "./pages/TicketsPage";
import ExchangePage from "./pages/ExchangePage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Initialize Ethereum connection
  useEffect(() => {
    const initializeEthereum = async () => {
      if (window.ethereum) {
        try {
          const providerInstance = new BrowserProvider(window.ethereum);
          const signerInstance = await providerInstance.getSigner();
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

          setProvider(providerInstance);
          setSigner(signerInstance);
          setAccount(accounts[0]);
          setIsLoading(false);
        } catch (error) {
          setError("Error connecting to the Ethereum wallet.");
          console.error(error.message);
          setIsLoading(false);
        }
      } else {
        setError("Please install MetaMask to use this application.");
        setIsLoading(false);
      }
    };

    initializeEthereum();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorPage message={error} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="page-container">
        <Router>
          <NavBar account={account} />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/artists" element={<ArtistsPage provider={provider} signer={signer} account={account} />} />
              <Route path="/venues" element={<VenuesPage provider={provider} signer={signer} account={account} />} />
              <Route path="/concerts" element={<ConcertsPage provider={provider} signer={signer} />} />
              <Route path="/tickets" element={<TicketsPage provider={provider} signer={signer} account={account} />} />
              <Route path="/exchange" element={<ExchangePage provider={provider} signer={signer} account={account} />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
