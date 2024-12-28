import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
} from "@mui/material";
import { Contract, parseEther, formatEther, formatUnits } from "ethers";
import { CONTRACT_ADDRESSES, ABIS } from "../config";

const TicketsPage = ({ provider, signer, account }) => {
  const [tickets, setTickets] = useState([]);
  const [concertId, setConcertId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("ETH"); // Default to ETH payment
  const [price, setPrice] = useState(null); // Ticket price
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const EXCHANGE_RATE = 3400; // Conversion rate (1 ETH = 3400 ERC20)

  // Load user's tickets
  const loadUserTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      const ticketingSystem = new Contract(
        CONTRACT_ADDRESSES.TicketingSystem,
        ABIS.TicketingSystem,
        provider
      );

      const userTickets = await ticketingSystem.getUserTickets(account);

      // Format tickets
      const formattedTickets = userTickets.map((ticket) => ({
        id: ticket[0]?.toString(),
        concertId: ticket[1]?.toString(),
        price: formatUnits(ticket[5], 18),
      }));

      setTickets(formattedTickets);
    } catch (error) {
      console.error("Error loading tickets:", error.message);
      setErrorMessage("Unable to load your tickets.");
    } finally {
      setIsLoading(false);
    }
  }, [provider, account]);

  useEffect(() => {
    if (provider && account) {
      loadUserTickets();
    }
  }, [provider, account, loadUserTickets]);

  // Fetch ticket price
  const fetchTicketPrice = async (concertId) => {
    try {
      const ticketingSystem = new Contract(
        CONTRACT_ADDRESSES.TicketingSystem,
        ABIS.TicketingSystem,
        provider
      );
      const concert = await ticketingSystem.concertsRegister(concertId);
      const priceInEth = parseFloat(formatEther(concert.ticketPrice));
      const priceInErc20 = priceInEth * EXCHANGE_RATE;
      setPrice({ eth: priceInEth.toFixed(2), erc20: priceInErc20.toFixed(0) });
    } catch (error) {
      console.error("Error fetching ticket price:", error.message);
      setPrice(null);
    }
  };

  // Buy a ticket using ETH
  const buyTicketWithEth = async (concertId) => {
    try {
      if (!concertId) {
        setErrorMessage("Please enter a valid concert ID.");
        return;
      }

      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const ticketingSystem = new Contract(
        CONTRACT_ADDRESSES.TicketingSystem,
        ABIS.TicketingSystem,
        signer
      );

      const tx = await ticketingSystem.buyTicket(concertId, {
        value: parseEther(price.eth), // Use the fetched price
      });

      await tx.wait();

      setSuccessMessage(`Ticket successfully purchased for concert ID: ${concertId}`);
      await loadUserTickets(); // Reload tickets
    } catch (error) {
      console.error("Error purchasing ticket:", error.message);
      setErrorMessage("Unable to purchase the ticket. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Buy a ticket using ERC20
  const buyTicketWithErc20 = async (concertId) => {
    try {
      if (!concertId) {
        setErrorMessage("Please enter a valid concert ID.");
        return;
      }

      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const exchangeContract = new Contract(
        CONTRACT_ADDRESSES.ContractExchange,
        ABIS.ContractExchange,
        signer
      );

      const tx = await exchangeContract.buyTicketWithERC20(concertId);
      await tx.wait();

      setSuccessMessage(`Ticket successfully purchased with ERC20 for concert ID: ${concertId}`);
      await loadUserTickets(); // Reload tickets
    } catch (error) {
      console.error("Error purchasing ticket with ERC20:", error.message);
      setErrorMessage("Unable to purchase the ticket with ERC20. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Approve ERC20 tokens before purchase
  const approveERC20 = async () => {
    try {
      if (!price || !price.erc20) {
        setErrorMessage("Unable to approve tokens. Please select a valid concert and try again.");
        return;
      }

      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const erc20Contract = new Contract(
        CONTRACT_ADDRESSES.ContractERC20,
        ABIS.ContractERC20,
        signer
      );

      const erc20price = parseEther(price.erc20);
      const plusone = parseEther("1");
      const amountToApprove = erc20price+plusone;

      const tx = await erc20Contract.approve(
        CONTRACT_ADDRESSES.ContractExchange,
        amountToApprove
      );
      await tx.wait();

      setSuccessMessage(
        `Approval successful! You can now purchase a ticket with ERC20. Amount approved: ${formatEther(amountToApprove)} ERC20`
      );
    } catch (error) {
      console.error("Error approving tokens:", error.message);
      setErrorMessage("Unable to approve ERC20 tokens. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        🎫 My Tickets
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Find all the tickets you have purchased here.
      </Typography>
  
      {/* List of tickets */}
      <Box mt={3}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" mt={3}>
            <CircularProgress />
          </Box>
        ) : tickets.length > 0 ? (
          tickets.map((ticket, index) => (
            <Box
              key={`${ticket.id}-${index}`}
              display="flex"
              flexDirection="column"
              bgcolor="background.paper"
              p={3}
              mb={3}
              borderRadius={3}
              boxShadow={4}
              sx={{
                border: "2px solid #4B2C22", // Border for an elegant look
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Colored stripe at the top */}
              <Box
                sx={{
                  backgroundColor: "primary.main",
                  height: "5px",
                  width: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
  
              {/* Title */}
              <Typography
                variant="h6"
                align="center"
                color="textPrimary"
                gutterBottom
                sx={{ fontWeight: "bold", mt: 1 }}
              >
                🎟️ Your Concert Ticket
              </Typography>
  
              {/* Main content */}
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography variant="body1">
                    <strong>Concert ID:</strong> {ticket.id}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Address:</strong> {ticket.concertId}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="body1">
                    <strong>Price:</strong>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {ticket.price} ETH
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    (~{(parseFloat(ticket.price) * EXCHANGE_RATE).toFixed(0)} ERC20)
                  </Typography>
                </Box>
              </Box>
  
              {/* Styled line */}
              <Box
                sx={{
                  backgroundColor: "grey.300",
                  height: "1px",
                  width: "100%",
                  mt: 2,
                  mb: 2,
                }}
              />
  
              {/* Additional message */}
              <Typography
                variant="body2"
                color="textSecondary"
                align="center"
              >
                Thank you for your purchase! 🎶
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            You don't have any tickets yet.
          </Typography>
        )}
      </Box>
  
      {/* Section to buy a new ticket */}
      <Box mt={5}>
        <Typography variant="h5">Buy a Ticket</Typography>
        <TextField
          label="Concert ID"
          variant="outlined"
          fullWidth
          margin="normal"
          value={concertId}
          onChange={(e) => {
            setConcertId(e.target.value);
            fetchTicketPrice(e.target.value); // Fetch the price on each change
          }}
        />
        <Box mt={2}>
          <Typography variant="body1">Payment Method:</Typography>
          <Select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            fullWidth
          >
            <MenuItem value="ETH">ETH</MenuItem>
            <MenuItem value="ERC20">ERC20</MenuItem>
          </Select>
        </Box>
        {price && (
          <Typography variant="body2" mt={2}>
            Price: {paymentMethod === "ETH" ? `${price.eth} ETH` : `${price.erc20} ERC20`}
          </Typography>
        )}
        <Box mt={2}>
          {paymentMethod === "ETH" ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => buyTicketWithEth(concertId)}
              fullWidth
              disabled={isLoading || !concertId || !price}
            >
              {isLoading ? <CircularProgress size={24} /> : "Buy with ETH"}
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                color="secondary"
                onClick={approveERC20}
                fullWidth
                disabled={isLoading}
              >
                Approve ERC20
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => buyTicketWithErc20(concertId)}
                fullWidth
                disabled={isLoading || !concertId || !price}
                sx={{ mt: 2 }}
              >
                {isLoading ? <CircularProgress size={24} /> : "Buy with ERC20"}
              </Button>
            </>
          )}
        </Box>
      </Box>
  
      {/* Error and success messages */}
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mt: 3 }}>
          {successMessage}
        </Alert>
      )}
    </Box>
  );
};

export default TicketsPage;