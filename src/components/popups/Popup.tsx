import React, { useEffect } from "react";
import "./css/Popup.css";

interface PopupProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ title, isOpen, onClose, children }) => {
  // Add an event listener to close the popup on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // If the popup is not open, return null to avoid rendering it
  if (!isOpen) return null;

  // Close the popup when clicking outside of the content
  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="popup-overlay" onClick={handleOverlayClick}>
      <div className="popup-content">
        {/* Close button */}
        <button className="popup-close" onClick={onClose}>
          ✖
        </button>

        {/* Popup title */}
        <h2 className="popup-title">{title}</h2>

        {/* Children components */}
        {children}
      </div>
    </div>
  );
};

export default Popup;
