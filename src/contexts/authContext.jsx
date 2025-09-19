// contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth as firebaseAuth } from "../lib/firebase-config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      await signInWithPopup(firebaseAuth, provider);
      // User state will be updated by onAuthStateChanged
    } catch (error) {
      console.error("Error signing in:", error);
      setLoading(false);

      if (error.code === "auth/popup-closed-by-user") {
        return; // User closed popup, no error needed
      } else {
        throw error; // Let component handle the error
      }
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut(firebaseAuth);
      // User state will be updated by onAuthStateChanged
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Check if user is admin
  const isAdmin = user?.email === "ducenhandee@gmail.com";

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    signInWithGoogle,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
