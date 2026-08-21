import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User, Mail, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const UserProfileMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/60 transition-all"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User Avatar'}
            className="w-8 h-8 rounded-lg object-cover ring-1 ring-brand-500/40"
          />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
        )}
        <div className="text-left hidden sm:block">
          <div className="text-xs font-medium text-slate-200 line-clamp-1 max-w-[130px]">
            {user.displayName || 'User'}
          </div>
          <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Authenticated
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel p-3 shadow-2xl border border-slate-700 z-50 animate-fade-in">
          <div className="p-2 border-b border-slate-800 mb-2">
            <div className="text-sm font-semibold text-slate-100">{user.displayName}</div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
          </div>

          <div className="px-2 py-2 mb-2 bg-slate-950/50 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Private cloud sync active for your account</span>
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
