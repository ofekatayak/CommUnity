import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Popup from "./popups/Popup";
import SignUp from "./popups/SignUp";
import Login from "./popups/Login";
import logo from "../utilities/logo.png";
import AlertPopup from "./popups/AlertPopup";

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();

  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [successPopupOpen, setSuccessPopupOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setLogoutConfirmOpen(false);
  };

  return (
    <header
      dir="rtl"
      className="bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-purple-500/10 shadow-md border-b border-gray-200"
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

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 rtl:space-x-reverse">
          <a
            href="#"
            className="text-gray-700 hover:text-indigo-700 font-medium"
          >
            ראשי
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-indigo-700 font-medium"
          >
            קהילות
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-indigo-700 font-medium"
          >
            אודות
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-indigo-700 font-medium"
          >
            צור קשר
          </a>
        </div>

        {/* Search */}
        <div className="flex-1 mx-6">
          <div className="relative">
            <input
              type="text"
              placeholder="חיפוש..."
              className="w-full max-w-lg px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-shadow text-right bg-white"
            />
            <div className="absolute inset-y-0 left-3 flex items-center">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-row-reverse gap-x-3">
          {isLoggedIn ? (
            <button
              className="bg-white text-red-600 border border-red-200 hover:bg-red-50 px-5 py-2 rounded-lg font-medium shadow-sm transition-all"
              onClick={() => setLogoutConfirmOpen(true)}
            >
              התנתקות
            </button>
          ) : (
            <>
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-all"
                onClick={() => setLoginOpen(true)}
              >
                התחברות
              </button>
              <button
                className="bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-5 py-2 rounded-lg font-medium shadow-sm transition-all"
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
        <div className="text-center p-4">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-green-600 font-semibold">
            ההרשמה בוצעה בהצלחה! החשבון שלך ממתין לאישור אדמין.
          </p>
        </div>
      </Popup>

      {/* Logout Confirmation Dialog */}
      {logoutConfirmOpen && (
        <AlertPopup
          type="confirm"
          title="אישור התנתקות"
          message="האם אתה בטוח שברצונך להתנתק מהמערכת?"
          isOpen={logoutConfirmOpen}
          onClose={() => setLogoutConfirmOpen(false)}
          onConfirm={handleLogout}
          confirmText="התנתק" // טקסט ספציפי להתנתקות
        />
      )}
    </header>
  );
};

export default Header;
