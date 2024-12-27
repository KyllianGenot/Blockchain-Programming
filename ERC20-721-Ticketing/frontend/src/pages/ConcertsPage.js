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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Contract, parseEther, formatEther, toUtf8String } from "ethers";
import { CONTRACT_ADDRESSES, ABIS } from "../config";

const ConcertsPage = ({ provider, signer }) => {
  const [concerts, setConcerts] = useState([]);
  const [concertData, setConcertData] = useState({
    artistId: "",
    venueId: "",
    concertDate: "",
    ticketPrice: "",
  });
  const [artists, setArtists] = useState([]);
  const [venues, setVenues] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (provider) {
      loadConcerts();
      loadArtists();
      loadVenues();
    }
  }, [provider]);

  const loadConcerts = async () => {
    try {
      const ticketingSystem = new Contract(
        CONTRACT_ADDRESSES.TicketingSystem,
        ABIS.TicketingSystem,
        provider
      );
      const concertCount = await ticketingSystem.concertCount();
      const concertsArray = [];

      const erc20ConversionRate = 3400;

      for (let i = 1; i <= concertCount; i++) {
        const concert = await ticketingSystem.concertsRegister(i);

        const concertDateNumber = Number(concert.concertDate);
        const ticketPriceInEth = parseFloat(formatEther(concert.ticketPrice));
        const ticketPriceInERC20 = ticketPriceInEth * erc20ConversionRate;

        concertsArray.push({
          id: i,
          artistId: concert.artistId.toString(),
          venueId: concert.venueId.toString(),
          concertDate: new Date(concertDateNumber * 1000).toLocaleString(),
          ticketPriceEth: ticketPriceInEth.toFixed(2),
          ticketPriceERC20: ticketPriceInERC20.toFixed(2),
          validatedByArtist: concert.validatedByArtist,
          validatedByVenue: concert.validatedByVenue,
        });
      }

      setConcerts(concertsArray);
    } catch (error) {
      console.error("Error loading concerts:", error.message);
      setErrorMessage("Unable to load concerts.");
    }
  };

  const loadArtists = async () => {
    try {
      const ticketingSystem = new Contract(
        CONTRACT_ADDRESSES.TicketingSystem,
        ABIS.TicketingSystem,
        provider
      );
      const artistCount = await ticketingSystem.artistCount();
      const artistsArray = [];
  
      for (let i = 1; i <= artistCount; i++) {
        const artist = await ticketingSystem.artistsRegister(i);
        const artistName = toUtf8String(artist.name).replace(/\0/g, "");
        artistsArray.push({ id: i, name: artistName });
      }
  
      setArtists(artistsArray);
    } catch (error) {
      console.error("Error loading artists:", error.message);
      setErrorMessage("Unable to load artists.");
    }
  };  

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
        const venue = await ticketingSystem.venuesRegister(i);
        const venueName = toUtf8String(venue.name).replace(/\0/g, ""); // Decoding bytes32 (if applicable)
        venuesArray.push({ id: i, name: venueName });
      }
  
      setVenues(venuesArray);
    } catch (error) {
      console.error("Error loading venues:", error.message);
      setErrorMessage("Unable to load venues.");
    }
  };  

  const createConcert = async () => {
    const { artistId, venueId, concertDate, ticketPrice } = concertData;

    if (!artistId || !venueId || !concertDate || !ticketPrice) {
      setErrorMessage("All fields must be filled out.");
      return;
    }

    try {
      const ticketingSystem = new Contract(
        CONTRACT_ADDRESSES.TicketingSystem,
        ABIS.TicketingSystem,
        signer
      );
      const tx = await ticketingSystem.createConcert(
        artistId,
        venueId,
        Math.floor(new Date(concertDate).getTime() / 1000),
        parseEther(ticketPrice)
      );
      await tx.wait();

      setSuccessMessage("Concert successfully created!");
      setConcertData({ artistId: "", venueId: "", concertDate: "", ticketPrice: "" });
      setErrorMessage("");
      await loadConcerts();
    } catch (error) {
      console.error("Error creating the concert:", error.message);
      setErrorMessage("Unable to create the concert.");
    }
  };

  const validateConcert = async (concertId) => {
    try {
      const ticketingSystem = new Contract(
        CONTRACT_ADDRESSES.TicketingSystem,
        ABIS.TicketingSystem,
        signer
      );
      const tx = await ticketingSystem.validateConcert(concertId);
      await tx.wait();
  
      setSuccessMessage("Concert successfully validated!");
      setErrorMessage("");
      await loadConcerts(); // Refresh the list of concerts after validation
    } catch (error) {
      console.error("Error validating the concert:", error.message);
      setErrorMessage("Unable to validate the concert.");
    }
  };  

  return (
    <Box p={4}>
      {/* Title Section */}
      <Typography variant="h4" gutterBottom>
        🎤 List of Concerts
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Manage the available concerts in your system.
      </Typography>

      {/* Concert Creation Form */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Add a Concert
        </Typography>
        <FormControl
          fullWidth
          margin="normal"
          variant="outlined"
        >
          <InputLabel shrink>Artist</InputLabel>
          <Select
            value={concertData.artistId}
            onChange={(e) =>
              setConcertData({ ...concertData, artistId: e.target.value })
            }
            label="Artist"
            displayEmpty
            inputProps={{
              style: {
                padding: "14px",
              },
            }}
          >
            {artists.map((artist) => (
              <MenuItem key={artist.id} value={artist.id}>
                {artist.name} (ID: {artist.id})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          fullWidth
          margin="normal"
          variant="outlined"
        >
          <InputLabel shrink>Venue</InputLabel>
          <Select
            value={concertData.venueId}
            onChange={(e) =>
              setConcertData({ ...concertData, venueId: e.target.value })
            }
            label="Venue"
            displayEmpty
            inputProps={{
              style: {
                padding: "14px",
              },
            }}
          >
            {venues.map((venue) => (
              <MenuItem key={venue.id} value={venue.id}>
                {venue.name} (ID: {venue.id})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Concert Date"
          type="datetime-local"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={concertData.concertDate}
          onChange={(e) =>
            setConcertData({ ...concertData, concertDate: e.target.value })
          }
        />
        <TextField
          label="Ticket Price (ETH)"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={concertData.ticketPrice}
          onChange={(e) =>
            setConcertData({ ...concertData, ticketPrice: e.target.value })
          }
        />
        <Button variant="contained" color="success" onClick={createConcert} fullWidth>
          Create Concert
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

      {/* List of concerts */}
      <Box mt={6}>
        <Typography variant="h5" gutterBottom>
          Available Concerts
        </Typography>
        {concerts.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No concerts registered yet.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {concerts.map((concert) => {
              const artist = artists.find((a) => a.id.toString() === concert.artistId);
              const venue = venues.find((v) => v.id.toString() === concert.venueId);

              return (
                <Grid item xs={12} sm={6} md={4} key={concert.id}>
                  <Card elevation={3}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Concert #{concert.id}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Artist: {artist ? `${artist.name} (ID: ${artist.id})` : "Unknown"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Venue: {venue ? `${venue.name} (ID: ${venue.id})` : "Unknown"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Date: {concert.concertDate}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Price: {concert.ticketPriceEth} ETH / {concert.ticketPriceERC20} ERC20
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Status:{" "}
                        {concert.validatedByArtist && concert.validatedByVenue ? (
                          <Typography color="success.main" component="span">
                            ✅ Validated
                          </Typography>
                        ) : (
                          <Typography color="error.main" component="span">
                            ❌ Not validated
                          </Typography>
                        )}
                      </Typography>
                    </CardContent>
                    {!concert.validatedByArtist || !concert.validatedByVenue ? (
                      <CardActions>
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => validateConcert(concert.id)}
                        >
                          Validate Concert
                        </Button>
                      </CardActions>
                    ) : null}
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default ConcertsPage;
