import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Copy, Check, Trash2, Edit3, Tag } from 'lucide-react';
import { generateSingleQAMarkdown, copyTextToClipboard } from '../../../services/markdownService';
import { useInterviews } from '../../../context/InterviewContext';

export const QAItemNode = ({
  qa,
  index,
  interviewId,
  roundId,
  onEditQA
}) => {
  const { deleteQA, showToast } = useInterviews();
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const markdownContent = generateSingleQAMarkdown(qa, index);

  const handleCopy = async (e) => {
    e.stopPropagation();
    const success = await copyTextToClipboard(markdownContent);
    if (success) {
      setCopied(true);
      showToast(`Copied Q${index + 1} Markdown to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Delete this question & answer?')) {
      deleteQA(interviewId, roundId, qa.id);
    }
  };

  return (
    <div className="group rounded-xl border border-slate-800/80 bg-slate-950/60 hover:border-slate-700/80 transition-all overflow-hidden mb-2.5">
      {/* Question Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between gap-3 p-3 cursor-pointer bg-slate-900/40 hover:bg-slate-900/70 select-none"
      >
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <div className="p-1.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/25 shrink-0 mt-0.5">
            <HelpCircle className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-amber-400">
                Q{index + 1}:
              </span>
              <span className="text-xs font-medium text-slate-200">
                {qa.question || 'Untitled Question'}
              </span>
              {qa.topic && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/80 flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5" />
                  {qa.topic}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div
          className="flex items-center gap-1.5 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {onEditQA && (
            <button
              type="button"
              onClick={() => onEditQA(qa)}
              title="Edit Q&A"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleDelete}
            title="Delete Q&A"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Copy Single QA Markdown */}
          <button
            type="button"
            onClick={handleCopy}
            title={copied ? 'Copied!' : 'Copy this Q&A as Markdown'}
            className={`p-1.5 rounded-lg border text-xs transition-all flex items-center gap-1 active:scale-95 ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-copy-success'
                : 'bg-slate-800/80 hover:bg-brand-600 text-slate-300 hover:text-white border-slate-700/60 shadow-sm'
            }`}
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            <span className="text-[10px] font-medium hidden sm:inline">
              {copied ? 'Copied' : 'Copy'}
            </span>
          </button>
        </div>
      </div>

      {/* Answer Body */}
      {isExpanded && (
        <div className="p-3.5 border-t border-slate-800/60 bg-slate-950/40 text-xs text-slate-300 leading-relaxed font-sans">
          <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3 text-brand-400" />
            <span>Answer / Talking Points:</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/80 text-slate-200 whitespace-pre-line font-mono text-[11px]">
            {qa.answer || <span className="text-slate-500 italic">No answer notes recorded yet.</span>}
          </div>
        </div>
      )}
    </div>
  );
};
