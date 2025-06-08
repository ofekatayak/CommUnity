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
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle user logout with confirmation
  const handleLogout = async () => {
    await logout();
    setLogoutConfirmOpen(false);
  };

  // Navigate to home page
  const goToHome = () => {
    navigate("/");
    setMobileMenuOpen(false);
  };

  // Navigate to admin panel
  const goToAdminPanel = () => {
    navigate("/admin");
    setMobileMenuOpen(false);
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
    setMobileMenuOpen(false);
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

  // Render hamburger menu icon
  const renderHamburgerIcon = () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );

  // Render close icon
  const renderCloseIcon = () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  // Render logo section
  const renderLogo = () => (
    <div
      className="h-16 md:h-20 flex items-center cursor-pointer"
      onClick={goToHome}
    >
      <img
        src={logoUrl}
        alt="CommUnity Logo"
        className="h-full max-h-full object-contain object-center py-1"
      />
    </div>
  );

  // Render navigation links for desktop
  const renderDesktopNavigationLinks = () => (
    <div className="hidden md:flex space-x-6 rtl:space-x-reverse ml-8">
      <a
        href="#about"
        className="text-gray-700 hover:text-indigo-700 font-medium transition-colors"
        onClick={(e) => handleNavLinkClick(e, onAboutClick)}
      >
        אודות
      </a>
      <a
        href="#contact"
        className="text-gray-700 hover:text-indigo-700 font-medium transition-colors"
        onClick={(e) => handleNavLinkClick(e, onContactClick)}
      >
        צור קשר
      </a>
    </div>
  );

  // Render search bar
  const renderSearchBar = () => (
    <div className="hidden lg:flex flex-1 mx-6 max-w-md">
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

  // Render authentication buttons for logged-in users (desktop)
  const renderLoggedInButtons = () => (
    <div className="hidden md:flex flex-row-reverse gap-x-6">
      <button
        className="text-red-600 hover:text-red-700 font-medium transition-all duration-200 hover:bg-red-50 px-3 py-1 rounded-md"
        onClick={() => setLogoutConfirmOpen(true)}
      >
        התנתקות
      </button>

      {/* Admin panel button - styled like navigation links */}
      {isAdmin && (
        <button
          className="text-gray-700 hover:text-indigo-700 font-medium transition-colors"
          onClick={goToAdminPanel}
        >
          פאנל ניהול
        </button>
      )}
    </div>
  );

  // Render authentication buttons for non-logged-in users (desktop)
  const renderGuestButtons = () => (
    <div className="hidden md:flex flex-row-reverse gap-x-4">
      <button
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition-all text-sm"
        onClick={() => setSignUpOpen(true)}
      >
        הרשמה
      </button>
      <button
        className="text-gray-700 hover:text-indigo-700 font-medium transition-colors"
        onClick={() => setLoginOpen(true)}
      >
        התחברות
      </button>
    </div>
  );

  // Render mobile menu button
  const renderMobileMenuButton = () => (
    <button
      className="md:hidden p-2 text-gray-700 hover:text-indigo-700 transition-colors"
      onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
    >
      {isMobileMenuOpen ? renderCloseIcon() : renderHamburgerIcon()}
    </button>
  );

  // Render mobile menu
  const renderMobileMenu = () => (
    <div
      className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 transition-all duration-300 ease-in-out ${
        isMobileMenuOpen
          ? "opacity-100 translate-y-0 visible"
          : "opacity-0 -translate-y-2 invisible"
      }`}
    >
      <div className="container mx-auto px-6 py-4 space-y-4">
        {/* Mobile Search Bar */}
        <div className="lg:hidden">
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

        {/* Mobile Navigation Links */}
        <div className="space-y-3">
          <a
            href="#about"
            className="block text-gray-700 hover:text-indigo-700 font-medium py-2 transition-colors"
            onClick={(e) => handleNavLinkClick(e, onAboutClick)}
          >
            אודות
          </a>
          <a
            href="#contact"
            className="block text-gray-700 hover:text-indigo-700 font-medium py-2 transition-colors"
            onClick={(e) => handleNavLinkClick(e, onContactClick)}
          >
            צור קשר
          </a>
        </div>

        {/* Mobile Authentication Buttons */}
        <div className="pt-4 border-t border-gray-200">
          {isLoggedIn ? (
            <div className="space-y-3">
              {isAdmin && (
                <button
                  className="w-full text-center text-gray-700 hover:text-indigo-700 font-medium py-3 transition-colors"
                  onClick={goToAdminPanel}
                >
                  פאנל ניהול
                </button>
              )}
              <button
                className="w-full text-center text-red-600 hover:text-red-700 font-medium py-3 transition-all hover:bg-red-50 rounded-md"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLogoutConfirmOpen(true);
                }}
              >
                התנתקות
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium shadow-md transition-all"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSignUpOpen(true);
                }}
              >
                הרשמה
              </button>
              <button
                className="w-full text-center text-gray-700 hover:text-indigo-700 font-medium py-3 transition-colors"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLoginOpen(true);
                }}
              >
                התחברות
              </button>
            </div>
          )}
        </div>
      </div>
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
      <div className="container mx-auto flex items-center justify-between py-2 px-4 md:px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          {renderLogo()}
          {/* Desktop Navigation Links */}
          {renderDesktopNavigationLinks()}
        </div>

        {/* Desktop Search Bar */}
        {renderSearchBar()}

        {/* Desktop Action Buttons */}
        {isLoggedIn ? renderLoggedInButtons() : renderGuestButtons()}

        {/* Mobile Menu Button */}
        {renderMobileMenuButton()}
      </div>

      {/* Mobile Menu */}
      {renderMobileMenu()}

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
