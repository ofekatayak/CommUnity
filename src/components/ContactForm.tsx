// ContactForm.tsx - Contact Form Component with One-Time Scroll Animations
import React, { useState, useEffect, useRef } from "react";
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
  // Refs for animation tracking
  const formRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formContentRef = useRef<HTMLFormElement>(null);

  // Animation states - start as false for initial animation
  const [formVisible, setFormVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  // Track which elements have been animated once
  const [hasAnimated, setHasAnimated] = useState({
    form: false,
    header: false,
    content: false,
  });

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

  // Intersection Observer setup with one-time animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "-10px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target;

        if (
          target === formRef.current &&
          entry.isIntersecting &&
          !hasAnimated.form
        ) {
          setFormVisible(true);
          setHasAnimated((prev) => ({ ...prev, form: true }));
        } else if (
          target === headerRef.current &&
          entry.isIntersecting &&
          !hasAnimated.header
        ) {
          setHeaderVisible(true);
          setHasAnimated((prev) => ({ ...prev, header: true }));
        } else if (
          target === formContentRef.current &&
          entry.isIntersecting &&
          !hasAnimated.content
        ) {
          setContentVisible(true);
          setHasAnimated((prev) => ({ ...prev, content: true }));
        }
      });
    }, observerOptions);

    // Small delay to ensure elements are rendered
    const timeoutId = setTimeout(() => {
      if (formRef.current) observer.observe(formRef.current);
      if (headerRef.current) observer.observe(headerRef.current);
      if (formContentRef.current) observer.observe(formContentRef.current);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [hasAnimated]);

  // Reset animations when form becomes visible again (after form was closed)
  useEffect(() => {
    if (isVisible) {
      // Reset animation states when form is shown again
      setHasAnimated({
        form: false,
        header: false,
        content: false,
      });
      setFormVisible(false);
      setHeaderVisible(false);
      setContentVisible(false);
    }
  }, [isVisible]);

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
    } transform transition-all duration-500 ease-out ${
      contentVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
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

  // Render success message with animation
  const renderSuccessMessage = () => (
    <div
      className={`bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-center transform transition-all duration-700 ease-out ${
        contentVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-8 opacity-0 scale-95"
      }`}
    >
      <div
        className={`w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center transform transition-all duration-700 ease-out ${
          contentVisible ? "scale-100 rotate-0" : "scale-0 rotate-180"
        }`}
        style={{ transitionDelay: contentVisible ? "300ms" : "0ms" }}
      >
        {renderSuccessIcon()}
      </div>
      <h3
        className={`text-lg font-semibold text-green-800 mb-2 transform transition-all duration-700 ease-out ${
          contentVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: contentVisible ? "500ms" : "0ms" }}
      >
        הטופס נשלח בהצלחה!
      </h3>
      <p
        className={`text-green-700 transform transition-all duration-700 ease-out ${
          contentVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: contentVisible ? "700ms" : "0ms" }}
      >
        תודה על פנייתך, ניצור איתך קשר בהקדם.
      </p>
    </div>
  );

  // Render server error message with animation
  const renderServerError = () => (
    <div
      className={`bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-center transform transition-all duration-700 ease-out ${
        contentVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <p className="text-red-700">{serverError}</p>
    </div>
  );

  // Render form field with validation and animation
  const renderFormField = (
    type: string,
    name: string,
    label: string,
    placeholder: string,
    isTextarea: boolean = false,
    delay: number = 0
  ) => (
    <div
      className={`transform transition-all duration-700 ease-out ${
        contentVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      style={{ transitionDelay: contentVisible ? `${delay}ms` : "0ms" }}
    >
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
          <p
            className={`text-sm text-red-600 transform transition-all duration-500 ease-out ${
              contentVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-2 opacity-0"
            }`}
          >
            {errors[name as keyof ValidationErrors]}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div
        ref={formRef}
        className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform transition-all duration-1000 ease-out overflow-hidden ${
          formVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-12 opacity-0 scale-95"
        }`}
      >
        {/* Form Header */}
        <div
          ref={headerRef}
          className={`transform transition-all duration-1000 ease-out ${
            headerVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <h2
            className={`text-2xl font-bold text-indigo-900 mb-2 transform transition-all duration-1000 ease-out ${
              headerVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-4 opacity-0"
            }`}
            style={{ transitionDelay: headerVisible ? "200ms" : "0ms" }}
          >
            צור קשר
          </h2>
          <p
            className={`text-gray-600 mb-6 transform transition-all duration-1000 ease-out ${
              headerVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-4 opacity-0"
            }`}
            style={{ transitionDelay: headerVisible ? "400ms" : "0ms" }}
          >
            יש לך שאלה או בקשה? מלא את הטופס ונחזור אליך בהקדם.
          </p>
        </div>

        {/* Success Message or Form */}
        {submitted ? (
          renderSuccessMessage()
        ) : (
          <form
            ref={formContentRef}
            onSubmit={handleSubmit}
            className="space-y-4"
            noValidate
          >
            {/* Server Error Message */}
            {serverError && renderServerError()}

            {/* Name and Phone Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFormField(
                "text",
                "name",
                "שם מלא",
                "הכנס את שמך המלא",
                false,
                200
              )}
              {renderFormField(
                "tel",
                "phone",
                "טלפון",
                "הכנס מספר טלפון נייד",
                false,
                300
              )}
            </div>

            {/* Email Field */}
            {renderFormField(
              "email",
              "email",
              "אימייל",
              "הכנס כתובת אימייל",
              false,
              400
            )}

            {/* Message Field */}
            {renderFormField(
              "text",
              "message",
              "הודעה",
              "כתוב את הודעתך כאן...",
              true,
              500
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white rounded-lg font-medium transition-all duration-700 shadow-md flex justify-center items-center transform ease-out ${
                contentVisible
                  ? "translate-y-0 opacity-100 scale-100"
                  : "translate-y-4 opacity-0 scale-95"
              }`}
              style={{ transitionDelay: contentVisible ? "600ms" : "0ms" }}
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
