import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{ backgroundColor: "background.default", color: "text.primary" }}
    >
      <CircularProgress color="primary" />
      <Typography variant="h6" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
