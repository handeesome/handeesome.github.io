// contexts/AuthContext.jsx
import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth as firebaseAuth } from "../lib/firebase-config";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const signInInProgressRef = useRef(false);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error("Error observing authentication state:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (signInInProgressRef.current) {
      return null;
    }

    signInInProgressRef.current = true;
    setSigningIn(true);

    const provider = new GoogleAuthProvider();
    try {
      // User state will be updated by onAuthStateChanged.
      return await signInWithPopup(firebaseAuth, provider);
    } catch (error) {
      if (
        error.code === "auth/popup-closed-by-user" ||
        error.code === "auth/cancelled-popup-request"
      ) {
        return null;
      }

      console.error("Error signing in:", error);
      throw error; // Let the component show a user-friendly error
    } finally {
      signInInProgressRef.current = false;
      setSigningIn(false);
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
    signingIn,
    isAuthenticated,
    isAdmin,
    signInWithGoogle,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
