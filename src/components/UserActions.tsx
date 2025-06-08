// UserActions.tsx - User Management Actions Component
import React, { useState } from "react";
import { db } from "../DB/firebase/firebase-config";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { User } from "../models/User";
import AlertPopup from "./popups/AlertPopup";
import emailjs from "emailjs-com";

// Interface for component props
interface UserActionsProps {
  user: User;
  refreshUsers: () => Promise<void>;
}

// Interface for alert state management
interface AlertState {
  type: "success" | "error" | "confirm";
  title: string;
  message: string;
  isOpen: boolean;
  needsRefresh: boolean; // Whether to refresh users when alert is closed
}

// Type for user status updates
type UserStatus = "approved" | "blocked";

const UserActions: React.FC<UserActionsProps> = ({ user, refreshUsers }) => {
  // State for alert notifications
  const [alert, setAlert] = useState<AlertState>({
    type: "success",
    title: "",
    message: "",
    isOpen: false,
    needsRefresh: false,
  });

  // State to prevent multiple simultaneous operations
  const [isProcessing, setIsProcessing] = useState(false);

  // Show alert notification with optional refresh flag
  const showAlert = (
    type: "success" | "error" | "confirm",
    title: string,
    message: string,
    needsRefresh = false
  ) => {
    setAlert({
      type,
      title,
      message,
      isOpen: true,
      needsRefresh,
    });
  };

  // Close alert and refresh users if needed
  const closeAlert = async () => {
    const shouldRefresh = alert.needsRefresh;

    // Close the popup
    setAlert((prev) => ({ ...prev, isOpen: false }));

    // Refresh users if needed, with small delay after popup closes
    if (shouldRefresh) {
      setTimeout(() => {
        refreshUsers();
      }, 100);
    }
  };

  // Send approval email to user
  const sendApprovalEmail = async (userEmail: string, userName: string) => {
    try {
      const templateParams = {
        from_name: `צוות CommUnity`, // System name
        from_email: userEmail, // This should route to user with proper EmailJS setup
        to_email: userEmail, // Backup field
        phone: "", // Empty for system emails
        message: `שלום ${userName},

אנחנו שמחים להודיע לך שהחשבון שלך במערכת CommUnity אושר בהצלחה!

עכשיו אתה יכול להתחבר למערכת ולהשתמש בכל הפונקציות הזמינות:
• צפייה במפה האינטראקטיבית
• חיפוש קהילות ושכבות מידע
• ייצוא נתונים ומידע

להתחברות למערכת: ${window.location.origin}

בברכה,
צוות CommUnity`,
      };

      console.log("Sending approval email to:", userEmail);
      console.log("Template params:", templateParams);

      const result = await emailjs.send(
        "service_qbgq6it",
        "template_ozj0x5x", // Back to original template
        templateParams,
        "tyAJr20tpxEI5o8yq"
      );

      console.log("EmailJS Result:", result);
      console.log("Approval email sent successfully");
    } catch (error) {
      console.error("Error sending approval email:", error);
      console.error("Full error details:", JSON.stringify(error, null, 2));
    }
  };

  // Send blocking email to user
  const sendBlockingEmail = async (userEmail: string, userName: string) => {
    try {
      const templateParams = {
        from_name: `צוות CommUnity`, // System name
        from_email: userEmail, // This should route to user with proper EmailJS setup
        to_email: userEmail, // Backup field
        phone: "", // Empty for system emails
        message: `שלום ${userName},

אנו מתנצלים להודיע לך שהחשבון שלך במערכת CommUnity נחסם.

סיבת החסימה:
החשבון שלך נחסם עקב אי עמידה בתנאי השימוש או בכללי ההרשמה של המערכת.

זה יכול לכלול:
• מתן מידע לא מדויק בתהליך ההרשמה
• הפרת כללי השימוש במערכת
• שימוש לא מאושר או לא הולם במערכת

אם אתה סבור שהחסימה בוצעה בטעות או שברצונך לערער על ההחלטה, אנא פנה אלינו דרך טופס צור הקשר באתר שלנו.

אנו מתנצלים על אי הנוחות ומקווים להבהרת המצב.

בברכה,
צוות CommUnity`,
      };

      console.log("Sending blocking email to:", userEmail);
      console.log("Template params:", templateParams);

      const result = await emailjs.send(
        "service_qbgq6it",
        "template_ozj0x5x", // Back to original template
        templateParams,
        "tyAJr20tpxEI5o8yq"
      );

      console.log("EmailJS Result:", result);
      console.log("Blocking email sent successfully");
    } catch (error) {
      console.error("Error sending blocking email:", error);
      console.error("Full error details:", JSON.stringify(error, null, 2));
    }
  };

  // Update user status (approve or block)
  const updateUserStatus = async (status: UserStatus) => {
    // Prevent multiple clicks during processing
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("id", "==", user.id));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        showAlert("error", "שגיאה", "המשתמש לא נמצא.");
        setIsProcessing(false);
        return;
      }

      const userDocRef = snapshot.docs[0].ref;
      await updateDoc(userDocRef, { status });

      // Send appropriate email based on status
      if (status === "approved") {
        await sendApprovalEmail(user.email, user.fullName);
      } else if (status === "blocked") {
        await sendBlockingEmail(user.email, user.fullName);
      }

      // Show success alert with refresh flag
      const statusText = status === "approved" ? "מאושר" : "חסום";
      const message = `סטטוס המשתמש עודכן ל-${statusText} ונשלח מייל הודעה למשתמש.`;

      showAlert(
        "success",
        "הפעולה בוצעה בהצלחה",
        message,
        true // Needs refresh when closed
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      showAlert("error", "שגיאה", "עדכון סטטוס נכשל. נסה שוב.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Show confirmation dialog for user deletion
  const confirmDeleteUser = () => {
    showAlert(
      "confirm",
      "אישור מחיקת משתמש",
      `האם אתה בטוח שברצונך למחוק את המשתמש "${user.fullName}"?`
    );
  };

  // Handle user deletion after confirmation
  const handleDeleteUser = async () => {
    // Prevent multiple clicks during processing
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("id", "==", user.id));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        showAlert("error", "שגיאה", "המשתמש לא נמצא.");
        setIsProcessing(false);
        return;
      }

      const userDocRef = snapshot.docs[0].ref;
      await deleteDoc(userDocRef);

      // Close confirmation popup first
      setAlert((prev) => ({ ...prev, isOpen: false }));

      // Show success message with refresh flag
      showAlert(
        "success",
        "הפעולה בוצעה בהצלחה",
        "המשתמש נמחק בהצלחה.",
        true // Needs refresh when closed
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      // Close confirmation popup and show error message
      setAlert((prev) => ({ ...prev, isOpen: false }));
      setTimeout(() => {
        showAlert("error", "שגיאה", "מחיקת המשתמש נכשלה. נסה שוב.");
      }, 100);
    } finally {
      setIsProcessing(false);
    }
  };

  // Render loading spinner
  const renderLoadingSpinner = () => (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Render checkmark icon for approve button
  const renderCheckIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Render block/prohibition icon for block button
  const renderBlockIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Render trash/delete icon for delete button
  const renderDeleteIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Render approve button
  const renderApproveButton = () => (
    <button
      className={`px-3 py-1.5 ${
        isProcessing ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
      } text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors text-sm`}
      onClick={() => updateUserStatus("approved")}
      disabled={isProcessing}
    >
      <div className="flex items-center gap-1">
        {isProcessing ? renderLoadingSpinner() : renderCheckIcon()}
        <span>אישור</span>
      </div>
    </button>
  );

  // Render block button
  const renderBlockButton = () => (
    <button
      className={`px-3 py-1.5 ${
        isProcessing ? "bg-amber-400" : "bg-amber-500 hover:bg-amber-600"
      } text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-colors text-sm`}
      onClick={() => updateUserStatus("blocked")}
      disabled={isProcessing}
    >
      <div className="flex items-center gap-1">
        {isProcessing ? renderLoadingSpinner() : renderBlockIcon()}
        <span>חסימה</span>
      </div>
    </button>
  );

  // Render delete button
  const renderDeleteButton = () => (
    <button
      className={`px-3 py-1.5 ${
        isProcessing ? "bg-red-400" : "bg-red-500 hover:bg-red-600"
      } text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors text-sm`}
      onClick={confirmDeleteUser}
      disabled={isProcessing}
    >
      <div className="flex items-center gap-1">
        {isProcessing ? renderLoadingSpinner() : renderDeleteIcon()}
        <span>מחיקה</span>
      </div>
    </button>
  );

  return (
    <>
      {/* Action Buttons Container */}
      <div className="flex gap-2 justify-end" dir="rtl">
        {/* Approve Button */}
        {renderApproveButton()}

        {/* Block Button */}
        {renderBlockButton()}

        {/* Delete Button */}
        {renderDeleteButton()}
      </div>

      {/* Alert Popup - Only render when open */}
      {alert.isOpen && (
        <AlertPopup
          type={alert.type}
          title={alert.title}
          message={alert.message}
          isOpen={alert.isOpen}
          onClose={closeAlert}
          onConfirm={alert.type === "confirm" ? handleDeleteUser : undefined}
          confirmText={alert.type === "confirm" ? "מחיקה" : undefined}
        />
      )}
    </>
  );
};

export default UserActions;
