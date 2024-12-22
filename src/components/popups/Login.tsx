import React, { useState } from "react";

const Login: React.FC = () => {
  // State to manage form data for email and password
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle input field changes and update state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login Data:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Email input field */}
      <label>Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        required
      />

      {/* Password input field */}
      <label>Password</label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
        required
      />

      {/* Submit button */}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
