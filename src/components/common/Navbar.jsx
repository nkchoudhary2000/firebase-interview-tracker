import React from 'react';
import { 
  Building2, 
  Layers, 
  LayoutGrid, 
  MessageSquare, 
  Plus, 
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useInterviews } from '../../context/InterviewContext';
import { UserProfileMenu } from '../auth/UserProfileMenu';

export const Navbar = ({ onOpenAddModal }) => {
  const { user, logout } = useAuth();
  const { activeTab, setActiveTab, stats } = useInterviews();

  const navTabs = [
    { id: 'tree', label: 'Tree Hierarchy', icon: <Layers className="w-4 h-4" /> },
    { id: 'cards', label: 'Company Cards', icon: <LayoutGrid className="w-4 h-4" />, count: stats.total },
    { id: 'knowledge', label: 'Q&A Bank', icon: <MessageSquare className="w-4 h-4" />, count: stats.totalQAs }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-600 flex items-center justify-center text-white shadow-glow">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-100 tracking-tight flex items-center gap-1.5">
                Interview<span className="text-brand-400">Tracker</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-glow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onOpenAddModal}
              className="glass-button-primary text-xs py-2 px-3 sm:px-3.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Interview</span>
            </button>

            {user && <UserProfileMenu />}
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-around gap-1 py-2 border-t border-slate-900 text-xs">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 ${
                  isActive ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.icon}
                <span className="text-[11px]">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
