import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../DB/firebase/firebase-config";

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (isAdmin: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const storedValue = localStorage.getItem("isLoggedIn");
    return storedValue === "true"; // ברירת מחדל אם לא נמצא
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const storedValue = localStorage.getItem("isAdmin");
    return storedValue === "true";
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // קבלת מידע על האם המשתמש אדמין
          const tokenResult = await user.getIdTokenResult();
          const adminFlag = !!tokenResult.claims.isAdmin;

          setIsAdmin(adminFlag);
          setIsLoggedIn(true);

          // עדכון Local Storage
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("isAdmin", adminFlag.toString());
        } catch (error) {
          console.error("Error fetching token claims:", error);
        }
      } else {
        // התנתקות
        setIsLoggedIn(false);
        setIsAdmin(false);

        // ניקוי Local Storage
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("isAdmin");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (isAdmin: boolean) => {
    setIsLoggedIn(true);
    setIsAdmin(isAdmin);

    // שמירת מידע ב-Local Storage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("isAdmin", isAdmin.toString());
  };

  const logout = () => {
    auth.signOut();
    setIsLoggedIn(false);
    setIsAdmin(false);

    // ניקוי Local Storage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isAdmin, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
