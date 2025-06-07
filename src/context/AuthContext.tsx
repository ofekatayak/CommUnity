// AuthContext.tsx - Authentication Context Provider
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../DB/firebase/firebase-config";

// Interface for authentication context type
interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (isAdmin: boolean) => void;
  logout: () => void;
}

// Interface for user data from Firestore
interface UserData {
  status: string;
  isAdmin: boolean;
  email: string;
}

// Create authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State management for authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check user data in Firestore and validate status
  const validateUserData = async (firebaseUser: User): Promise<boolean> => {
    try {
      const q = query(
        collection(db, "users"),
        where("email", "==", firebaseUser.email)
      );
      const snapshot = await getDocs(q);

      // Check if user exists in Firestore
      if (snapshot.empty) {
        console.warn("User exists in Firebase Auth but not in Firestore.");
        await auth.signOut();
        return false;
      }

      const userData = snapshot.docs[0].data() as UserData;

      // Check if user is approved
      if (userData.status !== "approved") {
        console.log("User is not approved. Signing out.");
        await auth.signOut();
        return false;
      }

      // Set user authentication state
      setIsLoggedIn(true);
      setIsAdmin(userData.isAdmin);
      return true;
    } catch (error) {
      console.error("Error validating user data:", error);
      return false;
    }
  };

  // Handle authentication state changes
  const handleAuthStateChange = useCallback(
    async (firebaseUser: User | null) => {
      if (firebaseUser) {
        // User is signed in, validate their data
        const isValid = await validateUserData(firebaseUser);
        if (!isValid) {
          // Reset state if validation failed
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      } else {
        // User is signed out
        setIsLoggedIn(false);
        setIsAdmin(false);
      }

      setLoading(false);
    },
    []
  );

  // Set up Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);

    // Cleanup function to unsubscribe from auth state changes
    return () => unsubscribe();
  }, [handleAuthStateChange]);

  // Handle user login (called after successful authentication)
  const login = (isAdmin: boolean) => {
    setIsLoggedIn(true);
    setIsAdmin(isAdmin);
  };

  // Handle user logout
  const logout = async () => {
    try {
      await auth.signOut();
      setIsLoggedIn(false);
      setIsAdmin(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Render loading spinner component
  const renderLoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4" />
        <p className="text-indigo-800 font-medium">טוען...</p>
      </div>
    </div>
  );

  // Context value object
  const contextValue: AuthContextType = {
    isLoggedIn,
    isAdmin,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? renderLoadingSpinner() : children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
