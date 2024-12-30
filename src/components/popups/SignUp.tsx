import React, { useState } from "react";
import { db } from "../../DB/firebase/firebase-config"; // Import Firestore configuration
import { collection, addDoc } from "firebase/firestore"; // Firestore methods
import { User } from "../../models/User"; // Import User model

const SignUp: React.FC = () => {
  // State to manage form data for the sign-up fields
  const [formData, setFormData] = useState<User>({
    id: "",
    fullName: "",
    role: "",
    email: "",
    password: "",
    status: "pending", // Default status
    isAdmin: false, // Default admin status
  });

  const [confirmPassword, setConfirmPassword] = useState(""); // Separate state for confirm password
  const [message, setMessage] = useState(""); // Feedback message for the user

  // Handle input field changes and update state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  
    // Validate passwords match
    if (formData.password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
  
    try {
      const usersCollection = collection(db, "users");
      await addDoc(usersCollection, {
        ...formData,
        createdAt: new Date().toISOString(), // Add timestamp
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
      setConfirmPassword(""); // Reset confirm password
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      {/* Input field for ID */}
      <label>ID</label>
      <input
        type="text"
        name="id"
        value={formData.id}
        onChange={handleChange}
        placeholder="Enter your ID"
        required
      />

      {/* Input field for Full Name */}
      <label>Full Name</label>
      <input
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        placeholder="Enter your full name"
        required
      />

      {/* Input field for Role */}
      <label>Role</label>
      <input
        type="text"
        name="role"
        value={formData.role}
        onChange={handleChange}
        placeholder="Enter your role"
        required
      />

      {/* Input field for Email */}
      <label>Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        required
      />

      {/* Input field for Password */}
      <label>Password</label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
        required
      />

      {/* Input field for Confirm Password */}
      <label>Confirm Password</label>
      <input
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={handleChange}
        placeholder="Confirm your password"
        required
      />

      {/* Submit button */}
      <button type="submit">Sign Up</button>
      {message && <p>{message}</p>} {/* Display feedback message */}
    </form>
  );
};

export default SignUp;
