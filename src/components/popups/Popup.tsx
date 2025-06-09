import React, { useEffect, useState } from "react";

// Interface for component props
interface PopupProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ title, isOpen, onClose, children }) => {
  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // Handle popup visibility and animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimatingOut(false);
      // Small delay to trigger enter animation
      const timer = setTimeout(() => {
        setIsAnimatingOut(false);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimatingOut(true);
      // Hide after animation completes
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsAnimatingOut(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle ESC key press to close popup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, isOpen]);

  // Inject custom CSS styles for animations and scrollbar
  useEffect(() => {
    const styleId = "popup-custom-styles";

    // Check if styles already exist to prevent duplicates
    if (document.getElementById(styleId)) {
      return;
    }

    const styleElement = document.createElement("style");
    styleElement.id = styleId;
    styleElement.textContent = `
      .popup-animate-fade-in {
        animation: popupFadeIn 0.3s ease-out;
      }
      
      .popup-animate-fade-out {
        animation: popupFadeOut 0.3s ease-in;
      }
      
      @keyframes popupFadeIn {
        from { 
          opacity: 0; 
          transform: scale(0.9) translateY(-20px); 
        }
        to { 
          opacity: 1; 
          transform: scale(1) translateY(0); 
        }
      }
      
      @keyframes popupFadeOut {
        from { 
          opacity: 1; 
          transform: scale(1) translateY(0); 
        }
        to { 
          opacity: 0; 
          transform: scale(0.9) translateY(-20px); 
        }
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

    // Cleanup function to remove styles when component unmounts
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  // Don't render anything if popup is not visible
  if (!isVisible) return null;

  // Handle click on overlay background to close popup
  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Render close icon SVG
  const renderCloseIcon = () => (
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
  );

  return (
    <div
      dir="rtl"
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-all duration-300 ease-out ${
        isOpen && !isAnimatingOut
          ? "bg-black/60 opacity-100"
          : "bg-black/40 opacity-0"
      }`}
      onClick={handleOverlayClick}
    >
      <div
        className={`relative bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg mx-4 sm:mx-auto overflow-hidden max-h-[90vh] border border-gray-100 ${
          isAnimatingOut ? "popup-animate-fade-out" : "popup-animate-fade-in"
        }`}
      >
        {/* Header Section */}
        <div
          className={`bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-purple-500/10 px-6 py-4 border-b border-gray-100 transform transition-all duration-500 ease-out ${
            isOpen && !isAnimatingOut
              ? "translate-y-0 opacity-100"
              : "translate-y-2 opacity-0"
          }`}
          style={{
            transitionDelay: isOpen && !isAnimatingOut ? "100ms" : "0ms",
          }}
        >
          <h2
            className={`text-xl font-semibold text-indigo-900 transform transition-all duration-500 ease-out ${
              isOpen && !isAnimatingOut
                ? "translate-x-0 opacity-100"
                : "translate-x-4 opacity-0"
            }`}
            style={{
              transitionDelay: isOpen && !isAnimatingOut ? "200ms" : "0ms",
            }}
          >
            {title}
          </h2>
        </div>

        {/* Close Button - positioned for RTL layout (left side) */}
        <button
          className={`absolute top-3 left-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full p-1.5 transition-all duration-500 ease-out transform ${
            isOpen && !isAnimatingOut
              ? "scale-100 opacity-100 rotate-0"
              : "scale-0 opacity-0 rotate-90"
          }`}
          style={{
            transitionDelay: isOpen && !isAnimatingOut ? "300ms" : "0ms",
          }}
          onClick={onClose}
          aria-label="Close popup"
        >
          {renderCloseIcon()}
        </button>

        {/* Content Section - Scrollable */}
        <div
          className={`px-6 py-4 overflow-y-auto popup-custom-scrollbar max-h-[calc(90vh-80px)] transform transition-all duration-600 ease-out ${
            isOpen && !isAnimatingOut
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
          style={{
            transitionDelay: isOpen && !isAnimatingOut ? "250ms" : "0ms",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Popup;
