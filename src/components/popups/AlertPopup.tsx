import React from "react";

interface AlertPopupProps {
  type: "success" | "error" | "confirm";
  title: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string; // Custom text for confirm button
}

/**
 * AlertPopup Component
 *
 * A reusable modal component for displaying alerts, confirmations, and success/error messages.
 * Supports three types: success, error, and confirm dialogs with appropriate icons and styling.
 *
 * @param type - The type of alert: "success", "error", or "confirm"
 * @param title - The title text displayed in the popup header
 * @param message - The main message content
 * @param isOpen - Controls the visibility of the popup
 * @param onClose - Callback function when popup is closed
 * @param onConfirm - Optional callback for confirm actions (used with type="confirm")
 * @param confirmText - Custom text for the confirm button (defaults to "אישור")
 */
const AlertPopup: React.FC<AlertPopupProps> = ({
  type,
  title,
  message,
  isOpen,
  onClose,
  onConfirm,
  confirmText = "אישור", // Default confirm text
}) => {
  // Early return if popup should not be displayed
  if (!isOpen) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Main popup container with click event prevention */}
      <div
        className="bg-white rounded-xl shadow-xl p-5 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header section with icon and title */}
        <div className="flex items-center gap-3 mb-4">
          {/* Dynamic icon based on popup type */}
          {type === "success" ? (
            <div className="bg-green-100 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ) : type === "error" ? (
            <div className="bg-red-100 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          ) : (
            /* Confirm/warning icon */
            <div className="bg-amber-100 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          )}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>

        {/* Message content */}
        <p className="text-gray-700 mb-4">{message}</p>

        {/* Action buttons section */}
        <div className="flex justify-end gap-3">
          {type === "confirm" ? (
            /* Confirm dialog with two buttons */
            <>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                onClick={onConfirm}
              >
                {confirmText}
              </button>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                onClick={onClose}
              >
                ביטול
              </button>
            </>
          ) : (
            /* Single close button for success/error */
            <button
              className={`px-4 py-2 ${
                type === "success"
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-red-600 hover:bg-red-700"
              } text-white rounded-lg font-medium transition-colors`}
              onClick={onClose}
            >
              סגור
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertPopup;
