import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ErrorPage = ({ errorCode = 404, message = "Page not found" }) => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      p={3}
    >
      <Typography variant="h1" color="error" gutterBottom>
        {errorCode}
      </Typography>
      <Typography variant="h5" color="textSecondary" gutterBottom>
        {message}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        sx={{ mt: 3 }}
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default ErrorPage;