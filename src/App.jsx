import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InterviewProvider, useInterviews } from './context/InterviewContext';
import { Navbar } from './components/common/Navbar';
import { Toast } from './components/common/Toast';
import { ConfirmModal } from './components/common/ConfirmModal';
import { StatsOverview } from './components/dashboard/StatsOverview';
import { QuickFilters } from './components/dashboard/QuickFilters';
import { TreeView } from './components/interviews/tree/TreeView';
import { InterviewList } from './components/interviews/InterviewList';
import { KnowledgeBankView } from './components/interviews/KnowledgeBankView';
import { InterviewFormModal } from './components/interviews/InterviewFormModal';
import { AuthGate } from './components/auth/AuthGate';
import { Loader2 } from 'lucide-react';

const AppContent = () => {
  const { user, loading } = useAuth();
  const { 
    activeTab, 
    addInterview, 
    updateInterview, 
    deleteInterview 
  } = useInterviews();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [deletingInterviewId, setDeletingInterviewId] = useState(null);

  // Show loading spinner while determining auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07090e] text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          <span className="text-xs text-slate-400 font-medium">Securing session...</span>
        </div>
      </div>
    );
  }

  // Auth Barrier: If not signed in, show Google Sign-In Auth Wall
  if (!user) {
    return <AuthGate />;
  }

  const handleOpenAddModal = (initialData = null) => {
    setEditingInterview(initialData);
    setIsAddModalOpen(true);
  };

  const handleEditInterview = (interview) => {
    setEditingInterview(interview);
    setIsAddModalOpen(true);
  };

  const handleSaveInterview = async (formData) => {
    if (editingInterview?.id) {
      await updateInterview(editingInterview.id, formData);
    } else {
      await addInterview(formData);
    }
  };

  const handleDeleteInterviewPrompt = (id) => {
    setDeletingInterviewId(id);
  };

  const handleConfirmDelete = async () => {
    if (deletingInterviewId) {
      await deleteInterview(deletingInterviewId);
      setDeletingInterviewId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <Navbar onOpenAddModal={() => handleOpenAddModal(null)} />

      {/* Main Private Dashboard Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Global Stats Overview */}
        <StatsOverview />

        {/* Search & Status Filters */}
        {(activeTab === 'tree' || activeTab === 'cards') && (
          <QuickFilters onOpenAddModal={() => handleOpenAddModal(null)} />
        )}

        {/* View Switcher */}
        {activeTab === 'tree' && (
          <TreeView
            onOpenAddModal={() => handleOpenAddModal(null)}
            onEditInterview={handleEditInterview}
            onDeleteInterview={handleDeleteInterviewPrompt}
          />
        )}

        {activeTab === 'cards' && (
          <InterviewList
            onOpenAddModal={() => handleOpenAddModal(null)}
            onEditInterview={handleEditInterview}
            onDeleteInterview={handleDeleteInterviewPrompt}
          />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeBankView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>InterviewTracker © 2026 — Authenticated Session ({user.email})</span>
          <span className="text-slate-400">Cloud Firestore Encrypted Sync</span>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <InterviewFormModal
        isOpen={isAddModalOpen}
        initialData={editingInterview}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingInterview(null);
        }}
        onSave={handleSaveInterview}
      />

      <ConfirmModal
        isOpen={Boolean(deletingInterviewId)}
        title="Delete Interview Dossier"
        message="Are you sure you want to delete this interview dossier, rounds, and logged questions? This action cannot be undone."
        confirmText="Delete Dossier"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingInterviewId(null)}
      />

      {/* Global Toast System */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <AppContent />
      </InterviewProvider>
    </AuthProvider>
  );
}
