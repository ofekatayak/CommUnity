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
      className="mx-auto bg-white rounded-xl space-y-6"
    >
      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{errorMessage}</span>
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-right text-gray-700 font-medium mb-2"
        >
          אימייל
        </label>
        <div className="relative">
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="הכנס כתובת אימייל"
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-right pr-10"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-right text-gray-700 font-medium mb-2"
        >
          סיסמה
        </label>
        <div className="relative">
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="הכנס סיסמה"
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-right pr-10"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="text-left mt-1">
          <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">
            שכחת סיסמה?
          </a>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-md transition-colors"
        >
          התחברות
        </button>
      </div>
    </form>
  );
};

export default Login;
