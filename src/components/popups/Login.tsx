import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../DB/firebase/firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Check Firestore user status
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("email", "==", formData.email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setErrorMessage("המשתמש לא נמצא במסד הנתונים.");
        return;
      }

      const userData = snapshot.docs[0].data();

      if (userData.status !== "approved") {
        setErrorMessage("החשבון שלך עדיין לא אושר על ידי מנהל.");
        return;
      }

      // Successful login
      login(userData.isAdmin);
      navigate(userData.isAdmin ? "/admin" : "/");
      onClose();
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage("אימייל או סיסמה שגויים.");
    }
  };

  return (
    <form
      dir="rtl"
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow-xl rounded-2xl px-8 py-6 space-y-6 border border-gray-200"
    >
      {errorMessage && (
        <p className="text-center text-red-600 text-sm font-medium">
          {errorMessage}
        </p>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-right text-gray-700 font-medium mb-1"
        >
          אימייל
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="הכנס כתובת אימייל"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-right text-gray-700 font-medium mb-1"
        >
          סיסמה
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="הכנס סיסמה"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-semibold shadow-md transition-transform hover:scale-105"
        >
          התחבר
        </button>
      </div>
    </form>
  );
};

export default Login;
