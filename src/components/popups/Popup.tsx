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

  // Add CSS to document head
  useEffect(() => {
    // Add the styles to the head
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      .popup-animate-fade-in {
        animation: popupFadeIn 0.2s ease-out;
      }
      
      @keyframes popupFadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      
      .popup-custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      
      .popup-custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 10px;
      }
      
      .popup-custom-scrollbar::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 10px;
      }
      
      .popup-custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
    `;
    document.head.appendChild(styleElement);

    // Cleanup function to remove the styles when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg mx-4 sm:mx-auto overflow-hidden max-h-[90vh] border border-gray-100 popup-animate-fade-in">
        {/* Header with title */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-purple-500/10 px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-indigo-900">{title}</h2>
        </div>

        {/* Close button (RTL - on left) */}
        <button
          className="absolute top-3 left-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full p-1.5 transition-all"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Children content */}
        <div className="px-6 py-4 overflow-y-auto popup-custom-scrollbar max-h-[calc(90vh-80px)]">
          {children}
        </div>

        {/* Footer with optional button */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
            onClick={onClose}
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
