import React, { useState } from "react";

const SignUp: React.FC = () => {
  // State to manage form data for the sign-up fields
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle input field changes and update state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign Up Data:", formData);
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
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm your password"
        required
      />

      {/* Submit button */}
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUp;
