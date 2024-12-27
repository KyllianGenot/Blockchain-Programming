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

const ArtistsPage = ({ provider, signer }) => {
  const [artists, setArtists] = useState([]);
  const [artistName, setArtistName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (provider) {
      loadArtists();
    }
  }, [provider]);

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
        artistsArray.push({ id: i, name: decodeBytes32String(artist.name) });
      }

      setArtists(artistsArray);
    } catch (error) {
      console.error("Error loading artists:", error.message);
      setErrorMessage("Unable to load artists.");
    }
  };

  const createArtist = async () => {
    if (!artistName.trim()) {
      setErrorMessage("The artist's name cannot be empty.");
      return;
    }

    try {
      const ticketingSystem = new Contract(
        CONTRACT_ADDRESSES.TicketingSystem,
        ABIS.TicketingSystem,
        signer
      );
      const artistNameBytes32 = encodeBytes32String(artistName);
      const tx = await ticketingSystem.createArtist(artistNameBytes32, 1);
      await tx.wait();

      setSuccessMessage("Artist successfully created!");
      setArtistName(""); // Reset the field
      setErrorMessage(""); // Reset errors
      await loadArtists(); // Reload artists
    } catch (error) {
      console.error("Error creating the artist:", error.message);
      setErrorMessage("Unable to create the artist.");
    }
  };

  return (
    <Box p={4}>
      {/* Title Section */}
      <Typography variant="h4" gutterBottom>
        🎤 List of Artists
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Explore and add artists to your ticketing system.
      </Typography>

      {/* Artist Creation Form */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Add an Artist
        </Typography>
        <TextField
          label="Artist Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={createArtist}
          fullWidth
        >
          Create Artist
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

      {/* List of Artists */}
      <Box mt={6}>
        <Typography variant="h5" gutterBottom>
          Current Artists
        </Typography>
        {artists.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No artists registered yet.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {artists.map((artist) => (
              <Grid item xs={12} sm={6} md={4} key={artist.id}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {artist.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      ID: {artist.id}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => alert(`Artist ID: ${artist.id}`)}
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

export default ArtistsPage;
