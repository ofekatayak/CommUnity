// ContactForm.tsx - קומפוננטה מתוקנת בגישה פשוטה
import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import {
  getEmailValidationError,
  getPhoneValidationError,
  getNameValidationError,
} from "../utilities/ValidationUtils";

interface ContactFormProps {
  onSubmit?: () => void;
  isVisible: boolean;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, isVisible }) => {
  const [formData, setFormData] = useState({
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

  // איפוס הטופס כשהוא מוצג מחדש
  useEffect(() => {
    if (isVisible && submitted) {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      // איפוס השגיאות והמצבים הנגיעה כשהטופס מופיע מחדש
      setErrors({});
      setTouched({});
    }
  }, [isVisible, submitted]);

  // ולידציה של שדה
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

  // טיפול בשינוי - רק עדכון ערך, בלי ולידציה
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // הסרנו את הולידציה בזמן אמת
  };

  // טיפול באירוע של יציאה מהשדה
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;

    // סימון שנגעו בשדה
    setTouched((prev) => ({ ...prev, [name]: true }));

    // ולידציה של השדה
    const error = validateField(name, formData[name as keyof typeof formData]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    setServerError(null);

    try {
      // הכנת הפרמטרים לשליחה
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        message: formData.message,
      };

      const result = await emailjs.send(
        "service_qbgq6it",
        "template_ozj0x5x",
        templateParams,
        "tyAJr20tpxEI5o8yq"
      );

      console.log("EmailJS result:", result);

      setSubmitted(true);

      // קריאה לפונקציית ההגשה אם הועברה
      if (onSubmit) {
        setTimeout(() => {
          onSubmit();
        }, 2000); // המתנה של 2 שניות לפני סגירת הטופס
      }
    } catch (err) {
      console.error("שגיאה בשליחת הטופס:", err);
      setServerError("אירעה שגיאה בשליחת הטופס. אנא נסה שוב מאוחר יותר.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-indigo-900 mb-2">צור קשר</h2>
      <p className="text-gray-600 mb-6">
        יש לך שאלה או בקשה? מלא את הטופס ונחזור אליך בהקדם.
      </p>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
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
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            הטופס נשלח בהצלחה!
          </h3>
          <p className="text-green-700">
            תודה על פנייתך, ניצור איתך קשר בהקדם.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-center">
              <p className="text-red-700">{serverError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                שם מלא <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="הכנס את שמך המלא"
                className={`w-full px-4 py-2.5 border ${
                  errors.name && touched.name
                    ? "border-red-300"
                    : "border-gray-200"
                } rounded-lg shadow-sm focus:ring-2 ${
                  errors.name && touched.name
                    ? "focus:ring-red-400 focus:border-red-400"
                    : "focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              />
              {/* מרווח קבוע להודעות שגיאה */}
              <div className="min-h-[20px] mt-1">
                {errors.name && touched.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                טלפון <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="הכנס מספר טלפון נייד"
                className={`w-full px-4 py-2.5 border ${
                  errors.phone && touched.phone
                    ? "border-red-300"
                    : "border-gray-200"
                } rounded-lg shadow-sm focus:ring-2 ${
                  errors.phone && touched.phone
                    ? "focus:ring-red-400 focus:border-red-400"
                    : "focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              />
              {/* מרווח קבוע להודעות שגיאה */}
              <div className="min-h-[20px] mt-1">
                {errors.phone && touched.phone && (
                  <p className="text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              אימייל <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="הכנס כתובת אימייל"
              className={`w-full px-4 py-2.5 border ${
                errors.email && touched.email
                  ? "border-red-300"
                  : "border-gray-200"
              } rounded-lg shadow-sm focus:ring-2 ${
                errors.email && touched.email
                  ? "focus:ring-red-400 focus:border-red-400"
                  : "focus:ring-indigo-500 focus:border-indigo-500"
              }`}
            />
            {/* מרווח קבוע להודעות שגיאה */}
            <div className="min-h-[20px] mt-1">
              {errors.email && touched.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              הודעה <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={4}
              placeholder="כתוב את הודעתך כאן..."
              className={`w-full px-4 py-2.5 border ${
                errors.message && touched.message
                  ? "border-red-300"
                  : "border-gray-200"
              } rounded-lg shadow-sm focus:ring-2 ${
                errors.message && touched.message
                  ? "focus:ring-red-400 focus:border-red-400"
                  : "focus:ring-indigo-500 focus:border-indigo-500"
              }`}
            ></textarea>
            {/* מרווח קבוע להודעות שגיאה */}
            <div className="min-h-[20px] mt-1">
              {errors.message && touched.message && (
                <p className="text-sm text-red-600">{errors.message}</p>
              )}
            </div>
          </div>

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
                שולח...
              </>
            ) : (
              "שליחה"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
