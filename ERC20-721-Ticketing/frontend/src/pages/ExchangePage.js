import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { parseEther, Contract } from "ethers";
import { CONTRACT_ADDRESSES, ABIS } from "../config";

const ExchangePage = ({ provider, signer, account }) => {
  const [ethAmount, setEthAmount] = useState("");
  const [erc20Balance, setErc20Balance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadErc20Balance = useCallback(async () => {
    try {
      const erc20Contract = new Contract(
        CONTRACT_ADDRESSES.ContractERC20,
        ABIS.ContractERC20,
        provider
      );
      const balance = await erc20Contract.balanceOf(account);
      setErc20Balance((Number(balance) / 1e18).toFixed(2));
    } catch (error) {
      console.error("Error loading ERC20 balance:", error.message);
      setErrorMessage("Unable to load ERC20 balance.");
    }
  }, [provider, account]);

  useEffect(() => {
    if (provider && account) {
      loadErc20Balance();
    }
  }, [provider, account, loadErc20Balance]);

  const exchangeEthToErc20 = async () => {
    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      setErrorMessage("Please enter a valid amount in ETH.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const exchangeContract = new Contract(
        CONTRACT_ADDRESSES.ContractExchange,
        ABIS.ContractExchange,
        signer
      );

      // Convert ETH amount to Wei
      const ethInWei = parseEther(ethAmount);

      // Perform the exchange
      const tx = await exchangeContract.exchangeEthForErc20({ value: ethInWei });
      await tx.wait();

      const erc20Amount = parseFloat(ethAmount) * 3400;
      setSuccessMessage(`Exchange successful! You received ${erc20Amount.toFixed(2)} ERC20.`);
      setEthAmount("");

      // Update ERC20 balance
      await loadErc20Balance();
    } catch (error) {
      console.error("Error exchanging ETH for ERC20:", error.message);
      setErrorMessage("Unable to perform the exchange. Please check your balance or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        🔄 Exchange ETH for ERC20
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Use this page to convert your ETH into ERC20 tokens. Ensure your wallet is connected.
      </Typography>

      {/* Current balance */}
      <Box mt={3}>
        <Typography variant="body1">
          Current ERC20 balance: <strong>{erc20Balance || "Loading..."}</strong> MPT
        </Typography>
      </Box>

      {/* Exchange form */}
      <Box mt={4}>
        <TextField
          label="Amount in ETH"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={exchangeEthToErc20}
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Exchange"}
        </Button>

        {/* Error or success messages */}
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {successMessage}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default ExchangePage;