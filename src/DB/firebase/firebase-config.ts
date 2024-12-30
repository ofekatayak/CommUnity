import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration (שנה את הפרטים בהתאם לפרויקט שלך ב-Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCt63M9LLqQRfP7CY0VCdIUaFQssEZNaYY",
  authDomain: "community-117aa.firebaseapp.com",
  projectId: "community-117aa",
  storageBucket: "community-117aa.firebasestorage.app",
  messagingSenderId: "1:203896378472:web:126debc85f4755e73297dd",
  appId: "1:203896378472:web:126debc85f4755e73297dd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore instance
const db = getFirestore(app);

// Auth instance
const auth = getAuth(app);

export { app, db, auth };
