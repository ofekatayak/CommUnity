import React from "react";
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

interface UserActionsProps {
  user: User;
  refreshUsers: () => Promise<void>;
}

const UserActions: React.FC<UserActionsProps> = ({ user, refreshUsers }) => {
  const updateUserStatus = async (status: "approved" | "blocked") => {
    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("id", "==", user.id));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert("המשתמש לא נמצא.");
        return;
      }

      const userDocRef = snapshot.docs[0].ref;
      await updateDoc(userDocRef, { status });
      alert(`הסטטוס עודכן ל-${status === "approved" ? "מאושר" : "חסום"}.`);
      await refreshUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("עדכון סטטוס נכשל. נסה שוב.");
    }
  };

  const deleteUser = async () => {
    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("id", "==", user.id));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert("המשתמש לא נמצא.");
        return;
      }

      const userDocRef = snapshot.docs[0].ref;
      await deleteDoc(userDocRef);
      alert("המשתמש נמחק.");
      await refreshUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("מחיקת המשתמש נכשלה. נסה שוב.");
    }
  };

  return (
    <div className="flex gap-2 justify-end" dir="rtl">
      {/* Approve Button */}
      <button
        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition"
        onClick={() => updateUserStatus("approved")}
      >
        ✅ אשר
      </button>

      {/* Block Button */}
      <button
        className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 transition"
        onClick={() => updateUserStatus("blocked")}
      >
        ⛔ חסום
      </button>

      {/* Delete Button */}
      <button
        className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition"
        onClick={deleteUser}
      >
        🗑 מחק
      </button>
    </div>
  );
};

export default UserActions;
