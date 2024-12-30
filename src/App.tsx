import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import AdminPanel from "./components/AdminPanel";
import { AuthProvider, useAuth } from "./context/AuthContext";

const AppContent: React.FC = () => {
  const { isLoggedIn, isAdmin } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Home />} />
        <Route
          path="/admin"
          element={
            isLoggedIn ? (
              isAdmin ? (
                <AdminPanel />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
