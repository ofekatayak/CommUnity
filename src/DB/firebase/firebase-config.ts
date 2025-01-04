import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

// Firebase configuration
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

// Set persistence to browserLocalPersistence
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

export { app, db, auth };
