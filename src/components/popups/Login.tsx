import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../DB/firebase/firebase-config";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const usersCollection = collection(db, "users");
      const q = query(
        usersCollection,
        where("email", "==", formData.email),
        where("password", "==", formData.password)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setErrorMessage("Invalid email or password.");
        return;
      }

      const userData = querySnapshot.docs[0].data();

      if (userData.status !== "approved") {
        setErrorMessage("Your account is not approved yet.");
        return;
      }

      // Update AuthContext
      login(userData.isAdmin);

      // Navigate to the correct page
      if (userData.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }

      // Close the popup
      onClose();
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-lg rounded-xl px-8 py-6 space-y-6"
    >
      {errorMessage && (
        <p className="text-center text-red-500 text-sm">{errorMessage}</p>
      )}

      <div>
        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-gray-700 font-medium mb-1"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-transform transform hover:scale-105"
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default Login;
