import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../DB/firebase/firebase-config";
import { useAuth } from "../../context/AuthContext"; // Auth context for login/logout
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { login } = useAuth(); // Use login from Auth context
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
      console.log("Login successful:", userData);

      // Navigate to the correct page
      if (userData.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        required
      />
      <label>Password</label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
        required
      />
      <button type="submit">Login</button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </form>
  );
};

export default Login;
