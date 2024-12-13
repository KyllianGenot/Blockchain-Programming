import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getDropdownLabel = () => {
    if (currentPath.startsWith("/fakeBayc")) {
      return "Fake BAYC";
    } else if (currentPath.startsWith("/fakeNefturians")) {
      return "Fake NEFTURIANS";
    } else if (currentPath.startsWith("/fakeMeebits")) {
      return "Fake MEEBITS";
    }
    return "NFT Explorer";
  };

  return (
    <header className="header glassmorphism">
      <div className="header-container">
        <nav className="nav">
          <Link
            to="/"
            className={`nav-link ${currentPath === "/" ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/chain-info"
            className={`nav-link ${
              currentPath === "/chain-info" ? "active" : ""
            }`}
          >
            Chain Info
          </Link>

          <div className="dropdown">
            <span
              className={`nav-link dropdown-toggle ${
                currentPath.includes("/fake") ? "active" : ""
              }`}
            >
              {getDropdownLabel()}
              <span className="dropdown-arrow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 16l6-6H6z"
                  />
                </svg>
              </span>
            </span>
            <div className="dropdown-menu">
              <Link
                to="/fakeBayc"
                className={`dropdown-link ${
                  currentPath === "/fakeBayc" ? "active" : ""
                }`}
              >
                Fake BAYC
              </Link>
              <Link
                to="/fakeNefturians"
                className={`dropdown-link ${
                  currentPath === "/fakeNefturians" ? "active" : ""
                }`}
              >
                Fake NEFTURIANS
              </Link>
              <Link
                to="/fakeMeebits"
                className={`dropdown-link ${
                  currentPath === "/fakeMeebits" ? "active" : ""
                }`}
              >
                Fake MEEBITS
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
