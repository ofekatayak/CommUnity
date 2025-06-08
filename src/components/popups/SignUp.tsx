// SignUp.tsx - User Registration Component
import React, { useState } from "react";
import { db, auth } from "../../DB/firebase/firebase-config";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { User } from "../../models/User";
import AlertPopup from "./AlertPopup";
import {
  getIDValidationError,
  getNameValidationError,
  getEmailValidationError,
  getPasswordValidationError,
  getPasswordMatchError,
} from "../../utilities/ValidationUtils";

// Interface for component props
interface SignUpProps {
  onClose: () => void;
  onSuccess: () => void;
}

// Interface for form validation errors
interface ValidationErrors {
  id?: string;
  fullName?: string;
  role?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

// Interface for alert state management
interface AlertState {
  type: "success" | "error";
  title: string;
  message: string;
  isOpen: boolean;
}

const SignUp: React.FC<SignUpProps> = ({ onClose, onSuccess }) => {
  // State management
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

  // State for alert notifications
  const [alert, setAlert] = useState<AlertState>({
    type: "success",
    title: "",
    message: "",
    isOpen: false,
  });

  // Show alert notification
  const showAlert = (
    type: "success" | "error",
    title: string,
    message: string
  ) => {
    setAlert({
      type,
      title,
      message,
      isOpen: true,
    });
  };

  // Close alert
  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, isOpen: false }));

    // If it's a success alert, close the signup form and call onSuccess
    if (alert.type === "success") {
      onClose(); // Close the signup modal
      // onSuccess(); // Trigger any additional success handling
    }
  };

  // Field validation helper function
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

  // Handle input change - updates value without real-time validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle input blur - validates field when user leaves the field
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Get field value for validation
    let value = "";
    if (name === "confirmPassword") {
      value = confirmPassword;
    } else {
      value = (formData[name as keyof typeof formData] as string) || "";
    }

    // Validate the specific field
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));

    // If leaving password field and confirm password was already touched, validate it too
    if (name === "password" && touched["confirmPassword"]) {
      const confirmError = getPasswordMatchError(value, confirmPassword);
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  // Form validation function
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Validate all form fields
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

    // Validate confirm password
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

    // Mark all fields as touched
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

    // Validate entire form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Check if email already exists
      const emailQuery = query(
        collection(db, "users"),
        where("email", "==", formData.email)
      );
      const emailSnapshot = await getDocs(emailQuery);
      if (!emailSnapshot.empty) {
        showAlert(
          "error",
          "שגיאה בהרשמה",
          "כתובת אימייל זו כבר רשומה במערכת. אנא השתמש בכתובת אימייל אחרת."
        );
        setIsLoading(false);
        return;
      }

      // Check if ID already exists
      const idQuery = query(
        collection(db, "users"),
        where("id", "==", formData.id)
      );
      const idSnapshot = await getDocs(idQuery);
      if (!idSnapshot.empty) {
        showAlert(
          "error",
          "שגיאה בהרשמה",
          "תעודת זהות זו כבר רשומה במערכת. אם יש לך כבר חשבון, נסה להתחבר במקום להירשם."
        );
        setIsLoading(false);
        return;
      }

      // Create user with Firebase Auth
      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password || ""
      );

      // Sign out immediately after creation (user needs approval)
      await auth.signOut();

      // Add user data to Firestore
      await addDoc(collection(db, "users"), {
        ...formData,
        createdAt: new Date().toISOString(),
        status: "pending",
        isAdmin: false,
      });

      // Only clear form and show success if everything succeeded
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

      // Show success popup with the stored name
      showAlert(
        "success",
        "נרשמת בהצלחה!",
        `שלום ${formData.fullName}!

הרשמתך התקבלה בהצלחה והועברה לבדיקת המנהלים.

תקבל הודעה במייל ברגע שהחשבון שלך יאושר ותוכל להתחיל להשתמש במערכת.

תודה על ההרשמה ל-CommUnity!`
      );
    } catch (error: any) {
      console.error("Sign up error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));

      // Handle common Firebase authentication errors with popup
      let errorTitle = "שגיאה בהרשמה";
      let errorMessage = "";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage =
            "כתובת אימייל זו כבר רשומה במערכת. אנא השתמש בכתובת אימייל אחרת או נסה להתחבר.";
          break;
        case "auth/weak-password":
          errorMessage =
            "הסיסמה חלשה מדי. אנא השתמש בסיסמה חזקה יותר (לפחות 6 תווים).";
          break;
        case "auth/invalid-email":
          errorMessage = "כתובת האימייל אינה תקינה. אנא בדוק ונסה שוב.";
          break;
        case "auth/network-request-failed":
          errorMessage = "בעיית רשת. אנא בדוק את החיבור לאינטרנט ונסה שוב.";
          break;
        case "auth/operation-not-allowed":
          errorMessage =
            "הרשמה באימייל וסיסמה אינה מופעלת במערכת. אנא צור קשר עם המנהל.";
          break;
        default:
          errorMessage = `אירעה שגיאה בהרשמה. אנא נסה שוב מאוחר יותר.${
            error.message ? ` (${error.message})` : ""
          }`;
          break;
      }

      showAlert("error", errorTitle, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Get appropriate CSS class for input field based on validation state
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

  // Render structured input field with icon and validation
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
        {/* Error message container - maintains consistent height */}
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

  // Render loading spinner
  const renderLoadingSpinner = () => (
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
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Render error icon
  const renderErrorIcon = () => (
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
  );

  // Render ID card icon
  const renderIdIcon = () => (
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
    </svg>
  );

  // Render user icon
  const renderUserIcon = () => (
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
    </svg>
  );

  // Render role/briefcase icon
  const renderRoleIcon = () => (
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
    </svg>
  );

  // Render email icon
  const renderEmailIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-gray-400"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  );

  // Render password/lock icon
  const renderPasswordIcon = () => (
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
  );

  return (
    <>
      <form
        onSubmit={handleSubmit}
        dir="rtl"
        className="mx-auto bg-white rounded-xl"
        noValidate // Disable native browser validation
      >
        {/* Error Message Display (keeping for backward compatibility) */}
        {message && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              {renderErrorIcon()}
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        {/* First Row - ID and Full Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <div>
            {renderInputField(
              "id",
              "תעודת זהות",
              renderIdIcon(),
              "text",
              formData.id
            )}
          </div>
          <div>
            {renderInputField(
              "fullName",
              "שם מלא",
              renderUserIcon(),
              "text",
              formData.fullName
            )}
          </div>
        </div>

        {/* Community Role Field */}
        {renderInputField(
          "role",
          "תפקיד בקהילה",
          renderRoleIcon(),
          "text",
          formData.role
        )}

        {/* Email Field */}
        {renderInputField(
          "email",
          "אימייל",
          renderEmailIcon(),
          "email",
          formData.email
        )}

        {/* Password Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <div>
            {renderInputField(
              "password",
              "סיסמה",
              renderPasswordIcon(),
              "password",
              formData.password || ""
            )}
          </div>
          <div>
            {renderInputField(
              "confirmPassword",
              "אימות סיסמה",
              renderPasswordIcon(),
              "password",
              confirmPassword
            )}
          </div>
        </div>

        {/* Submit Button */}
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
                {renderLoadingSpinner()}
                מבצע הרשמה...
              </>
            ) : (
              "הרשמה"
            )}
          </button>
        </div>
      </form>

      {/* Alert Popup - Only render when open */}
      {alert.isOpen && (
        <AlertPopup
          type={alert.type}
          title={alert.title}
          message={alert.message}
          isOpen={alert.isOpen}
          onClose={closeAlert}
        />
      )}
    </>
  );
};

export default SignUp;
