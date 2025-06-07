// UserTable.tsx - User Management Table Component
import React from "react";
import { User } from "../models/User";
import UserActions from "./UserActions";

// Interface for component props
interface UserTableProps {
  users: User[];
  refreshUsers: () => Promise<void>; // Function to refresh users list
}

// Type for user status values
type UserStatus = "approved" | "pending" | "blocked";

const UserTable: React.FC<UserTableProps> = ({ users, refreshUsers }) => {
  // Get status badge styling based on user status
  const getStatusBadgeClass = (status: UserStatus): string => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "blocked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status text in Hebrew based on user status
  const getStatusText = (status: UserStatus): string => {
    switch (status) {
      case "approved":
        return "מאושר";
      case "pending":
        return "ממתין לאישור";
      case "blocked":
        return "חסום";
      default:
        return "לא ידוע";
    }
  };

  // Render users icon for empty state
  const renderUsersIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-gray-300 mb-2"
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

  // Render table header
  const renderTableHeader = () => (
    <thead className="bg-indigo-50">
      <tr>
        <th className="px-6 py-3 text-xs font-medium text-indigo-800 uppercase tracking-wider">
          ת"ז
        </th>
        <th className="px-6 py-3 text-xs font-medium text-indigo-800 uppercase tracking-wider">
          שם מלא
        </th>
        <th className="px-6 py-3 text-xs font-medium text-indigo-800 uppercase tracking-wider">
          תפקיד
        </th>
        <th className="px-6 py-3 text-xs font-medium text-indigo-800 uppercase tracking-wider">
          אימייל
        </th>
        <th className="px-6 py-3 text-xs font-medium text-indigo-800 uppercase tracking-wider">
          סטטוס
        </th>
        <th className="px-6 py-3 text-xs font-medium text-indigo-800 uppercase tracking-wider">
          פעולות
        </th>
      </tr>
    </thead>
  );

  // Render status badge for user
  const renderStatusBadge = (status: UserStatus) => (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
        status
      )}`}
    >
      {getStatusText(status)}
    </span>
  );

  // Render individual user row
  const renderUserRow = (user: User) => (
    <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors">
      {/* ID Column */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {user.id}
      </td>

      {/* Full Name Column */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
        {user.fullName}
      </td>

      {/* Role Column */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {user.role || "לא צוין"}
      </td>

      {/* Email Column */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {user.email}
      </td>

      {/* Status Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        {renderStatusBadge(user.status as UserStatus)}
      </td>

      {/* Actions Column */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        <UserActions user={user} refreshUsers={refreshUsers} />
      </td>
    </tr>
  );

  // Render empty state when no users are found
  const renderEmptyState = () => (
    <tr>
      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
        <div className="flex flex-col items-center justify-center">
          {renderUsersIcon()}
          <p className="text-lg font-medium">לא נמצאו משתמשים</p>
        </div>
      </td>
    </tr>
  );

  // Render table body with users or empty state
  const renderTableBody = () => (
    <tbody className="bg-white divide-y divide-gray-100">
      {users.length > 0 ? users.map(renderUserRow) : renderEmptyState()}
    </tbody>
  );

  return (
    <div
      className="overflow-x-auto shadow-lg rounded-xl border border-gray-100"
      dir="rtl"
    >
      <table className="min-w-full divide-y divide-gray-200 text-right">
        {/* Table Header */}
        {renderTableHeader()}

        {/* Table Body */}
        {renderTableBody()}
      </table>
    </div>
  );
};

export default UserTable;
