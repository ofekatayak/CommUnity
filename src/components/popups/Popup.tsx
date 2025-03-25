import React, { useEffect } from "react";

interface PopupProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ title, isOpen, onClose, children }) => {
  // Close popup on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  // Close popup if clicking outside the box
  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg mx-4 sm:mx-auto p-6 overflow-y-auto max-h-[90vh] border border-gray-200">
        {/* Close button (RTL - on left) */}
        <button
          className="absolute top-4 left-4 text-gray-400 hover:text-red-500 focus:outline-none text-lg"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-right text-blue-600 mb-6">
          {title}
        </h2>

        {/* Children content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Popup;
