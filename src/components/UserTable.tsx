import React from "react";
import { User } from "../models/User";
import UserActions from "./UserActions";

interface UserTableProps {
  users: User[];
  refreshUsers: () => Promise<void>; // Function to refresh users
}

const UserTable: React.FC<UserTableProps> = ({ users, refreshUsers }) => {
  return (
    <div
      className="overflow-x-auto shadow-lg rounded-xl border border-gray-100"
      dir="rtl"
    >
      <table className="min-w-full divide-y divide-gray-200 text-right">
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
        <tbody className="bg-white divide-y divide-gray-100">
          {users.length > 0 ? (
            users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-indigo-50/30 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                  {user.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.role || "לא צוין"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : user.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status === "approved"
                      ? "מאושר"
                      : user.status === "pending"
                      ? "ממתין לאישור"
                      : "חסום"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <UserActions user={user} refreshUsers={refreshUsers} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center">
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
                  <p className="text-lg font-medium">לא נמצאו משתמשים</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
