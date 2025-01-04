import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
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
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );
  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem("isAdmin") === "true"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        try {
          const tokenResult = await user.getIdTokenResult();
          const adminFlag = !!tokenResult.claims.isAdmin;

          setIsAdmin(adminFlag);
          setIsLoggedIn(true);

          // שמירת המידע ב־LocalStorage
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("isAdmin", adminFlag.toString());
        } catch (error) {
          console.error("Error fetching token claims:", error);
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      } else {
        // במקרה של התנתקות
        setIsLoggedIn(false);
        setIsAdmin(false);

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

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("isAdmin", isAdmin.toString());
  };

  const logout = async () => {
    await auth.signOut();
    setIsLoggedIn(false);
    setIsAdmin(false);

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isAdmin, loading, login, logout }}
    >
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>Loading...</div>
      ) : (
        children
      )}
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
