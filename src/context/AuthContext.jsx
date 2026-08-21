import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../config/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const isConfigured = isFirebaseConfigured();

  useEffect(() => {
    if (!isConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Enforce Google Sign-In
        const isGoogle = currentUser.providerData.some(
          (p) => p.providerId === GoogleAuthProvider.PROVIDER_ID
        );
        if (isGoogle || currentUser.email?.endsWith('@gmail.com')) {
          setUser(currentUser);
          setAuthError(null);
        } else {
          signOut(auth);
          setUser(null);
          setAuthError('Access restricted: Google Sign-In with a Gmail account is required.');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isConfigured]);

  // Sign in with Google Popup
  const signInWithGoogle = async () => {
    setAuthError(null);
    if (!isConfigured || !auth || !googleProvider) {
      setAuthError('Firebase Authentication is not configured. Check your credentials in .env.');
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      let message = error.message;
      if (error.code === 'auth/popup-closed-by-user') {
        message = 'Sign-in popup was closed before completing authentication.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        message = 'Previous popup request was cancelled.';
      }
      setAuthError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        isConfigured,
        signInWithGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
