import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Popup from "./popups/Popup";
import SignUp from "./popups/SignUp";
import Login from "./popups/Login";
import logo from "../utilities/logo.png"; // מסלול יחסי מהקובץ Header.tsx

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();

  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [successPopupOpen, setSuccessPopupOpen] = useState(false);

  return (
    <header
      dir="rtl"
      className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 shadow-md border-b border-gray-300 rounded-b-xl"
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="h-16 flex items-center">
          <img
            src={logo}
            alt="CommUnity Logo"
            className="h-[90%] max-h-full object-contain"
          />
        </div>
        {/* Search */}
        <div className="flex-1 mx-6">
          <input
            type="text"
            placeholder="חיפוש..."
            className="w-full max-w-lg px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow text-right"
          />
        </div>
        {/* Buttons */}
        <div className="flex flex-row-reverse gap-x-2">
          {isLoggedIn ? (
            <button
              className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-transform transform hover:scale-105"
              onClick={logout}
            >
              התנתקות
            </button>
          ) : (
            <>
              <button
                className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-transform transform hover:scale-105"
                onClick={() => setLoginOpen(true)}
              >
                התחברות
              </button>
              <button
                className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-transform transform hover:scale-105"
                onClick={() => setSignUpOpen(true)}
              >
                הרשמה
              </button>
            </>
          )}
        </div>
      </div>

      {/* Login Popup */}
      <Popup
        title="התחברות"
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
      >
        <Login onClose={() => setLoginOpen(false)} />
      </Popup>

      {/* Sign Up Popup */}
      <Popup
        title="הרשמה"
        isOpen={isSignUpOpen}
        onClose={() => setSignUpOpen(false)}
      >
        <SignUp
          onClose={() => setSignUpOpen(false)}
          onSuccess={() => {
            setSignUpOpen(false);
            setSuccessPopupOpen(true);
          }}
        />
      </Popup>

      {/* Success Message Popup */}
      <Popup
        title="נרשמת בהצלחה"
        isOpen={successPopupOpen}
        onClose={() => setSuccessPopupOpen(false)}
      >
        <p className="text-center text-green-600 font-semibold">
          ההרשמה בוצעה בהצלחה! החשבון שלך ממתין לאישור אדמין.
        </p>
      </Popup>
    </header>
  );
};

export default Header;
