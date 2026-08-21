import React from 'react';
import { 
  Building2, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Layers, 
  Copy, 
  Check, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  ChevronRight,
  Plus,
  Sparkles
} from 'lucide-react';
import { useInterviews } from '../../context/InterviewContext';
import { Badge } from '../common/Badge';
import { generateCompanyMarkdown, copyTextToClipboard } from '../../services/markdownService';

export const InterviewList = ({ onOpenAddModal, onEditInterview, onDeleteInterview }) => {
  const { 
    filteredInterviews, 
    setSelectedInterviewId, 
    setActiveTab, 
    loadSampleData,
    showToast 
  } = useInterviews();

  const handleCopy = async (e, interview) => {
    e.stopPropagation();
    const md = generateCompanyMarkdown(interview);
    const success = await copyTextToClipboard(md);
    if (success) {
      showToast(`Copied ${interview.companyName} dossier as Markdown!`);
    }
  };

  const handleCardClick = (id) => {
    setSelectedInterviewId(id);
    setActiveTab('tree');
  };

  if (filteredInterviews.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 sm:p-12 text-center border border-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-100">No Applications Match Filter</h3>
        <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
          Try clearing your search query or reset status filter to view all applications.
        </p>
        <div className="mt-6 flex items-center justify-center">
          <button
            onClick={onOpenAddModal}
            className="glass-button-primary text-xs px-4 py-2.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Interview Dossier</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredInterviews.map((interview) => {
        const rounds = interview.rounds || [];
        const latestRound = rounds[rounds.length - 1];

        return (
          <div
            key={interview.id}
            onClick={() => handleCardClick(interview.id)}
            className="glass-panel rounded-2xl p-5 border border-slate-800/80 hover:border-brand-500/50 cursor-pointer transition-all duration-200 hover:-translate-y-1 group flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-glow-sm shrink-0">
                    {interview.companyName?.charAt(0).toUpperCase() || 'C'}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-100 truncate group-hover:text-brand-300 transition-colors">
                      {interview.companyName}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">
                      {interview.jobTitle || 'Role not specified'}
                    </p>
                  </div>
                </div>

                <Badge status={interview.applicationStatus} size="sm" />
              </div>

              {/* Details & Specs */}
              <div className="space-y-2 py-3 border-y border-slate-800/80 text-xs text-slate-300">
                {interview.expectedCtc && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Expected Comp:</span>
                    <span className="font-semibold text-emerald-400">{interview.expectedCtc}</span>
                  </div>
                )}
                {interview.companySize && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Company Size:</span>
                    <span className="text-slate-300 truncate max-w-[170px]">{interview.companySize}</span>
                  </div>
                )}
                {interview.location && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-slate-300 truncate max-w-[170px]">{interview.location}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Rounds Tracked:</span>
                  <span className="font-medium text-brand-300">{rounds.length} stages</span>
                </div>
              </div>

              {/* Latest Round Preview */}
              {latestRound && (
                <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-medium text-purple-300">Next / Recent Round</span>
                    <span>{latestRound.date || 'TBD'}</span>
                  </div>
                  <div className="font-medium text-slate-200 truncate">
                    {latestRound.roundName}
                  </div>
                </div>
              )}
            </div>

            {/* Card Footer Actions */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={(e) => handleCopy(e, interview)}
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-brand-600 text-slate-300 hover:text-white text-xs flex items-center gap-1 transition-all border border-slate-700/80"
                  title="Copy Dossier as Markdown"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[10px]">MD</span>
                </button>

                <button
                  type="button"
                  onClick={() => onEditInterview(interview)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                  title="Edit Interview"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteInterview(interview.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete Interview"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-brand-400 group-hover:translate-x-1 transition-transform">
                <span>View Tree</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
