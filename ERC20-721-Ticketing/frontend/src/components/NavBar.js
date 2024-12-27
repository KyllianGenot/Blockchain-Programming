import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Artists", path: "/artists" },
    { label: "Venues", path: "/venues" },
    { label: "Concerts", path: "/concerts" },
    { label: "Tickets", path: "/tickets" },
    { label: "Exchange", path: "/exchange" },
  ];

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#6D4C41", boxShadow: 3 }}>
      <Toolbar>
        {/* Logo Section */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            cursor: "pointer",
            fontWeight: "normal",
            fontFamily: "Cabinet Grotesk, Arial, sans-serif",
            color: "#FAF5E9", // Ivory Beige
          }}
          onClick={() => navigate("/")}
        >
          🎟️ Marketplace
        </Typography>

        {/* Desktop Navigation Links */}
        <Box sx={{ display: "flex", gap: 4 }}>
          {navLinks.map((link) => (
            <Box
              key={link.label}
              onClick={() => navigate(link.path)}
              sx={{
                position: "relative",
                cursor: "pointer",
                color: location.pathname === link.path ? "#FAF5E9" : "#D7C9C0", // Active: Ivory Beige, Inactive: Light Mocha
                fontSize: "16px",
                fontWeight: "500",
                transition: "color 0.3s ease-in-out, transform 0.3s ease",
                "&:hover": {
                  color: "#FAF5E9", // Light Mocha on hover
                },
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "2px",
                  backgroundColor: "#FAF5E9", // Active underline: Ivory Beige
                  transform: location.pathname === link.path ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "left",
                  transition: "transform 0.3s ease-out",
                },
                "&:hover:after": {
                  transform: "scaleX(1)",
                },
              }}
            >
              {link.label}
            </Box>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
