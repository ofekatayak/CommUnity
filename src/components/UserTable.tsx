import React from "react";
import { User } from "../models/User";
import UserActions from "./UserActions";
import "./css/UserTable.css";

interface UserTableProps {
  users: User[];
  refreshUsers: () => Promise<void>; // Function to refresh users
}

const UserTable: React.FC<UserTableProps> = ({ users, refreshUsers }) => {
  return (
    <div className="user-table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>
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
export{};