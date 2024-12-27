import React from "react";
import { Box, Typography, Link } from "@mui/material";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#6D4C41", // Mocha Mousse
        color: "#FAF5E9", // Ivory Beige
        textAlign: "center",
        py: 2,
        mt: 5,
      }}
    >
      <Typography variant="body2" gutterBottom>
        🎟️ Ticket Marketplace - All rights reserved © {new Date().getFullYear()}
      </Typography>
      <Box display="flex" justifyContent="center" gap={3} mt={1}>
        <Link
          href="/"
          underline="none"
          sx={{
            color: "#FAF5E9", // Ivory Beige
            "&:hover": { textDecoration: "underline", color: "#D7C9C0" }, // Light Mocha on hover
          }}
        >
          Home
        </Link>
        <Link
          href="/artists"
          underline="none"
          sx={{
            color: "#FAF5E9", // Ivory Beige
            "&:hover": { textDecoration: "underline", color: "#D7C9C0" }, // Light Mocha on hover
          }}
        >
          Artists
        </Link>
        <Link
          href="/venues"
          underline="none"
          sx={{
            color: "#FAF5E9", // Ivory Beige
            "&:hover": { textDecoration: "underline", color: "#D7C9C0" }, // Light Mocha on hover
          }}
        >
          Venues
        </Link>
        <Link
          href="/concerts"
          underline="none"
          sx={{
            color: "#FAF5E9", // Ivory Beige
            "&:hover": { textDecoration: "underline", color: "#D7C9C0" }, // Light Mocha on hover
          }}
        >
          Concerts
        </Link>
      </Box>
      <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
        Developed with ❤️ by Kyllian GENOT.
      </Typography>
    </Box>
  );
};

export default Footer;
