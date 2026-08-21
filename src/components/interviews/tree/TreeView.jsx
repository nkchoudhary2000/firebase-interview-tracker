import React, { useState } from 'react';
import { 
  Building2, 
  Layers, 
  Copy, 
  Check, 
  FileText, 
  Plus, 
  Sparkles, 
  ChevronRight, 
  Eye, 
  X,
  Code
} from 'lucide-react';
import { CompanyRootNode } from './CompanyRootNode';
import { useInterviews } from '../../../context/InterviewContext';
import { generateCompanyMarkdown, copyTextToClipboard } from '../../../services/markdownService';

export const TreeView = ({ onOpenAddModal, onEditInterview, onDeleteInterview }) => {
  const { 
    filteredInterviews, 
    selectedInterviewId, 
    setSelectedInterviewId, 
    selectedInterview,
    loadSampleData,
    showToast
  } = useInterviews();

  const [previewMarkdown, setPreviewMarkdown] = useState(null);
  const [copiedPreview, setCopiedPreview] = useState(false);

  const handleCopyFullCurrent = async () => {
    if (!selectedInterview) return;
    const md = generateCompanyMarkdown(selectedInterview);
    const success = await copyTextToClipboard(md);
    if (success) {
      showToast(`Copied complete ${selectedInterview.companyName} dossier as Markdown!`);
    }
  };

  const handleOpenPreview = () => {
    if (!selectedInterview) return;
    setPreviewMarkdown(generateCompanyMarkdown(selectedInterview));
  };

  const handleCopyPreviewText = async () => {
    if (!previewMarkdown) return;
    const success = await copyTextToClipboard(previewMarkdown);
    if (success) {
      setCopiedPreview(true);
      showToast('Copied Markdown preview to clipboard!');
      setTimeout(() => setCopiedPreview(false), 2000);
    }
  };

  if (filteredInterviews.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 sm:p-12 text-center border border-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center mx-auto mb-4 shadow-glow-sm">
          <Building2 className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-100">No Interview Dossiers Found</h3>
        <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
          Start mapping your interview processes, HR contacts, technical rounds, and questions.
        </p>
        <div className="mt-6 flex items-center justify-center">
          <button
            onClick={onOpenAddModal}
            className="glass-button-primary text-xs px-4 py-2.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Interview Dossier</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Controls & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-slate-800/90">
        {/* Company Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar flex-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" />
            Companies:
          </span>
          {filteredInterviews.map((item) => {
            const isSelected = item.id === selectedInterviewId;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedInterviewId(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-brand-600/90 text-white border-brand-500 shadow-glow-sm'
                    : 'bg-slate-900/60 hover:bg-slate-800/70 text-slate-300 border-slate-800'
                }`}
              >
                <span>{item.companyName}</span>
                {item.rounds?.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/60 text-slate-300">
                    {item.rounds.length}R
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Global Markdown Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleOpenPreview}
            className="glass-button-secondary text-xs py-2 px-3"
            title="Preview Markdown document"
          >
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>Preview MD</span>
          </button>

          <button
            onClick={handleCopyFullCurrent}
            className="glass-button-primary text-xs py-2 px-3.5"
            title="Copy entire interview dossier as Markdown"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Full Dossier</span>
          </button>
        </div>
      </div>

      {/* Main Recursive Tree Structure */}
      {selectedInterview && (
        <div className="p-4 sm:p-6 rounded-2xl glass-panel border border-slate-800/90 shadow-2xl">
          <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                Interactive Hierarchical Tree
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Click any node to expand/collapse or copy its branch as Markdown</span>
            </div>
          </div>

          <CompanyRootNode
            interview={selectedInterview}
            onEdit={onEditInterview}
            onDelete={onDeleteInterview}
          />
        </div>
      )}

      {/* Markdown Preview Modal */}
      {previewMarkdown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-panel w-full max-w-3xl max-h-[85vh] rounded-2xl flex flex-col border border-slate-700/90 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-2.5">
                <Code className="w-5 h-5 text-brand-400" />
                <h3 className="text-sm font-semibold text-slate-100">
                  Markdown Export Preview — {selectedInterview?.companyName}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPreviewText}
                  className="glass-button-primary text-xs py-1.5 px-3"
                >
                  {copiedPreview ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Markdown</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setPreviewMarkdown(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-950/80 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap selection:bg-brand-500/40">
              {previewMarkdown}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
