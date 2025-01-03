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
        alert("User not found.");
        return;
      }

      const userDocRef = snapshot.docs[0].ref;
      await updateDoc(userDocRef, { status });
      alert(`User status updated to ${status}.`);
      await refreshUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status. Please try again.");
    }
  };

  const deleteUser = async () => {
    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("id", "==", user.id));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert("User not found.");
        return;
      }

      const userDocRef = snapshot.docs[0].ref;
      await deleteDoc(userDocRef);
      alert("User deleted.");
      await refreshUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  return (
    <div className="flex gap-4">
      {/* Approve Button */}
      <button
        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition"
        onClick={() => updateUserStatus("approved")}
      >
        Approve
      </button>

      {/* Block Button */}
      <button
        className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 transition"
        onClick={() => updateUserStatus("blocked")}
      >
        Block
      </button>

      {/* Delete Button */}
      <button
        className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition"
        onClick={deleteUser}
      >
        Delete
      </button>
    </div>
  );
};

export default UserActions;
