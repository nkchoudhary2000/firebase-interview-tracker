import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InterviewProvider, useInterviews } from './context/InterviewContext';
import { Navbar } from './components/common/Navbar';
import { Toast } from './components/common/Toast';
import { EnvWarningBanner } from './components/common/EnvWarningBanner';
import { ConfirmModal } from './components/common/ConfirmModal';
import { StatsOverview } from './components/dashboard/StatsOverview';
import { QuickFilters } from './components/dashboard/QuickFilters';
import { TreeView } from './components/interviews/tree/TreeView';
import { InterviewList } from './components/interviews/InterviewList';
import { KnowledgeBankView } from './components/interviews/KnowledgeBankView';
import { GmailIntegration } from './components/gmail/GmailIntegration';
import { InterviewFormModal } from './components/interviews/InterviewFormModal';
import { LoginModal } from './components/auth/LoginModal';

const AppContent = () => {
  const { 
    activeTab, 
    addInterview, 
    updateInterview, 
    deleteInterview 
  } = useInterviews();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [deletingInterviewId, setDeletingInterviewId] = useState(null);

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
      <Navbar
        onOpenAddModal={() => handleOpenAddModal(null)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Environment / Demo Alert Banner */}
        <EnvWarningBanner />

        {/* Global Stats Overview */}
        <StatsOverview />

        {/* Search & Status Filters (for Tree and Cards tabs) */}
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

        {activeTab === 'gmail' && (
          <GmailIntegration
            onOpenAddModalWithData={(data) => handleOpenAddModal(data)}
          />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeBankView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>InterviewTracker © 2026 — Built with React, Vite, Tailwind CSS & Firebase</span>
          <span className="text-slate-400">Google Sign-In & Gmail Readonly API Integration</span>
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

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <ConfirmModal
        isOpen={Boolean(deletingInterviewId)}
        title="Delete Interview Dossier"
        message="Are you sure you want to delete this company interview dossier, all rounds, and logged Q&As? This action cannot be undone."
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
