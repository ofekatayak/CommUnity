import React, { useState } from "react";
import { db } from "../../DB/firebase/firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { User } from "../../models/User";

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<User>({
    id: "",
    fullName: "",
    role: "",
    email: "",
    password: "",
    status: "pending",
    isAdmin: false,
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const usersCollection = collection(db, "users");
      await addDoc(usersCollection, {
        ...formData,
        createdAt: new Date().toISOString(),
      });

      setMessage("Registration successful. Waiting for admin approval.");
      setFormData({
        id: "",
        fullName: "",
        role: "",
        email: "",
        password: "",
        status: "pending",
        isAdmin: false,
      });
      setConfirmPassword("");
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-lg rounded-xl p-6 space-y-4 sm:p-8"
    >
      {/* Input field for ID */}
      <div>
        <label className="block text-gray-600 font-medium mb-1">ID</label>
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          placeholder="Enter your ID"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
      </div>

      {/* Input field for Full Name */}
      <div>
        <label className="block text-gray-600 font-medium mb-1">
          Full Name
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
      </div>

      {/* Input field for Role */}
      <div>
        <label className="block text-gray-600 font-medium mb-1">Role</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Enter your role"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
      </div>

      {/* Input field for Email */}
      <div>
        <label className="block text-gray-600 font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
      </div>

      {/* Input field for Password */}
      <div>
        <label className="block text-gray-600 font-medium mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
      </div>

      {/* Input field for Confirm Password */}
      <div>
        <label className="block text-gray-600 font-medium mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
      </div>

      {/* Submit button */}
      <div className="text-center">
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-transform transform hover:scale-105"
        >
          Sign Up
        </button>
      </div>

      {message && (
        <p className="text-center text-red-500 font-medium mt-4">{message}</p>
      )}
    </form>
  );
};

export default SignUp;
