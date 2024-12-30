import React, { useEffect, useState } from "react";
import { db } from "../DB/firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { User } from "../models/User";
import UserTable from "./UserTable"; // טבלת המשתמשים
import Header from "./Header"; // ייבוא Header
import "./css/AdminPanel.css"; // CSS for table styling

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users from Firebase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const snapshot = await getDocs(usersCollection);
        const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="admin-panel-container">
      {/* הוספת ה-Header */}
      <Header />
      <h1 className="admin-panel-title">Admin Panel</h1>
      <UserTable users={users} setUsers={setUsers} />
    </div>
  );
};

export default AdminPanel;
