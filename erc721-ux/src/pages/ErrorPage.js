import React from "react";
import { Link } from "react-router-dom";
import "./ErrorPage.css"; // Link to the CSS file

const ErrorPage = () => {
  return (
    <div className="error-container">
      <h1 className="error-title">Error: Unsupported Network</h1>
      <p className="error-message">
        You are not connected to the Holesky network. Please switch networks in MetaMask.
      </p>
      <Link to="/">
        <button className="error-button">Go Back to Home</button>
      </Link>
    </div>
  );
};

export default ErrorPage;