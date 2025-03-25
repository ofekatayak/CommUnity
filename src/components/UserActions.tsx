// UserActions.tsx
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

interface UserActionsProps {
  user: User;
  refreshUsers: () => Promise<void>;
}

const UserActions: React.FC<UserActionsProps> = ({ user, refreshUsers }) => {
  // מצב להתראות
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "confirm";
    title: string;
    message: string;
    isOpen: boolean;
    needsRefresh: boolean; // נוסף - האם צריך לרענן כשנסגר
  }>({
    type: "success",
    title: "",
    message: "",
    isOpen: false,
    needsRefresh: false,
  });

  // שמירת הסטטוס של הפעולות
  const [isProcessing, setIsProcessing] = useState(false);

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

  const closeAlert = async () => {
    const shouldRefresh = alert.needsRefresh;

    // סגור את הפופאפ
    setAlert((prev) => ({ ...prev, isOpen: false }));

    // אם צריך לרענן, עשה זאת רק אחרי סגירת הפופאפ
    if (shouldRefresh) {
      // מחכים רגע קטן לפני הרענון
      setTimeout(() => {
        refreshUsers();
      }, 100);
    }
  };

  const updateUserStatus = async (status: "approved" | "blocked") => {
    // מניעת ריבוי לחיצות
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

      // פתח את ההתראה עם דגל שמציין שצריך לרענן בסגירה
      showAlert(
        "success",
        "הפעולה בוצעה בהצלחה",
        `סטטוס המשתמש עודכן ל-${status === "approved" ? "מאושר" : "חסום"}.`,
        true // צריך לרענן כשנסגר
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      showAlert("error", "שגיאה", "עדכון סטטוס נכשל. נסה שוב.");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmDeleteUser = () => {
    showAlert(
      "confirm",
      "אישור מחיקת משתמש",
      `האם אתה בטוח שברצונך למחוק את המשתמש "${user.fullName}"?`
    );
  };

  const handleDeleteUser = async () => {
    // מניעת ריבוי לחיצות
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

      // סגור קודם את פופאפ האישור
      setAlert((prev) => ({ ...prev, isOpen: false }));

      // פתח את הודעת ההצלחה, עם דגל שמציין שצריך לרענן
      showAlert(
        "success",
        "הפעולה בוצעה בהצלחה",
        "המשתמש נמחק בהצלחה.",
        true // צריך לרענן כשנסגר
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      // סגור את פופאפ האישור וגם פתח הודעת שגיאה
      setAlert((prev) => ({ ...prev, isOpen: false }));
      setTimeout(() => {
        showAlert("error", "שגיאה", "מחיקת המשתמש נכשלה. נסה שוב.");
      }, 100);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="flex gap-2 justify-end" dir="rtl">
        {/* Approve Button */}
        <button
          className={`px-3 py-1.5 ${
            isProcessing ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
          } text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors text-sm`}
          onClick={() => updateUserStatus("approved")}
          disabled={isProcessing}
        >
          <div className="flex items-center gap-1">
            {isProcessing ? (
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
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
            )}
            <span>אישור</span>
          </div>
        </button>

        {/* Block Button */}
        <button
          className={`px-3 py-1.5 ${
            isProcessing ? "bg-amber-400" : "bg-amber-500 hover:bg-amber-600"
          } text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-colors text-sm`}
          onClick={() => updateUserStatus("blocked")}
          disabled={isProcessing}
        >
          <div className="flex items-center gap-1">
            {isProcessing ? (
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
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
            )}
            <span>חסימה</span>
          </div>
        </button>

        {/* Delete Button */}
        <button
          className={`px-3 py-1.5 ${
            isProcessing ? "bg-red-400" : "bg-red-500 hover:bg-red-600"
          } text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors text-sm`}
          onClick={confirmDeleteUser}
          disabled={isProcessing}
        >
          <div className="flex items-center gap-1">
            {isProcessing ? (
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
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
            )}
            <span>מחיקה</span>
          </div>
        </button>
      </div>

      {/* חשוב להשתמש באופרטור && כדי לוודא שהפופאפ מורנדר רק כשהוא פתוח */}
      {alert.isOpen && (
        <AlertPopup
          type={alert.type}
          title={alert.title}
          message={alert.message}
          isOpen={alert.isOpen}
          onClose={closeAlert}
          onConfirm={alert.type === "confirm" ? handleDeleteUser : undefined}
          confirmText={alert.type === "confirm" ? "מחיקה" : undefined} // הוספת הטקסט המתאים לכפתור
        />
      )}
    </>
  );
};

export default UserActions;
