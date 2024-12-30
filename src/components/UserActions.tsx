import React from "react";
import { db } from "../DB/firebase/firebase-config";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { User } from "../models/User";
import "./css/UserActions.css"; // CSS for buttons

interface UserActionsProps {
  user: User;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserActions: React.FC<UserActionsProps> = ({ user, setUsers }) => {
  // Update user status
  const updateUserStatus = async (status: "approved" | "blocked") => {
    try {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, { status });
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? { ...u, status } : u))
      );
      alert(`User ${status === "approved" ? "approved" : "blocked"}.`);
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  // Delete user
  const deleteUser = async () => {
    try {
      const userRef = doc(db, "users", user.id);
      await deleteDoc(userRef);
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
      alert("User deleted.");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="user-actions">
      <button
        className="user-action-button approve-button"
        onClick={() => updateUserStatus("approved")}
      >
        Approve
      </button>
      <button
        className="user-action-button block-button"
        onClick={() => updateUserStatus("blocked")}
      >
        Block
      </button>
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
export{};
