// Header.tsx - Main Navigation Header Component
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Popup from "./popups/Popup";
import SignUp from "./popups/SignUp";
import Login from "./popups/Login";
import AlertPopup from "./popups/AlertPopup";
import SearchBar from "./SearchBar";
import { useNavigate } from "react-router-dom";

const logoUrl = "/logo.svg";

// Interface for component props
interface HeaderProps {
  onContactClick?: () => void;
  onAboutClick?: () => void;
  // Search-related props
  communities?: Array<{ name: string; color: string }>;
  layers?: Array<{ key: string; name: string }>;
  selectedCommunities?: string[];
  selectedLayers?: string[];
  onToggleCommunity?: (communityName: string) => void;
  onToggleLayer?: (layerKey: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  onContactClick,
  onAboutClick,
  communities = [],
  layers = [],
  selectedCommunities = [],
  selectedLayers = [],
  onToggleCommunity,
  onToggleLayer,
}) => {
  // Hooks
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // State management for popup visibility
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [successPopupOpen, setSuccessPopupOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  // Handle user logout with confirmation
  const handleLogout = async () => {
    await logout();
    setLogoutConfirmOpen(false);
  };

  // Navigate to home page
  const goToHome = () => {
    navigate("/");
  };

  // Navigate to admin panel
  const goToAdminPanel = () => {
    navigate("/admin");
  };

  // Handle successful login - redirect to home page
  const handleLoginSuccess = () => {
    setLoginOpen(false);
    // Navigate to home page after successful login (instead of directly to admin panel)
    goToHome();
  };

  // Handle navigation link clicks
  const handleNavLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    callback?: () => void
  ) => {
    e.preventDefault();
    if (callback) callback();
  };

  // Render success icon for signup confirmation
  const renderSuccessIcon = () => (
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
  );

  // Render logo section
  const renderLogo = () => (
    <div className="h-24 flex items-center cursor-pointer" onClick={goToHome}>
      <img
        src={logoUrl}
        alt="CommUnity Logo"
        className="h-full max-h-full object-contain object-center py-1"
      />
    </div>
  );

  // Render navigation links
  const renderNavigationLinks = () => (
    <div className="flex space-x-6 rtl:space-x-reverse ml-8">
      <a
        href="#about"
        className="text-gray-700 hover:text-indigo-700 font-medium"
        onClick={(e) => handleNavLinkClick(e, onAboutClick)}
      >
        אודות
      </a>
      <a
        href="#contact"
        className="text-gray-700 hover:text-indigo-700 font-medium"
        onClick={(e) => handleNavLinkClick(e, onContactClick)}
      >
        צור קשר
      </a>
    </div>
  );

  // Render search bar
  const renderSearchBar = () => (
    <div className="flex-1 mx-6">
      <SearchBar
        placeholder="חפש קהילות ושכבות מידע..."
        communities={communities}
        layers={layers}
        selectedCommunities={selectedCommunities}
        selectedLayers={selectedLayers}
        onToggleCommunity={onToggleCommunity}
        onToggleLayer={onToggleLayer}
      />
    </div>
  );

  // Render authentication buttons for logged-in users
  const renderLoggedInButtons = () => (
    <>
      <button
        className="bg-white text-red-600 border border-red-200 hover:bg-red-50 px-5 py-2 rounded-lg font-medium shadow-sm transition-all"
        onClick={() => setLogoutConfirmOpen(true)}
      >
        התנתקות
      </button>

      {/* Admin panel button - only visible for admin users */}
      {isAdmin && (
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-all"
          onClick={goToAdminPanel}
        >
          פאנל ניהול
        </button>
      )}
    </>
  );

  // Render authentication buttons for non-logged-in users
  const renderGuestButtons = () => (
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
  );

  // Render action buttons based on authentication status
  const renderActionButtons = () => (
    <div className="flex flex-row-reverse gap-x-3">
      {isLoggedIn ? renderLoggedInButtons() : renderGuestButtons()}
    </div>
  );

  // Render signup success message content
  const renderSignupSuccessContent = () => (
    <div className="text-center p-4">
      <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
        {renderSuccessIcon()}
      </div>
      <p className="text-green-600 font-semibold">
        ההרשמה בוצעה בהצלחה! החשבון שלך ממתין לאישור אדמין.
      </p>
    </div>
  );

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 bg-gradient-to-r from-indigo-200 via-blue-200 to-purple-200 shadow-md border-b border-gray-200"
    >
      <div className="container mx-auto flex items-center justify-between py-1 px-6">
        {/* Logo Section - Clickable */}
        <div className="flex items-center">
          {renderLogo()}
          {/* Navigation Links - Right next to logo */}
          {renderNavigationLinks()}
        </div>

        {/* Search Bar */}
        {renderSearchBar()}

        {/* Action Buttons */}
        {renderActionButtons()}
      </div>

      {/* Login Popup */}
      <Popup
        title="התחברות"
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
      >
        <Login onClose={handleLoginSuccess} />
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
        {renderSignupSuccessContent()}
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
          confirmText="התנתק"
        />
      )}
    </header>
  );
};

export default Header;
