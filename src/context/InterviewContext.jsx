import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { useAuth } from './AuthContext';
import { SAMPLE_INTERVIEWS } from '../data/sampleInterviews';
import { APPLICATION_STATUS } from '../types/interview';

const InterviewContext = createContext(null);
const LOCAL_STORAGE_INTERVIEWS_KEY = 'interview_tracker_data_v1';

export const InterviewProvider = ({ children }) => {
  const { user, isDemoMode } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [activeTab, setActiveTab] = useState('tree'); // 'tree' | 'cards' | 'gmail' | 'stats' | 'knowledge'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('updated'); // 'updated' | 'company' | 'appliedDate'
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success', duration = 3000) => {
    setToastMessage({ message, type, id: Date.now() });
  };

  const closeToast = () => {
    setToastMessage(null);
  };

  // Sync with Firestore or LocalStorage
  useEffect(() => {
    const isConfigured = isFirebaseConfigured();

    if (user && isConfigured && db && !isDemoMode) {
      setLoading(true);
      const q = query(
        collection(db, 'interviews'),
        where('userId', '==', user.uid)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          
          setInterviews(list);
          if (list.length > 0 && !selectedInterviewId) {
            setSelectedInterviewId(list[0].id);
          }
          setLoading(false);
        },
        (error) => {
          console.warn('Firestore subscription error:', error);
          loadLocalFallback();
        }
      );

      return () => unsubscribe();
    } else {
      loadLocalFallback();
    }
  }, [user, isDemoMode]);

  const loadLocalFallback = () => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_INTERVIEWS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setInterviews(parsed);
        if (parsed.length > 0 && !selectedInterviewId) {
          setSelectedInterviewId(parsed[0].id);
        }
      } else {
        // Start clean in production
        setInterviews([]);
        setSelectedInterviewId(null);
      }
    } catch (e) {
      setInterviews([]);
      setSelectedInterviewId(null);
    } finally {
      setLoading(false);
    }
  };

  // Helper to persist local changes when offline/demo
  const saveLocalInterviews = (updatedList) => {
    setInterviews(updatedList);
    localStorage.setItem(LOCAL_STORAGE_INTERVIEWS_KEY, JSON.stringify(updatedList));
  };

  // Add new interview entry
  const addInterview = async (interviewData) => {
    const isConfigured = isFirebaseConfigured();
    const newRecord = {
      ...interviewData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (user && isConfigured && db && !isDemoMode) {
      try {
        const docRef = await addDoc(collection(db, 'interviews'), {
          ...newRecord,
          userId: user.uid,
          updatedAt: serverTimestamp()
        });
        setSelectedInterviewId(docRef.id);
        showToast(`Added interview for ${interviewData.companyName || 'Company'}!`);
        return docRef.id;
      } catch (err) {
        console.error('Failed to add interview to Firestore:', err);
        showToast('Error saving to Cloud Firestore. Saved locally.', 'warning');
      }
    }

    // Local save
    const localId = 'int_' + Date.now();
    const withId = { ...newRecord, id: localId, userId: user?.uid || 'local' };
    const updated = [withId, ...interviews];
    saveLocalInterviews(updated);
    setSelectedInterviewId(localId);
    showToast(`Added interview for ${interviewData.companyName || 'Company'}!`);
    return localId;
  };

  // Update existing interview
  const updateInterview = async (id, updatedFields) => {
    const isConfigured = isFirebaseConfigured();
    const timestamp = new Date().toISOString();

    if (user && isConfigured && db && !isDemoMode && !id.startsWith('int_') && !id.startsWith('sample_')) {
      try {
        const docRef = doc(db, 'interviews', id);
        await updateDoc(docRef, {
          ...updatedFields,
          updatedAt: serverTimestamp()
        });
        showToast('Interview profile updated successfully!');
        return;
      } catch (err) {
        console.error('Firestore update error:', err);
      }
    }

    const updated = interviews.map((item) =>
      item.id === id ? { ...item, ...updatedFields, updatedAt: timestamp } : item
    );
    saveLocalInterviews(updated);
    showToast('Interview profile updated!');
  };

  // Delete interview
  const deleteInterview = async (id) => {
    const isConfigured = isFirebaseConfigured();
    const target = interviews.find((i) => i.id === id);

    if (user && isConfigured && db && !isDemoMode && !id.startsWith('int_') && !id.startsWith('sample_')) {
      try {
        await deleteDoc(doc(db, 'interviews', id));
        showToast(`Deleted ${target?.companyName || 'Interview'} dossier.`, 'info');
        return;
      } catch (err) {
        console.error('Firestore delete error:', err);
      }
    }

    const updated = interviews.filter((item) => item.id !== id);
    saveLocalInterviews(updated);
    if (selectedInterviewId === id) {
      setSelectedInterviewId(updated[0]?.id || null);
    }
    showToast(`Deleted ${target?.companyName || 'Interview'} dossier.`, 'info');
  };

  // Rounds manipulation helpers
  const addRound = async (interviewId, roundData) => {
    const target = interviews.find((i) => i.id === interviewId);
    if (!target) return;
    const rounds = [...(target.rounds || []), roundData];
    await updateInterview(interviewId, { rounds });
    showToast(`Added ${roundData.roundName || 'Round'}!`);
  };

  const updateRound = async (interviewId, roundId, roundData) => {
    const target = interviews.find((i) => i.id === interviewId);
    if (!target) return;
    const rounds = (target.rounds || []).map((r) =>
      r.id === roundId ? { ...r, ...roundData } : r
    );
    await updateInterview(interviewId, { rounds });
    showToast('Round details updated!');
  };

  const deleteRound = async (interviewId, roundId) => {
    const target = interviews.find((i) => i.id === interviewId);
    if (!target) return;
    const rounds = (target.rounds || []).filter((r) => r.id !== roundId);
    await updateInterview(interviewId, { rounds });
    showToast('Round removed.', 'info');
  };

  // Q&A manipulation helpers
  const addQA = async (interviewId, roundId, qaData) => {
    const target = interviews.find((i) => i.id === interviewId);
    if (!target) return;
    const rounds = (target.rounds || []).map((r) => {
      if (r.id === roundId) {
        return {
          ...r,
          questionsAnswers: [...(r.questionsAnswers || []), qaData]
        };
      }
      return r;
    });
    await updateInterview(interviewId, { rounds });
    showToast('Question & Answer added!');
  };

  const updateQA = async (interviewId, roundId, qaId, qaData) => {
    const target = interviews.find((i) => i.id === interviewId);
    if (!target) return;
    const rounds = (target.rounds || []).map((r) => {
      if (r.id === roundId) {
        return {
          ...r,
          questionsAnswers: (r.questionsAnswers || []).map((q) =>
            q.id === qaId ? { ...q, ...qaData } : q
          )
        };
      }
      return r;
    });
    await updateInterview(interviewId, { rounds });
    showToast('Question & Answer updated!');
  };

  const deleteQA = async (interviewId, roundId, qaId) => {
    const target = interviews.find((i) => i.id === interviewId);
    if (!target) return;
    const rounds = (target.rounds || []).map((r) => {
      if (r.id === roundId) {
        return {
          ...r,
          questionsAnswers: (r.questionsAnswers || []).filter((q) => q.id !== qaId)
        };
      }
      return r;
    });
    await updateInterview(interviewId, { rounds });
    showToast('Question removed.', 'info');
  };

  // Load rich sample dataset on demand
  const loadSampleData = () => {
    saveLocalInterviews(SAMPLE_INTERVIEWS);
    setSelectedInterviewId(SAMPLE_INTERVIEWS[0]?.id || null);
    showToast('Loaded realistic sample interviews!', 'success');
  };

  // Clear all data
  const clearAllData = () => {
    saveLocalInterviews([]);
    setSelectedInterviewId(null);
    showToast('Cleared interview tracker records.', 'info');
  };

  // Selected interview object
  const selectedInterview = interviews.find((i) => i.id === selectedInterviewId) || interviews[0] || null;

  // Filtered and sorted interview list
  const filteredInterviews = interviews
    .filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'ALL' || item.applicationStatus === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'company') {
        return (a.companyName || '').localeCompare(b.companyName || '');
      }
      if (sortBy === 'appliedDate') {
        return new Date(b.appliedDate || 0) - new Date(a.appliedDate || 0);
      }
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    });

  // Calculate high-level metrics for dashboard
  const stats = {
    total: interviews.length,
    interviewing: interviews.filter((i) => i.applicationStatus === APPLICATION_STATUS.INTERVIEWING).length,
    offered: interviews.filter((i) => i.applicationStatus === APPLICATION_STATUS.OFFERED || i.applicationStatus === APPLICATION_STATUS.ACCEPTED).length,
    rejected: interviews.filter((i) => i.applicationStatus === APPLICATION_STATUS.REJECTED).length,
    applied: interviews.filter((i) => i.applicationStatus === APPLICATION_STATUS.APPLIED || i.applicationStatus === APPLICATION_STATUS.SCREENING).length,
    totalRounds: interviews.reduce((acc, curr) => acc + (curr.rounds?.length || 0), 0),
    totalQAs: interviews.reduce((acc, curr) => {
      return acc + (curr.rounds || []).reduce((qAcc, r) => qAcc + (r.questionsAnswers?.length || 0), 0);
    }, 0)
  };

  return (
    <InterviewContext.Provider
      value={{
        interviews,
        filteredInterviews,
        selectedInterview,
        selectedInterviewId,
        setSelectedInterviewId,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        sortBy,
        setSortBy,
        stats,
        loading,
        toastMessage,
        showToast,
        closeToast,
        addInterview,
        updateInterview,
        deleteInterview,
        addRound,
        updateRound,
        deleteRound,
        addQA,
        updateQA,
        deleteQA,
        loadSampleData,
        clearAllData
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterviews = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterviews must be used within an InterviewProvider');
  }
  return context;
};
