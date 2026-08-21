import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  Sparkles, 
  ExternalLink,
  Plus,
  Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useInterviews } from '../../context/InterviewContext';
import { LabelList } from './LabelList';
import { ThreadList } from './ThreadList';
import { ThreadDetailModal } from './ThreadDetailModal';
import { fetchGmailLabels, fetchGmailThreads } from '../../services/gmailService';
import { createEmptyInterview, APPLICATION_STATUS } from '../../types/interview';

export const GmailIntegration = ({ onOpenAddModalWithData }) => {
  const { user, accessToken, isDemoMode, signInWithGoogle } = useAuth();
  const { showToast } = useInterviews();

  const [labels, setLabels] = useState([]);
  const [selectedLabelId, setSelectedLabelId] = useState('INBOX');
  const [threads, setThreads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingLabels, setLoadingLabels] = useState(true);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [isMockData, setIsMockData] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);

  // Quick search keywords for interviews
  const quickKeywords = ['Interview', 'Offer', 'Assessment', 'Recruiter', 'Scheduling', 'Next Steps'];

  // Load Labels on mount or when token changes
  useEffect(() => {
    loadLabels();
  }, [accessToken, isDemoMode]);

  // Load Threads when label or search changes
  useEffect(() => {
    loadThreads();
  }, [selectedLabelId, accessToken, isDemoMode]);

  const loadLabels = async () => {
    setLoadingLabels(true);
    try {
      const result = await fetchGmailLabels(accessToken);
      setLabels(result.labels);
      setIsMockData(result.isMock);
    } catch (err) {
      console.warn('Labels load notice:', err);
    } finally {
      setLoadingLabels(false);
    }
  };

  const loadThreads = async (query = searchQuery) => {
    setLoadingThreads(true);
    try {
      const result = await fetchGmailThreads(accessToken, {
        labelId: selectedLabelId,
        query: query
      });
      setThreads(result.threads);
      if (result.isMock) {
        setIsMockData(true);
      }
    } catch (err) {
      console.warn('Threads load notice:', err);
    } finally {
      setLoadingThreads(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadThreads(searchQuery);
  };

  const handleKeywordClick = (kw) => {
    setSearchQuery(kw);
    loadThreads(kw);
  };

  // Convert an email thread directly into a new interview dossier
  const handleImportToTracker = (thread) => {
    // Extract company name candidate from subject
    let companyName = 'Company from Email';
    if (thread.subject.includes('—') || thread.subject.includes('-') || thread.subject.includes(':')) {
      const parts = thread.subject.split(/[-—:]/);
      if (parts[0].trim().length > 2 && parts[0].trim().length < 25) {
        companyName = parts[0].trim();
      }
    }

    const newDossier = {
      ...createEmptyInterview(),
      companyName: companyName,
      jobTitle: 'Software Engineer',
      applicationStatus: thread.subject.toLowerCase().includes('offer') ? APPLICATION_STATUS.OFFERED : APPLICATION_STATUS.INTERVIEWING,
      notes: `Imported from Gmail Thread:\n"${thread.subject}"\nFrom: ${thread.from}\nDate: ${thread.date}`,
      hrContacts: [
        {
          id: 'hr_' + Date.now(),
          name: thread.from.replace(/<.*>/, '').trim() || 'Recruiter',
          email: (thread.from.match(/<([^>]+)>/) || [])[1] || '',
          phone: '',
          notes: 'Captured from Gmail header'
        }
      ]
    };

    setSelectedThread(null);
    if (onOpenAddModalWithData) {
      onOpenAddModalWithData(newDossier);
    }
    showToast(`Drafted new interview dossier for ${companyName}!`);
  };

  return (
    <div className="space-y-6">
      {/* Gmail Hub Header */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-400" />
              <h3 className="text-base font-bold text-slate-100">
                Gmail Workspace Integration
              </h3>
              {accessToken ? (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Live OAuth
                </span>
              ) : (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Demo Simulation
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Read and parse interview invitations, scheduling updates, and offer letters directly from your Gmail inbox.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!accessToken && !isDemoMode && (
              <button
                onClick={signInWithGoogle}
                className="glass-button-primary text-xs py-2 px-3"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Connect Gmail</span>
              </button>
            )}

            <button
              onClick={() => {
                loadLabels();
                loadThreads();
                showToast('Refreshed Gmail data.');
              }}
              className="glass-button-secondary text-xs py-2 px-3"
              title="Refresh inbox"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingThreads ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>
          </div>
        </div>

        {/* Search input with filters */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search emails by keywords (e.g. Stripe, interview round, offer letter)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input pl-10 pr-20 py-2.5 text-xs"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white rounded-md text-xs font-medium"
          >
            Search
          </button>
        </form>

        {/* Quick Keyword Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold shrink-0">
            Quick Filters:
          </span>
          {quickKeywords.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => handleKeywordClick(kw)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                searchQuery === kw
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {kw}
            </button>
          ))}
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                loadThreads('');
              }}
              className="text-xs text-rose-400 hover:underline px-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Gmail Labels Explorer */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
        <div className="text-xs font-semibold text-slate-300">
          Select Gmail Label / Folder
        </div>
        <LabelList
          labels={labels}
          selectedLabelId={selectedLabelId}
          onSelectLabel={(lblId) => setSelectedLabelId(lblId)}
        />
      </div>

      {/* Threads List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Showing emails in <strong>{selectedLabelId}</strong> ({threads.length} threads)
          </span>
          {isMockData && (
            <span className="text-amber-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Realistic Mock Data
            </span>
          )}
        </div>

        <ThreadList
          threads={threads}
          loading={loadingThreads}
          onSelectThread={(t) => setSelectedThread(t)}
        />
      </div>

      {/* Thread Detail Modal */}
      {selectedThread && (
        <ThreadDetailModal
          thread={selectedThread}
          onClose={() => setSelectedThread(null)}
          onImportToTracker={handleImportToTracker}
        />
      )}
    </div>
  );
};
