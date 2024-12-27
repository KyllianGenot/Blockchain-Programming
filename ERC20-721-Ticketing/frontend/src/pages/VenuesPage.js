import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
} from "@mui/material";
import { Contract, decodeBytes32String, encodeBytes32String } from "ethers";
import { CONTRACT_ADDRESSES, ABIS } from "../config";

const VenuesPage = ({ provider, signer }) => {
  const [venues, setVenues] = useState([]);
  const [venueData, setVenueData] = useState({
    name: "",
    capacity: "",
    commission: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (provider) {
      loadVenues();
    }
  }, [provider]);

  const loadVenues = async () => {
    try {
      const ticketingSystem = new Contract(
        CONTRACT_ADDRESSES.TicketingSystem,
        ABIS.TicketingSystem,
        provider
      );
      const venueCount = await ticketingSystem.venueCount();
      const venuesArray = [];

      for (let i = 1; i <= venueCount; i++) {
        try {
          const venue = await ticketingSystem.venuesRegister(i);
          if (!venue) {
            console.warn(`Venue data with ID ${i} is not found.`);
            continue;
          }

          // Debug to check data
          console.log(`Venue ${i} retrieved:`, venue);

          venuesArray.push({
            id: i,
            name: venue.name ? decodeBytes32String(venue.name) : "Name unavailable",
            capacity: venue.capacity ? venue.capacity.toString() : "0",
            commission: venue.standardComission
              ? venue.standardComission.toString()
              : "0", // Converted to %
          });
        } catch (error) {
          console.error(`Error loading venue ID ${i}:`, error.message);
        }
      }

      setVenues(venuesArray);
    } catch (error) {
      console.error("Error loading venues:", error.message);
      setErrorMessage("Unable to load venues.");
    }
  };

  const createVenue = async () => {
    const { name, capacity, commission } = venueData;

    if (!name.trim() || !capacity.trim() || !commission.trim()) {
      setErrorMessage("All fields must be filled.");
      return;
    }

    try {
      const ticketingSystem = new Contract(
        CONTRACT_ADDRESSES.TicketingSystem,
        ABIS.TicketingSystem,
        signer
      );
      const venueNameBytes32 = encodeBytes32String(name);
      const tx = await ticketingSystem.createVenue(
        venueNameBytes32,
        parseInt(capacity),
        parseInt(commission)
      );
      await tx.wait();

      setSuccessMessage("Venue created successfully!");
      setVenueData({ name: "", capacity: "", commission: "" }); // Reset fields
      setErrorMessage(""); // Reset errors
      await loadVenues(); // Reload venues
    } catch (error) {
      console.error("Error creating venue:", error.message);
      setErrorMessage("Unable to create venue.");
    }
  };

  return (
    <Box p={4}>
      {/* Title Section */}
      <Typography variant="h4" gutterBottom>
        🏟️ Venue List
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Manage the venues in your ticketing system.
      </Typography>

      {/* Venue Creation Form */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Add a Venue
        </Typography>
        <TextField
          label="Venue Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={venueData.name}
          onChange={(e) => setVenueData({ ...venueData, name: e.target.value })}
        />
        <TextField
          label="Capacity"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={venueData.capacity}
          onChange={(e) =>
            setVenueData({ ...venueData, capacity: e.target.value })
          }
        />
        <TextField
          label="Commission (%)"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={venueData.commission}
          onChange={(e) =>
            setVenueData({ ...venueData, commission: e.target.value })
          }
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={createVenue}
          fullWidth
        >
          Create Venue
        </Button>
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

      {/* Venue List */}
      <Box mt={6}>
        <Typography variant="h5" gutterBottom>
          Current Venues
        </Typography>
        {venues.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No venues registered at the moment.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {venues.map((venue) => (
              <Grid item xs={12} sm={6} md={4} key={venue.id}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {venue.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      ID: {venue.id}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Capacity: {venue.capacity}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Commission: {venue.commission}%
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => alert(`Venue ID: ${venue.id}`)}
                    >
                      Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default VenuesPage;