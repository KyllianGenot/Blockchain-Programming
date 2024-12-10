import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css"; // Assure-toi d'importer ton CSS principal

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Logique pour déterminer le nom de l'onglet actif dans le menu déroulant
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
          {/* Home Link */}
          <Link
            to="/"
            className={`nav-link ${currentPath === "/" ? "active" : ""}`}
          >
            Home
          </Link>

          {/* Chain Info Link */}
          <Link
            to="/chain-info"
            className={`nav-link ${
              currentPath === "/chain-info" ? "active" : ""
            }`}
          >
            Chain Info
          </Link>

          {/* Dropdown Menu for NFT Explorer */}
          <div className="dropdown">
            <span
              className={`nav-link dropdown-toggle ${
                currentPath.includes("/fake") ? "active" : ""
              }`}
            >
              {getDropdownLabel()} {/* Texte dynamique */}
              <span className="dropdown-arrow">
                {/* SVG pour la flèche */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 16l6-6H6z" /* Triangle inversé vers le bas */
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
