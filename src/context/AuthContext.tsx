import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../DB/firebase/firebase-config";

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (isAdmin: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Assume admin flag is stored in custom claims
        user.getIdTokenResult().then((tokenResult) => {
          setIsAdmin(!!tokenResult.claims.isAdmin);
          setIsLoggedIn(true);
        });
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = (isAdmin: boolean) => {
    console.log("Logging in, isAdmin:", isAdmin);
    setIsLoggedIn(true);
    setIsAdmin(isAdmin);
  };
  
  
  const logout = () => {
    auth.signOut();
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
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
