import React, { useState } from "react";
import { db, auth } from "../../DB/firebase/firebase-config";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { User } from "../../models/User";

interface SignUpProps {
  onClose: () => void;
  onSuccess: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onClose, onSuccess }) => {
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

  // Handle input changes
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
    setMessage("");

    if (formData.password !== confirmPassword) {
      setMessage("הסיסמאות אינן תואמות.");
      return;
    }

    try {
      const q = query(
        collection(db, "users"),
        where("email", "==", formData.email)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setMessage("אימייל זה כבר רשום.");
        return;
      }

      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password || ""
      );

      await auth.signOut();

      await addDoc(collection(db, "users"), {
        ...formData,
        createdAt: new Date().toISOString(),
        status: "pending",
        isAdmin: false,
      });

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

      onClose();
      onSuccess();
    } catch (error: any) {
      console.error("Sign up error:", error);
      setMessage(error.message || "אירעה שגיאה. נסה שוב.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      dir="rtl"
      className="max-w-lg mx-auto bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-lg rounded-xl p-6 space-y-4 sm:p-8"
    >
      {/* Form fields in Hebrew */}
      <input
        type="text"
        name="id"
        value={formData.id}
        onChange={handleChange}
        placeholder="תעודת זהות"
        required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right"
      />

      <input
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        placeholder="שם מלא"
        required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right"
      />

      <input
        type="text"
        name="role"
        value={formData.role}
        onChange={handleChange}
        placeholder="תפקיד בקהילה"
        required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right"
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="אימייל"
        required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right"
      />

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="סיסמה"
        required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right"
      />

      <input
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={handleChange}
        placeholder="אימות סיסמה"
        required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right"
      />

      <div className="text-center">
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:scale-105 transition-transform"
        >
          הרשם
        </button>
      </div>

      {message && (
        <p className="text-center text-red-600 font-medium mt-4">{message}</p>
      )}
    </form>
  );
};

export default SignUp;
