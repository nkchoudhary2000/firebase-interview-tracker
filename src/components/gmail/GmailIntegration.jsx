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
  Filter,
  Key,
  ShieldCheck,
  RotateCw
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
  const [apiError, setApiError] = useState(null);
  const [selectedThread, setSelectedThread] = useState(null);

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
    setApiError(null);
    try {
      const result = await fetchGmailLabels(accessToken);
      setLabels(result.labels);
      setIsMockData(result.isMock);
      if (result.errorInfo) {
        setApiError(result.errorInfo);
      }
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
      if (result.errorInfo && !apiError) {
        setApiError(result.errorInfo);
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

  const handleImportToTracker = (thread) => {
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
      {/* 403 Forbidden Diagnostic Guidance Alert */}
      {apiError?.is403 && (
        <div className="rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-rose-950/80 border border-amber-500/40 p-5 shadow-2xl space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>Google API Notice: Enable Gmail API in Google Cloud Console</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                  HTTP 403 Forbidden
                </span>
              </h4>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Your Google OAuth token was successfully issued, but Google Cloud returned 403. In Google Cloud projects, the <strong>Gmail API</strong> is disabled by default until enabled in the API library.
              </p>
              
              <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>2 Quick Steps to Complete Gmail Connection:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300">
                  <li>
                    <strong>Enable Gmail API:</strong> Open the Google Cloud Console library and click <strong>&quot;Enable&quot;</strong>.
                  </li>
                  <li>
                    <strong>OAuth Consent Screen:</strong> If your project is in <em>&quot;Testing&quot;</em> mode, add your email address under <em>&quot;Test users&quot;</em>.
                  </li>
                </ol>
              </div>

              <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
                <a
                  href="https://console.cloud.google.com/apis/library/gmail.googleapis.com?project=niraj-portfolio-a7011"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
                >
                  <span>1. Enable Gmail API (1-Click)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://console.cloud.google.com/apis/credentials/consent?project=niraj-portfolio-a7011"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
                >
                  <span>2. OAuth Test Users</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => {
                    signInWithGoogle();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600/90 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Re-authenticate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gmail Hub Header */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-400" />
              <h3 className="text-base font-bold text-slate-100">
                Gmail Workspace Integration
              </h3>
              {accessToken && !apiError?.is403 ? (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Live Connected
                </span>
              ) : (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Fallback Mode Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Read and parse interview invitations, scheduling updates, and offer letters directly from your Gmail inbox.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!accessToken && (
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
              <Sparkles className="w-3 h-3" /> Showing Fallback Preview
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
