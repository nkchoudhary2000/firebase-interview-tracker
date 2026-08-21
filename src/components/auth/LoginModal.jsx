import React, { useState } from 'react';
import { Mail, ShieldCheck, Sparkles, X, Check, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginModal = ({ isOpen, onClose }) => {
  const { signInWithGoogle, enableDemoMode, authError } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    const result = await signInWithGoogle();
    setIsSigningIn(false);
    if (result.success) {
      onClose();
    }
  };

  const handleDemoClick = () => {
    enableDemoMode();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl relative overflow-hidden">
        {/* Background ambient light */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-glow mb-4">
            <Mail className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            Sign In with Google
          </h2>
          <p className="mt-1.5 text-sm text-slate-400 max-w-sm mx-auto">
            Strictly limited to Google Accounts (Gmail) to authenticate and connect your interview emails seamlessly.
          </p>
        </div>

        {authError && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Permissions & Scopes explanation */}
        <div className="mb-6 rounded-xl bg-slate-950/60 border border-slate-800/80 p-4 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-300 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>OAuth Permissions Requested</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Gmail Read-Only</strong> (<code className="text-brand-300 font-mono text-[10px]">gmail.readonly</code>) to fetch labels and interview threads.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Cloud Firestore Sync</strong> to backup your interview trees securely per Google user ID.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                No modify/send permissions requested. Your inbox remains completely safe.
              </span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold px-4 py-3 rounded-xl shadow-lg transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {/* Google SVG Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isSigningIn ? 'Signing in with Google...' : 'Continue with Google Account'}</span>
          </button>

          <button
            onClick={handleDemoClick}
            className="w-full flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 font-medium px-4 py-2.5 rounded-xl border border-slate-700 text-xs transition-all"
          >
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>Continue in Interactive Demo Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
};
