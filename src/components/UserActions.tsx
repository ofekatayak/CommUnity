import React from "react";
import { db } from "../DB/firebase/firebase-config";
import { collection, query, where, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { User } from "../models/User";
import "./css/UserActions.css";

interface UserActionsProps {
  user: User;
  refreshUsers: () => Promise<void>; // Function to refresh the user list
}

const UserActions: React.FC<UserActionsProps> = ({ user, refreshUsers }) => {
  // Function to update the status of a user
  const updateUserStatus = async (status: "approved" | "blocked") => {
    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("id", "==", user.id)); // Query the user by their ID
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert("User not found."); // Alert if no matching user is found
        return;
      }

      const userDocRef = snapshot.docs[0].ref; // Get the first matching document reference
      await updateDoc(userDocRef, { status }); // Update the status field in Firestore
      alert(`User status updated to ${status}.`); // Notify success
      await refreshUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error updating user status:", error); // Log error details
      alert("Failed to update user status. Please try again."); // Notify failure
    }
  };

  // Function to delete a user from the database
  const deleteUser = async () => {
    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("id", "==", user.id)); // Query the user by their ID
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert("User not found."); // Alert if no matching user is found
        return;
      }

      const userDocRef = snapshot.docs[0].ref; // Get the first matching document reference
      await deleteDoc(userDocRef); // Delete the document from Firestore
      alert("User deleted."); // Notify success
      await refreshUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error deleting user:", error); // Log error details
      alert("Failed to delete user. Please try again."); // Notify failure
    }
  };

  return (
    <div className="user-actions">
      {/* Button to approve a user */}
      <button
        className="user-action-button approve-button"
        onClick={() => updateUserStatus("approved")}
      >
        Approve
      </button>

      {/* Button to block a user */}
      <button
        className="user-action-button block-button"
        onClick={() => updateUserStatus("blocked")}
      >
        Block
      </button>

      {/* Button to delete a user */}
      <button
        className="user-action-button delete-button"
        onClick={deleteUser}
      >
        Delete
      </button>
    </div>
  );
};

export default UserActions;
export {};
