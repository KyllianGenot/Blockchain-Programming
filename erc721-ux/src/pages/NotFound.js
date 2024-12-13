import React from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="notfound-container">
        <h1 className="notfound-title">404 - Page Not Found</h1>
        <p className="notfound-message">
          Oops! The page you are looking for does not exist.
        </p>
        <button className="notfound-button" onClick={() => navigate("/")}>
          Go Back to Home
        </button>
      </div>
    </PageWrapper>
  );
};

export default NotFound;