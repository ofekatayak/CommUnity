import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Import Auth context
import Popup from "./popups/Popup";
import SignUp from "./popups/SignUp";
import Login from "./popups/Login";

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 shadow-md border-b border-gray-300 rounded-b-xl">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo Section */}
        <div className="flex-shrink-0 text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
          <span className="ml-0">CommUnity</span>
        </div>
        {/* Search Bar */}
        <div className="flex-1 mx-6">
          <input
            type="text"
            placeholder="Search..."
            className="w-full max-w-lg px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
          />
        </div>
        {/* Buttons Section */}
        <div className="flex space-x-4">
          {isLoggedIn ? (
            <button
              className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-transform transform hover:scale-105"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <>
              <button
                className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-transform transform hover:scale-105"
                onClick={() => setLoginOpen(true)}
              >
                Login
              </button>
              <button
                className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-transform transform hover:scale-105"
                onClick={() => setSignUpOpen(true)}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {/* Login Popup */}
      <Popup
        title="Login"
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
      >
        <Login onClose={() => setLoginOpen(false)} />
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
