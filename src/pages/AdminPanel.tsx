import React, { useEffect, useState } from "react";
import { db } from "../DB/firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { User } from "../models/User";
import UserTable from "../components/UserTable";
import Header from "../components/Header";

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

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
      console.error("שגיאה בעת שליפת משתמשים:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-right" dir="rtl">
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          פאנל ניהול
        </h1>

        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <UserTable users={users} refreshUsers={fetchUsers} />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
