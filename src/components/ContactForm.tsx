// ContactForm.tsx - Contact Form Component
import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import {
  getEmailValidationError,
  getPhoneValidationError,
  getNameValidationError,
} from "../utilities/ValidationUtils";
import AlertPopup from "./popups/AlertPopup";

// Interface for component props
interface ContactFormProps {
  onSubmit?: () => void;
  isVisible: boolean;
}

// Interface for form validation errors
interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

// Interface for form data
interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Interface for alert state management
interface AlertState {
  type: "success" | "error";
  title: string;
  message: string;
  isOpen: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, isVisible }) => {
  // State management
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // State for alert notifications
  const [alert, setAlert] = useState<AlertState>({
    type: "success",
    title: "",
    message: "",
    isOpen: false,
  });

  // Reset form when it becomes visible again after successful submission
  useEffect(() => {
    if (isVisible && submitted) {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      // Reset errors and touched states when form is shown again
      setErrors({});
      setTouched({});
      setAlert({ type: "success", title: "", message: "", isOpen: false });
    }
  }, [isVisible, submitted]);

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

    // If it's a success alert, call onSubmit immediately without showing success message
    if (alert.type === "success") {
      if (onSubmit) {
        onSubmit(); // Close the form immediately without showing success state
      }
    }
  };

  // Field validation helper function
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        return getNameValidationError(value);
      case "email":
        return getEmailValidationError(value);
      case "phone":
        return getPhoneValidationError(value);
      case "message":
        if (!value.trim()) return "נא להזין הודעה";
        if (value.trim().length < 10)
          return "ההודעה חייבת להכיל לפחות 10 תווים";
        return "";
      default:
        return "";
    }
  };

  // Form validation function
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Validate each form field
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

  // Handle input change - updates value without real-time validation
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input blur - validates field when user leaves the field
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate the specific field
    const error = validateField(name, formData[name as keyof FormData]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as { [key: string]: boolean });

    setTouched(allTouched);

    // Validate entire form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setServerError(null);

    try {
      // Prepare parameters for email sending to admin
      const templateParams = {
        from_name: formData.name,
        from_email: "ofekat@ac.sce.ac.il", // Your email - where the message should be sent
        to_email: "ofekat@ac.sce.ac.il", // Backup field for your email
        phone: formData.phone,
        message: `פנייה חדשה מהאתר CommUnity:

שם: ${formData.name}
אימייל: ${formData.email}
טלפון: ${formData.phone}

הודעה:
${formData.message}

---
הודעה זו נשלחה מטופס צור קשר באתר CommUnity`,
        user_email: formData.email, // The user's email for reference
        user_name: formData.name, // The user's name for reference
      };

      console.log("Sending contact form to admin:", "ofekat@ac.sce.ac.il");
      console.log("Template params:", templateParams);

      const result = await emailjs.send(
        "service_qbgq6it",
        "template_ozj0x5x", // Using the original template
        templateParams,
        "tyAJr20tpxEI5o8yq"
      );

      console.log("EmailJS result:", result);

      // Show success popup instead of setting submitted directly
      showAlert(
        "success",
        "הטופס נשלח בהצלחה!",
        "תודה על פנייתך. ניצור איתך קשר בהקדם האפשרי."
      );
    } catch (err) {
      console.error("Error sending form:", err);

      // Show error popup instead of setting serverError
      showAlert(
        "error",
        "שגיאה בשליחת הטופס",
        "אירעה שגיאה בשליחת הטופס. אנא נסה שוב מאוחר יותר."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Get appropriate CSS class for input field based on validation state
  const getInputClassName = (fieldName: string) => {
    const hasError =
      errors[fieldName as keyof ValidationErrors] && touched[fieldName];
    return `w-full px-4 py-2.5 border ${
      hasError ? "border-red-300" : "border-gray-200"
    } rounded-lg shadow-sm focus:ring-2 ${
      hasError
        ? "focus:ring-red-400 focus:border-red-400"
        : "focus:ring-indigo-500 focus:border-indigo-500"
    }`;
  };

  // Render loading spinner
  const renderLoadingSpinner = () => (
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
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Render success icon
  const renderSuccessIcon = () => (
    <svg
      className="w-8 h-8 text-green-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );

  // Render success message
  const renderSuccessMessage = () => (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
        {renderSuccessIcon()}
      </div>
      <h3 className="text-lg font-semibold text-green-800 mb-2">
        הטופס נשלח בהצלחה!
      </h3>
      <p className="text-green-700">תודה על פנייתך, ניצור איתך קשר בהקדם.</p>
    </div>
  );

  // Render server error message (keeping for backward compatibility)
  const renderServerError = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-center">
      <p className="text-red-700">{serverError}</p>
    </div>
  );

  // Render form field with validation
  const renderFormField = (
    type: string,
    name: string,
    label: string,
    placeholder: string,
    isTextarea: boolean = false
  ) => (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} <span className="text-red-500">*</span>
      </label>
      {isTextarea ? (
        <textarea
          id={name}
          name={name}
          value={formData[name as keyof FormData]}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={4}
          placeholder={placeholder}
          className={getInputClassName(name)}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={formData[name as keyof FormData]}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={getInputClassName(name)}
        />
      )}
      {/* Fixed space for error messages - maintains consistent height */}
      <div className="min-h-[20px] mt-1">
        {errors[name as keyof ValidationErrors] && touched[name] && (
          <p className="text-sm text-red-600">
            {errors[name as keyof ValidationErrors]}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        {/* Form Header */}
        <h2 className="text-2xl font-bold text-indigo-900 mb-2">צור קשר</h2>
        <p className="text-gray-600 mb-6">
          יש לך שאלה או בקשה? מלא את הטופס ונחזור אליך בהקדם.
        </p>

        {/* Success Message or Form */}
        {submitted ? (
          renderSuccessMessage()
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Server Error Message (keeping for backward compatibility) */}
            {serverError && renderServerError()}

            {/* Name and Phone Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFormField("text", "name", "שם מלא", "הכנס את שמך המלא")}
              {renderFormField("tel", "phone", "טלפון", "הכנס מספר טלפון נייד")}
            </div>

            {/* Email Field */}
            {renderFormField("email", "email", "אימייל", "הכנס כתובת אימייל")}

            {/* Message Field */}
            {renderFormField(
              "text",
              "message",
              "הודעה",
              "כתוב את הודעתך כאן...",
              true
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white rounded-lg font-medium transition-colors shadow-md flex justify-center items-center`}
            >
              {isLoading ? (
                <>
                  {renderLoadingSpinner()}
                  שולח...
                </>
              ) : (
                "שליחה"
              )}
            </button>
          </form>
        )}
      </div>

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

export default ContactForm;
