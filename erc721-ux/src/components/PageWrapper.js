import React from "react";
import Header from "./Header";
import "./PageWrapper.css"; // Import du fichier CSS

const PageWrapper = ({ children }) => {
  return (
    <div className="page-wrapper">
      <Header />
      <main className="page-main">{children}</main>
    </div>
  );
};

export default PageWrapper;
