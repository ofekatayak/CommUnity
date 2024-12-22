import React, { useState } from "react";
import Popup from "./popups/Popup";
import SignUp from "./popups/SignUp";
import Login from "./popups/Login";
import "./css/Header.css";

const Header: React.FC = () => {
  // State to manage the visibility of Sign Up and Login popups
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);

  return (
    <header className="header">
      {/* Logo Section */}
      <div className="header-logo">Logo</div>

      {/* Search Bar Section */}
      <div className="header-search">
        <input type="text" placeholder="Search..." className="search-input" />
      </div>

      {/* Buttons Section */}
      <div className="header-buttons">
        <button className="header-button" onClick={() => setLoginOpen(true)}>
          Login
        </button>
        <button className="header-button" onClick={() => setSignUpOpen(true)}>
          Sign Up
        </button>
      </div>

      {/* Login Popup */}
      <Popup
        title="Login"
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
      >
        <Login />
      </Popup>

      {/* Sign Up Popup */}
      <Popup
        title="Sign Up"
        isOpen={isSignUpOpen}
        onClose={() => setSignUpOpen(false)}
      >
        <SignUp />
      </Popup>
    </header>
  );
};

export default Header;
