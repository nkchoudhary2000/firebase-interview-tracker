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
import { APPLICATION_STATUS } from '../types/interview';

const InterviewContext = createContext(null);

export const InterviewProvider = ({ children }) => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [activeTab, setActiveTab] = useState('tree'); // 'tree' | 'cards' | 'knowledge'
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

  // Sync strictly with user-owned Firestore collection
  useEffect(() => {
    const isConfigured = isFirebaseConfigured();

    if (!user) {
      // Clear data when logged out to ensure privacy
      setInterviews([]);
      setSelectedInterviewId(null);
      setLoading(false);
      return;
    }

    if (isConfigured && db) {
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
          console.error('Firestore subscription error:', error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Add new interview entry
  const addInterview = async (interviewData) => {
    if (!user || !db) {
      showToast('You must be signed in to save interviews.', 'error');
      return null;
    }

    try {
      const newRecord = {
        ...interviewData,
        userId: user.uid,
        userEmail: user.email,
        createdAt: new Date().toISOString(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'interviews'), newRecord);
      setSelectedInterviewId(docRef.id);
      showToast(`Added interview dossier for ${interviewData.companyName || 'Company'}!`);
      return docRef.id;
    } catch (err) {
      console.error('Failed to add interview to Firestore:', err);
      showToast('Failed to save to Firestore. Check permissions.', 'error');
      return null;
    }
  };

  // Update existing interview
  const updateInterview = async (id, updatedFields) => {
    if (!user || !db) return;

    try {
      const docRef = doc(db, 'interviews', id);
      await updateDoc(docRef, {
        ...updatedFields,
        updatedAt: serverTimestamp()
      });
      showToast('Interview profile updated successfully!');
    } catch (err) {
      console.error('Firestore update error:', err);
      showToast('Failed to update interview dossier.', 'error');
    }
  };

  // Delete interview
  const deleteInterview = async (id) => {
    if (!user || !db) return;
    const target = interviews.find((i) => i.id === id);

    try {
      await deleteDoc(doc(db, 'interviews', id));
      if (selectedInterviewId === id) {
        const remaining = interviews.filter((i) => i.id !== id);
        setSelectedInterviewId(remaining[0]?.id || null);
      }
      showToast(`Deleted ${target?.companyName || 'Interview'} dossier.`, 'info');
    } catch (err) {
      console.error('Firestore delete error:', err);
      showToast('Failed to delete dossier.', 'error');
    }
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
      return new Date(b.updatedAt?.seconds ? b.updatedAt.seconds * 1000 : b.updatedAt || 0) - 
             new Date(a.updatedAt?.seconds ? a.updatedAt.seconds * 1000 : a.updatedAt || 0);
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
        deleteQA
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
