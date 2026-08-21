import React, { useState } from 'react';
import { UserCheck, Linkedin, ExternalLink, Plus, Copy, Check, Trash2, Briefcase, FileText } from 'lucide-react';
import { TreeNode } from './TreeNode';
import { 
  generateInterviewersMarkdown, 
  generateSingleInterviewerMarkdown, 
  copyTextToClipboard 
} from '../../../services/markdownService';
import { useInterviews } from '../../../context/InterviewContext';
import { createEmptyInterviewer } from '../../../types/interview';

export const InterviewersSubtree = ({ interview, level = 1 }) => {
  const { updateInterview, showToast } = useInterviews();
  const interviewers = interview.interviewers || [];
  const [isAdding, setIsAdding] = useState(false);
  const [newInterviewer, setNewInterviewer] = useState(createEmptyInterviewer());
  const [copiedId, setCopiedId] = useState(null);

  const allInterviewersMarkdown = generateInterviewersMarkdown(interviewers);

  const handleCopySingle = async (e, item) => {
    e.stopPropagation();
    const md = generateSingleInterviewerMarkdown(item);
    const success = await copyTextToClipboard(md);
    if (success) {
      setCopiedId(item.id);
      showToast(`Copied info for ${item.name || 'Interviewer'}!`);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleDelete = (id) => {
    const updated = interviewers.filter((i) => i.id !== id);
    updateInterview(interview.id, { interviewers: updated });
  };

  const handleSaveNew = (e) => {
    e.preventDefault();
    if (!newInterviewer.name.trim()) return;
    const updated = [...interviewers, newInterviewer];
    updateInterview(interview.id, { interviewers: updated });
    setNewInterviewer(createEmptyInterviewer());
    setIsAdding(false);
  };

  return (
    <TreeNode
      title="Interviewers & Panelists"
      subtitle={`${interviewers.length} technical / engineering lead${interviewers.length === 1 ? '' : 's'}`}
      icon={<UserCheck className="w-4 h-4 text-emerald-400" />}
      badge={
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
          {interviewers.length}
        </span>
      }
      markdownText={allInterviewersMarkdown}
      copyLabel="Copy all interviewers as Markdown table"
      level={level}
      actions={
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs flex items-center gap-1 transition-all"
          title="Add Interviewer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Add Interviewer</span>
        </button>
      }
    >
      <div className="space-y-2.5 mt-2">
        {interviewers.length === 0 && !isAdding && (
          <div className="p-3 text-xs text-slate-500 rounded-xl bg-slate-950/40 border border-slate-800/60 italic">
            No interviewers added yet. Click &quot;Add Interviewer&quot; to track panel members.
          </div>
        )}

        {interviewers.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-100">
                  {item.name || 'Unnamed Interviewer'}
                </span>
                {item.role && (
                  <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    {item.role}
                  </span>
                )}
              </div>

              {item.linkedIn && (
                <div className="mt-1">
                  <a
                    href={item.linkedIn.startsWith('http') ? item.linkedIn : `https://${item.linkedIn}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    <Linkedin className="w-3 h-3 text-brand-400" />
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}

              {item.notes && (
                <div className="mt-1 text-[11px] text-slate-400 flex items-start gap-1">
                  <FileText className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
                  <span>{item.notes}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={(e) => handleCopySingle(e, item)}
                title="Copy this interviewer as Markdown"
                className={`p-1.5 rounded-lg border text-xs transition-all flex items-center gap-1 ${
                  copiedId === item.id
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700/60'
                }`}
              >
                {copiedId === item.id ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span className="text-[10px]">{copiedId === item.id ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                title="Delete Interviewer"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {isAdding && (
          <form
            onSubmit={handleSaveNew}
            className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-3 animate-fade-in"
          >
            <div className="text-xs font-semibold text-emerald-300">Add Interviewer Details</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Full Name *"
                value={newInterviewer.name}
                onChange={(e) => setNewInterviewer({ ...newInterviewer, name: e.target.value })}
                required
                className="glass-input text-xs"
                autoFocus
              />
              <input
                type="text"
                placeholder="Role / Title (e.g. Staff Engineer)"
                value={newInterviewer.role}
                onChange={(e) => setNewInterviewer({ ...newInterviewer, role: e.target.value })}
                className="glass-input text-xs"
              />
              <input
                type="text"
                placeholder="LinkedIn Profile URL"
                value={newInterviewer.linkedIn}
                onChange={(e) => setNewInterviewer({ ...newInterviewer, linkedIn: e.target.value })}
                className="glass-input text-xs"
              />
              <input
                type="text"
                placeholder="Interview Focus / Notes"
                value={newInterviewer.notes}
                onChange={(e) => setNewInterviewer({ ...newInterviewer, notes: e.target.value })}
                className="glass-input text-xs"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 text-xs rounded-lg text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium"
              >
                Save Interviewer
              </button>
            </div>
          </form>
        )}
      </div>
    </TreeNode>
  );
};
