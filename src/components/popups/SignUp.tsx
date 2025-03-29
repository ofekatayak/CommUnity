// SignUp.tsx - קומפוננטה מתוקנת
import React, { useState } from "react";
import { db, auth } from "../../DB/firebase/firebase-config";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { User } from "../../models/User";
import {
  getIDValidationError,
  getNameValidationError,
  getEmailValidationError,
  getPasswordValidationError,
  getPasswordMatchError,
} from "../../utilities/ValidationUtils";

interface SignUpProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface ValidationErrors {
  id?: string;
  fullName?: string;
  role?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
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
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);

  // ולידציה של שדה
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "id":
        return getIDValidationError(value);

      case "fullName":
        return getNameValidationError(value);

      case "role":
        if (!value.trim()) return "נא להזין תפקיד בקהילה";
        return "";

      case "email":
        return getEmailValidationError(value);

      case "password":
        return getPasswordValidationError(value);

      case "confirmPassword":
        return getPasswordMatchError(formData.password || "", value);

      default:
        return "";
    }
  };

  // טיפול בשינוי - רק עדכון הערך ללא ולידציה בזמן אמת
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
    // אין ולידציה בזמן הקלדה - זה מונע את הבעיות
  };

  // טיפול באירוע של יציאה מהשדה
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;

    // סימון שנגעו בשדה
    setTouched((prev) => ({ ...prev, [name]: true }));

    // ולידציה של השדה
    let value = "";
    if (name === "confirmPassword") {
      value = confirmPassword;
    } else {
      value = (formData[name as keyof typeof formData] as string) || "";
    }

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));

    // אם יצאנו משדה הסיסמה ונגענו כבר באישור הסיסמה, בדוק גם אותו
    if (name === "password" && touched["confirmPassword"]) {
      const confirmError = getPasswordMatchError(value, confirmPassword);
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  // ולידציה של כל הטופס
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // בדיקת כל שדה בטופס
    const fieldNames = ["id", "fullName", "role", "email", "password"];
    fieldNames.forEach((name) => {
      const error = validateField(
        name,
        (formData[name as keyof typeof formData] as string) || ""
      );
      if (error) {
        newErrors[name as keyof ValidationErrors] = error;
        isValid = false;
      }
    });

    // בדיקת אישור סיסמה
    const confirmError = validateField("confirmPassword", confirmPassword);
    if (confirmError) {
      newErrors.confirmPassword = confirmError;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // סימון שנגעו בכל השדות
    const allTouched = [
      "id",
      "fullName",
      "role",
      "email",
      "password",
      "confirmPassword",
    ].reduce((acc, key) => {
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
      const q = query(
        collection(db, "users"),
        where("email", "==", formData.email)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setMessage("אימייל זה כבר רשום.");
        setIsLoading(false);
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
      setErrors({});
      setTouched({});

      onClose();
      onSuccess();
    } catch (error: any) {
      console.error("Sign up error:", error);

      // טיפול בשגיאות נפוצות של פיירבייס
      if (error.code === "auth/email-already-in-use") {
        setMessage("אימייל זה כבר רשום.");
      } else if (error.code === "auth/weak-password") {
        setMessage("הסיסמה חלשה מדי. נא להשתמש בסיסמה חזקה יותר.");
      } else if (error.code === "auth/invalid-email") {
        setMessage("כתובת האימייל אינה תקינה.");
      } else {
        setMessage(error.message || "אירעה שגיאה. נסה שוב.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // פונקציה שמחזירה את ה־className המתאים לכל שדה
  const getInputClassName = (fieldName: string) => {
    const hasError =
      errors[fieldName as keyof ValidationErrors] && touched[fieldName];
    return `w-full border ${
      hasError ? "border-red-300" : "border-gray-200"
    } rounded-lg px-4 py-2.5 pr-10 text-right shadow-sm focus:outline-none focus:ring-2 ${
      hasError
        ? "focus:ring-red-400 focus:border-red-400"
        : "focus:ring-indigo-500 focus:border-indigo-500"
    }`;
  };

  // פונקציה ליצירת שדה קלט באופן מובנה
  const renderInputField = (
    name: string,
    placeholder: string,
    icon: React.ReactNode,
    type: string = "text",
    value: string
  ) => {
    return (
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {icon}
          </div>
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={getInputClassName(name)}
          />
        </div>
        {/* הודעת שגיאה */}
        <div className="h-5 mt-1">
          {errors[name as keyof ValidationErrors] && touched[name] && (
            <p className="text-sm text-red-600">
              {errors[name as keyof ValidationErrors]}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      dir="rtl"
      className="mx-auto bg-white rounded-xl"
      noValidate
    >
      {message && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
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
            <span className="font-medium">{message}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        {/* תעודת זהות */}
        <div>
          {renderInputField(
            "id",
            "תעודת זהות",
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>,
            "text",
            formData.id
          )}
        </div>

        {/* שם מלא */}
        <div>
          {renderInputField(
            "fullName",
            "שם מלא",
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>,
            "text",
            formData.fullName
          )}
        </div>
      </div>

      {/* תפקיד בקהילה */}
      {renderInputField(
        "role",
        "תפקיד בקהילה",
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
        </svg>,
        "text",
        formData.role
      )}

      {/* אימייל */}
      {renderInputField(
        "email",
        "אימייל",
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>,
        "email",
        formData.email
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        {/* סיסמה */}
        <div>
          {renderInputField(
            "password",
            "סיסמה",
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
            </svg>,
            "password",
            formData.password || ""
          )}
        </div>

        {/* אימות סיסמה */}
        <div>
          {renderInputField(
            "confirmPassword",
            "אימות סיסמה",
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
            </svg>,
            "password",
            confirmPassword
          )}
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
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              מבצע הרשמה...
            </>
          ) : (
            "הרשמה"
          )}
        </button>
      </div>
    </form>
  );
};

export default SignUp;
