// ValidationUtils.ts - גרסה משופרת
// קובץ עזרים לולידציה של שדות נפוצים בטפסים

/**
 * בדיקת תקינות של כתובת אימייל
 * @param email כתובת האימייל לבדיקה
 * @returns האם כתובת האימייל תקינה
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * בדיקת תקינות של מספר טלפון ישראלי
 * @param phone מספר הטלפון לבדיקה (מתחיל ב-05 ומכיל 10 ספרות)
 * @returns האם מספר הטלפון תקין
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^05\d{8}$/;
  return phoneRegex.test(phone);
};

/**
 * בדיקת תקינות של מספר תעודת זהות ישראלית
 * כולל בדיקת ספרת ביקורת
 * @param id מספר תעודת הזהות לבדיקה (9 ספרות)
 * @returns האם מספר תעודת הזהות תקין
 */
export const isValidIsraeliID = (id: string): boolean => {
  // וודא שהקלט מכיל 9 ספרות בדיוק
  if (!/^\d{9}$/.test(id)) {
    return false;
  }

  // המרת המחרוזת למערך של ספרות
  const idArray = id.split("").map(Number);

  // חישוב ספרת ביקורת
  let sum = 0;

  for (let i = 0; i < 8; i++) {
    let digit = idArray[i];
    // הכפלת כל ספרה שנייה ב-2
    if (i % 2 === 0) {
      digit *= 1;
    } else {
      digit *= 2;
    }
    // אם התוצאה היא דו-ספרתית, מחסירים 9
    if (digit > 9) {
      digit -= 9;
    }
    // סכימת כל הספרות
    sum += digit;
  }

  // חישוב הספרה שתשלים לעשרת הקרובה
  const checkDigit = (10 - (sum % 10)) % 10;

  // בדיקה האם ספרת הביקורת תואמת את הספרה האחרונה
  return checkDigit === idArray[8];
};

// פונקציות ולידציה מהירות - החזרת הודעת שגיאה או מחרוזת ריקה
// פונקציות אלו לא מבצעות חישובים כבדים בכל קריאה להן

/**
 * קבלת הודעת שגיאה לתעודת זהות
 * @param id מספר תעודת הזהות
 * @returns הודעת שגיאה או מחרוזת ריקה אם תקין
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

  if (!isValidIsraeliID(id)) {
    return "מספר תעודת הזהות אינו תקין";
  }

  return "";
};

/**
 * קבלת הודעת שגיאה למספר טלפון
 * @param phone מספר הטלפון
 * @returns הודעת שגיאה או מחרוזת ריקה אם תקין
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
 * קבלת הודעת שגיאה לאימייל
 * @param email כתובת האימייל
 * @returns הודעת שגיאה או מחרוזת ריקה אם תקין
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
 * קבלת הודעת שגיאה לשדה של שם
 * @param name השם לבדיקה
 * @returns הודעת שגיאה או מחרוזת ריקה אם תקין
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
 * קבלת הודעת שגיאה לשדה של סיסמה
 * @param password הסיסמה לבדיקה
 * @returns הודעת שגיאה או מחרוזת ריקה אם תקין
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
 * בדיקה האם שתי סיסמאות תואמות
 * @param password הסיסמה הראשית
 * @param confirmPassword אישור הסיסמה
 * @returns הודעת שגיאה או מחרוזת ריקה אם תקין
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
