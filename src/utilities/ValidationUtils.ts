// ValidationUtils.ts - Enhanced validation utilities
// Utility file for common form field validation

/**
 * Email address validation
 * @param email Email address to validate
 * @returns Whether the email address is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Israeli phone number validation
 * @param phone Phone number to validate (starts with 05 and contains 10 digits)
 * @returns Whether the phone number is valid
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^05\d{8}$/;
  return phoneRegex.test(phone);
};

/**
 * Simple ID validation - exactly 9 digits only
 * @param id ID number to validate (9 digits)
 * @returns Whether the ID number is valid
 */
export const isValidSimpleID = (id: string): boolean => {
  // Ensure input contains exactly 9 digits
  return /^\d{9}$/.test(id);
};

/**
 * Israeli ID validation with check digit
 * Including check digit validation
 * @param id ID number to validate (9 digits)
 * @returns Whether the ID number is valid
 */
export const isValidIsraeliID = (id: string): boolean => {
  // Ensure input contains exactly 9 digits
  if (!/^\d{9}$/.test(id)) {
    return false;
  }

  // Convert string to array of digits
  const idArray = id.split("").map(Number);

  // Calculate check digit
  let sum = 0;

  for (let i = 0; i < 8; i++) {
    let digit = idArray[i];
    // Multiply every second digit by 2
    if (i % 2 === 0) {
      digit *= 1;
    } else {
      digit *= 2;
    }
    // If result is two digits, subtract 9
    if (digit > 9) {
      digit -= 9;
    }
    // Sum all digits
    sum += digit;
  }

  // Calculate digit that completes to nearest ten
  const checkDigit = (10 - (sum % 10)) % 10;

  // Check if check digit matches the last digit
  return checkDigit === idArray[8];
};

// Quick validation functions - return error message or empty string
// These functions don't perform heavy calculations on every call

/**
 * Get ID validation error message
 * @param id ID number
 * @returns Error message or empty string if valid
 */
export const getIDValidationError = (id: string): string => {
  if (!id || !id.trim()) {
    return "נא להזין מספר תעודת זהות";
  }

  if (!/^\d+$/.test(id)) {
    return "תעודת זהות חייבת להכיל ספרות בלבד";
  }

  if (id.length !== 9) {
    return "תעודת זהות חייבת להכיל 9 ספרות בדיוק";
  }

  // Simple validation - just check 9 digits, no check digit validation
  if (!isValidSimpleID(id)) {
    return "תעודת זהות חייבת להכיל בדיוק 9 ספרות";
  }

  return "";
};

/**
 * Get phone number validation error message
 * @param phone Phone number
 * @returns Error message or empty string if valid
 */
export const getPhoneValidationError = (phone: string): string => {
  if (!phone || !phone.trim()) {
    return "נא להזין מספר טלפון";
  }

  if (!/^\d+$/.test(phone)) {
    return "מספר טלפון חייב להכיל ספרות בלבד";
  }

  if (!phone.startsWith("05")) {
    return "מספר טלפון חייב להתחיל ב-05";
  }

  if (phone.length !== 10) {
    return "מספר טלפון חייב להכיל 10 ספרות בדיוק";
  }

  return "";
};

/**
 * Get email validation error message
 * @param email Email address
 * @returns Error message or empty string if valid
 */
export const getEmailValidationError = (email: string): string => {
  if (!email || !email.trim()) {
    return "נא להזין כתובת אימייל";
  }

  if (!isValidEmail(email)) {
    return "נא להזין כתובת אימייל תקינה";
  }

  return "";
};

/**
 * Get name field validation error message
 * @param name Name to validate
 * @returns Error message or empty string if valid
 */
export const getNameValidationError = (name: string): string => {
  if (!name || !name.trim()) {
    return "נא להזין שם";
  }

  if (name.trim().length < 2) {
    return "השם חייב להכיל לפחות 2 תווים";
  }

  return "";
};

/**
 * Get password validation error message
 * @param password Password to validate
 * @returns Error message or empty string if valid
 */
export const getPasswordValidationError = (password: string): string => {
  if (!password) {
    return "נא להזין סיסמה";
  }

  if (password.length < 6) {
    return "הסיסמה חייבת להכיל לפחות 6 תווים";
  }

  return "";
};

/**
 * Check if two passwords match
 * @param password Main password
 * @param confirmPassword Password confirmation
 * @returns Error message or empty string if valid
 */
export const getPasswordMatchError = (
  password: string,
  confirmPassword: string
): string => {
  if (!confirmPassword) {
    return "נא לאשר את הסיסמה";
  }

  if (password !== confirmPassword) {
    return "הסיסמאות אינן תואמות";
  }

  return "";
};
