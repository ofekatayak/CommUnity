import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../DB/firebase/firebase-config";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: User | null) => {
        if (firebaseUser) {
          try {
            const q = query(
              collection(db, "users"),
              where("email", "==", firebaseUser.email)
            );
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
              console.warn(
                "User exists in Firebase Auth but not in Firestore."
              );
              await auth.signOut();
              setIsLoggedIn(false);
              setIsAdmin(false);
              setLoading(false);
              return;
            }

            const userData = snapshot.docs[0].data();

            if (userData.status !== "approved") {
              console.log("User is not approved. Signing out.");
              await auth.signOut();
              setIsLoggedIn(false);
              setIsAdmin(false);
            } else {
              setIsLoggedIn(true);
              setIsAdmin(userData.isAdmin);
            }
          } catch (error) {
            console.error("Error in auth state listener:", error);
            setIsLoggedIn(false);
            setIsAdmin(false);
          }
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const login = (isAdmin: boolean) => {
    setIsLoggedIn(true);
    setIsAdmin(isAdmin);
  };

  const logout = async () => {
    await auth.signOut();
    setIsLoggedIn(false);
    setIsAdmin(false);
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
