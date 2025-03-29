// Login.tsx - קומפוננטה מתוקנת
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../DB/firebase/firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getEmailValidationError,
  getPasswordValidationError,
} from "../../utilities/ValidationUtils";

interface ValidationErrors {
  email?: string;
  password?: string;
}

const Login: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // ולידציה של שדה
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "email":
        return getEmailValidationError(value);
      case "password":
        return getPasswordValidationError(value);
      default:
        return "";
    }
  };

  // ולידציה של כל הטופס
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // בדיקת כל שדה בטופס
    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name, value);
      if (error) {
        newErrors[name as keyof ValidationErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // טיפול בשינוי - רק עדכון הערך ללא ולידציה בזמן אמת
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // אין ולידציה בזמן הקלדה - זה מונע את הבעיות
  };

  // טיפול באירוע של יציאה מהשדה - ולידציה רק בעת יציאה מהשדה
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;

    // סימון שנגעו בשדה
    setTouched((prev) => ({ ...prev, [name]: true }));

    // ולידציה של השדה
    const error = validateField(name, formData[name as keyof typeof formData]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Handle login form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    // סימון שנגעו בכל השדות
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as { [key: string]: boolean });

    setTouched(allTouched);

    // ולידציה של כל הטופס לפני שליחה
    if (!validateForm()) {
      return; // אם יש שגיאות, לא להמשיך
    }

    setIsLoading(true);

    try {
      // התחברות באמצעות Firebase Auth
      await signInWithEmailAndPassword(auth, formData.email, formData.password);

      // Check Firestore user status
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("email", "==", formData.email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setServerError("המשתמש לא נמצא במסד הנתונים.");
        return;
      }

      const userData = snapshot.docs[0].data();

      if (userData.status !== "approved") {
        setServerError("החשבון שלך עדיין לא אושר על ידי מנהל.");
        return;
      }

      // Successful login
      login(userData.isAdmin);
      navigate(userData.isAdmin ? "/admin" : "/");
      onClose();
    } catch (error: any) {
      console.error("Login error:", error);
      // טיפול בשגיאות ספציפיות מ-Firebase
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setServerError("אימייל או סיסמה שגויים.");
      } else if (error.code === "auth/too-many-requests") {
        setServerError("יותר מדי ניסיונות כניסה. נסה שוב מאוחר יותר.");
      } else {
        setServerError("אירעה שגיאה. נסה שוב מאוחר יותר.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // טיפול באירוע של לחיצה על "שכחת סיסמה"
  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    // כאן תוכל להוסיף את הלוגיקה לשחזור סיסמה
    console.log("פונקציונליות שכחת סיסמה");
  };

  return (
    <form
      dir="rtl"
      onSubmit={handleSubmit}
      className="mx-auto bg-white rounded-xl space-y-6"
      noValidate // ביטול ולידציה נטיבית של הדפדפן
    >
      {serverError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{serverError}</span>
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-right text-gray-700 font-medium mb-2"
        >
          אימייל <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="הכנס כתובת אימייל"
            className={`w-full border ${
              errors.email && touched.email
                ? "border-red-300"
                : "border-gray-200"
            } rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 ${
              errors.email && touched.email
                ? "focus:ring-red-400 focus:border-red-400"
                : "focus:ring-indigo-500 focus:border-indigo-500"
            } shadow-sm text-right pr-10`}
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
        {/* שומר מקום עבור הודעת שגיאה - תמיד בגובה אחיד */}
        <div className="min-h-[20px] mt-1">
          {errors.email && touched.email && (
            <p className="text-sm text-red-600">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-right text-gray-700 font-medium mb-2"
        >
          סיסמה <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="הכנס סיסמה"
            className={`w-full border ${
              errors.password && touched.password
                ? "border-red-300"
                : "border-gray-200"
            } rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 ${
              errors.password && touched.password
                ? "focus:ring-red-400 focus:border-red-400"
                : "focus:ring-indigo-500 focus:border-indigo-500"
            } shadow-sm text-right pr-10`}
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
        {/* שומר מקום עבור הודעת שגיאה - תמיד בגובה אחיד */}
        <div className="min-h-[20px] mt-1">
          {errors.password && touched.password && (
            <p className="text-sm text-red-600">{errors.password}</p>
          )}
        </div>
        <div className="text-left mt-1">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-indigo-600 hover:text-indigo-800 bg-transparent"
          >
            שכחת סיסמה?
          </button>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full ${
            isLoading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          } text-white px-6 py-2.5 rounded-lg font-medium shadow-md transition-colors flex justify-center items-center`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -mr-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              מתחבר...
            </>
          ) : (
            "התחברות"
          )}
        </button>
      </div>
    </form>
  );
};

export default Login;
