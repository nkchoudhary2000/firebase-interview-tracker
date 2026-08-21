import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'your-firebase-api-key' &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== 'your-project-id'
  );
};

let app = null;
let auth = null;
let db = null;
let googleProvider = null;
let analytics = null;

try {
  if (isFirebaseConfigured()) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);

    // Google Sign-In Provider (Authentication only)
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    // Initialize Analytics if supported
    if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
      isSupported().then((supported) => {
        if (supported) {
          analytics = getAnalytics(app);
        }
      }).catch(() => {});
    }
  }
} catch (error) {
  console.warn('Firebase initialization notice:', error.message);
}

export { app, auth, db, googleProvider, analytics, firebaseConfig };
