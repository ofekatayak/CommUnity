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
      className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200"
      dir="rtl"
    >
      <table className="min-w-full divide-y divide-gray-200 text-right">
        <thead className="bg-gradient-to-r from-blue-500 to-blue-400 text-white">
          <tr>
            <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">
              ת"ז
            </th>
            <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">
              שם מלא
            </th>
            <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">
              אימייל
            </th>
            <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">
              סטטוס
            </th>
            <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">
              פעולות
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {user.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {user.fullName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {user.status === "approved"
                  ? "מאושר"
                  : user.status === "pending"
                  ? "ממתין לאישור"
                  : "חסום"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <UserActions user={user} refreshUsers={refreshUsers} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
