//https://ticketing-marketplace.vercel.app/
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import artistsImage from "../assets/images/artists.jpg";
import venuesImage from "../assets/images/venues.jpg";
import exchangeImage from "../assets/images/exchange.jpg";

function HomePage() {
  return (
    <Box p={4}>
      {/* Welcome Section */}
      <Box textAlign="center" mb={5}>
        <Typography variant="h3" gutterBottom>
          🎟️ Welcome to the Ticket Marketplace
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Buy, sell, and exchange your tickets for unforgettable experiences!
        </Typography>
      </Box>

      {/* Main Features Section */}
      <Box className="glass-container">
        {/* Card 1 */}
        <div className="glass">
          <div className="glass__border"></div>
          <img src={artistsImage} alt="Artists" />
          <div className="glass-content">
            <h3>Discover Artists</h3>
            <p>Browse an amazing list of artists and find their upcoming concerts.</p>
            <Link to="/artists">
              <button className="shared-button">View Artists</button>
            </Link>
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass">
          <div className="glass__border"></div>
          <img src={venuesImage} alt="Venues" />
          <div className="glass-content">
            <h3>Explore Venues</h3>
            <p>Discover unique places where your favorite artists perform.</p>
            <Link to="/venues">
              <button className="shared-button">View Venues</button>
            </Link>
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass">
          <div className="glass__border"></div>
          <img src={exchangeImage} alt="Exchange" />
          <div className="glass-content">
            <h3>Token Exchange</h3>
            <p>Convert your ETH into ERC20 tokens and enjoy a seamless experience.</p>
            <Link to="/exchange">
              <button className="shared-button">Start Exchanging</button>
            </Link>
          </div>
        </div>
      </Box>
    </Box>
  );
}

export default HomePage;