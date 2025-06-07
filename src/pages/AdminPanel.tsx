// AdminPanel.tsx - Admin User Management Panel
import React, { useEffect, useState } from "react";
import { db } from "../DB/firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { User } from "../models/User";
import UserTable from "../components/UserTable";
import Header from "../components/Header";

// Type for user filter options
type FilterType = "all" | "pending" | "approved" | "blocked";

// Interface for statistics data
interface UserStats {
  total: number;
  pending: number;
  approved: number;
  blocked: number;
}

const AdminPanel: React.FC = () => {
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<FilterType>("all");

  // Fetch users from Firestore
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersCollection = collection(db, "users");
      const snapshot = await getDocs(usersCollection);
      const allUsers = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.data().id || doc.id,
      })) as User[];

      // Filter out admin users from the list
      const regularUsers = allUsers.filter((user) => !user.isAdmin);
      setUsers(regularUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Get filtered users based on selected filter
  const getFilteredUsers = (): User[] => {
    return users.filter((user) => filter === "all" || user.status === filter);
  };

  // Calculate user statistics
  const getUserStats = (): UserStats => {
    return {
      total: users.length,
      pending: users.filter((u) => u.status === "pending").length,
      approved: users.filter((u) => u.status === "approved").length,
      blocked: users.filter((u) => u.status === "blocked").length,
    };
  };

  // Handle filter change
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value as FilterType);
  };

  // Render refresh icon
  const renderRefreshIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Render users icon for total users stat
  const renderUsersIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-indigo-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );

  // Render clock icon for pending users stat
  const renderClockIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-yellow-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  // Render check circle icon for approved users stat
  const renderCheckCircleIcon = () => (
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
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  // Render page header section
  const renderPageHeader = () => (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-indigo-900">ניהול משתמשים</h1>
        <p className="text-gray-500">צפייה, אישור וניהול משתמשי המערכת</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-700 font-medium">סינון:</span>
        <select
          className="border border-gray-200 rounded-lg shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={filter}
          onChange={handleFilterChange}
        >
          <option value="all">כל המשתמשים</option>
          <option value="pending">ממתינים לאישור</option>
          <option value="approved">מאושרים</option>
          <option value="blocked">חסומים</option>
        </select>

        <button
          className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-200 transition-colors ml-2 flex items-center gap-1"
          onClick={fetchUsers}
        >
          {renderRefreshIcon()}
          <span>רענון</span>
        </button>
      </div>
    </div>
  );

  // Render individual statistics card
  const renderStatCard = (
    title: string,
    value: number,
    icon: React.ReactNode,
    bgColor: string,
    textColor: string,
    iconBgColor: string
  ) => (
    <div className={`${bgColor} p-4 rounded-xl`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${textColor} font-medium`}>{title}</p>
          <p
            className={`text-2xl font-bold ${textColor.replace("700", "900")}`}
          >
            {value}
          </p>
        </div>
        <div className={`${iconBgColor} p-3 rounded-lg`}>{icon}</div>
      </div>
    </div>
  );

  // Render statistics section
  const renderStatsSection = () => {
    const stats = getUserStats();

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {renderStatCard(
          "סה״כ משתמשים",
          stats.total,
          renderUsersIcon(),
          "bg-indigo-50",
          "text-indigo-700",
          "bg-indigo-100"
        )}

        {renderStatCard(
          "ממתינים לאישור",
          stats.pending,
          renderClockIcon(),
          "bg-yellow-50",
          "text-yellow-700",
          "bg-yellow-100"
        )}

        {renderStatCard(
          "משתמשים פעילים",
          stats.approved,
          renderCheckCircleIcon(),
          "bg-green-50",
          "text-green-700",
          "bg-green-100"
        )}
      </div>
    );
  };

  // Render loading spinner
  const renderLoadingSpinner = () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
    </div>
  );

  // Render user table section
  const renderUserTableSection = () => {
    if (loading) {
      return renderLoadingSpinner();
    }

    return <UserTable users={getFilteredUsers()} refreshUsers={fetchUsers} />;
  };

  // Render main content
  const renderMainContent = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 mb-8">
        {/* Page Header */}
        {renderPageHeader()}

        {/* Statistics Section */}
        {renderStatsSection()}

        {/* User Table Section */}
        {renderUserTableSection()}
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-white text-right"
      dir="rtl"
    >
      {/* Header Component */}
      <Header />

      {/* Main Content */}
      {renderMainContent()}
    </div>
  );
};

export default AdminPanel;
