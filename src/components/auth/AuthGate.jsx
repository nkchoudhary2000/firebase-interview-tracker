import React from 'react';
import { Layers, ShieldCheck, Lock, CheckCircle2, Award, Briefcase, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthGate = () => {
  const { signInWithGoogle, loading, authError } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#07090e] text-slate-100 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-600 flex items-center justify-center text-white shadow-glow">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-100 flex items-center gap-1.5">
              Interview<span className="text-brand-400">Tracker</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800">
          <Lock className="w-3.5 h-3.5 text-brand-400" />
          <span>Private & Encrypted Storage</span>
        </div>
      </header>

      {/* Hero / Sign-In Card */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-300 text-xs font-semibold mb-6">
          <ShieldCheck className="w-4 h-4" />
          <span>Private Career Intelligence Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight max-w-2xl">
          Track Every Stage of Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400">Interview Pipeline</span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          Manage your job applications, HR recruiters, interviewers, customizable rounds, and technical Q&A knowledge banks with multi-level Markdown export.
        </p>

        {/* Auth Error alert */}
        {authError && (
          <div className="mt-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs max-w-md text-left flex items-start gap-2.5 animate-fade-in">
            <Lock className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {/* Sign In Action Card */}
        <div className="mt-8 w-full max-w-md p-6 sm:p-8 rounded-3xl glass-panel border border-slate-700/80 shadow-2xl space-y-5">
          <div className="text-left space-y-1">
            <h3 className="text-base font-bold text-slate-100">Sign in to your account</h3>
            <p className="text-xs text-slate-400">
              Sign in with your Google account to access your private interview records.
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold px-5 py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 text-sm"
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
            <span>{loading ? 'Authenticating with Google...' : 'Continue with Google Account'}</span>
          </button>

          {/* Privacy features list */}
          <div className="pt-4 border-t border-slate-800 text-left space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Strictly private: Only you can view and edit your records.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Real-time Cloud Firestore synchronization.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Hierarchical collapsible tree & Markdown copying.</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-500 relative z-10 border-t border-slate-900">
        <span>InterviewTracker © 2026 — Private Career Intelligence & Interview Management</span>
      </footer>
    </div>
  );
};
