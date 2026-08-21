import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../config/firebase';

const AuthContext = createContext(null);

const ACCESS_TOKEN_KEY = 'interview_tracker_gmail_token';
const DEMO_USER_KEY = 'interview_tracker_demo_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(() => {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem(ACCESS_TOKEN_KEY) || null;
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(() => {
    return localStorage.getItem(DEMO_USER_KEY) === 'true';
  });

  const isConfigured = isFirebaseConfigured();

  useEffect(() => {
    if (!isConfigured || !auth) {
      // If Firebase is not configured, check if demo user was active
      if (isDemoMode) {
        setUser({
          uid: 'demo_user_123',
          displayName: 'Alex Candidate (Demo Mode)',
          email: 'alex.candidate@gmail.com',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        });
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Enforce Google Sign-In only (providerData check)
        const isGoogle = currentUser.providerData.some(
          (p) => p.providerId === GoogleAuthProvider.PROVIDER_ID
        );
        if (isGoogle || currentUser.email?.endsWith('@gmail.com')) {
          setUser(currentUser);
          setIsDemoMode(false);
        } else {
          // If not Google, sign out and throw notice
          signOut(auth);
          setUser(null);
          setAuthError('Access restricted: Google Sign-In with Gmail is required.');
        }
      } else {
        if (!isDemoMode) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isConfigured, isDemoMode]);

  // Sign in with Google Popup and obtain Gmail Readonly Access Token
  const signInWithGoogle = async () => {
    setAuthError(null);
    if (!isConfigured || !auth || !googleProvider) {
      enableDemoMode();
      return { success: true, isDemo: true };
    }

    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      if (token) {
        setAccessToken(token);
        sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
      }

      setUser(result.user);
      setIsDemoMode(false);
      localStorage.removeItem(DEMO_USER_KEY);
      return { success: true, user: result.user, token };
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

  const enableDemoMode = () => {
    const demoUser = {
      uid: 'demo_user_123',
      displayName: 'Alex Candidate (Demo Mode)',
      email: 'alex.candidate@gmail.com',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
    setUser(demoUser);
    setIsDemoMode(true);
    localStorage.setItem(DEMO_USER_KEY, 'true');
    setAuthError(null);
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
      setAccessToken(null);
      setIsDemoMode(false);
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(DEMO_USER_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        setAccessToken,
        loading,
        authError,
        isConfigured,
        isDemoMode,
        signInWithGoogle,
        enableDemoMode,
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
