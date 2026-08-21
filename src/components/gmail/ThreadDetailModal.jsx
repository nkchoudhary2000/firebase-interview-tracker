import React, { useState } from 'react';
import { 
  Mail, 
  User, 
  Calendar, 
  X, 
  ArrowLeft, 
  Copy, 
  Check, 
  Plus, 
  Building2, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { copyTextToClipboard } from '../../services/markdownService';
import { useInterviews } from '../../context/InterviewContext';

export const ThreadDetailModal = ({
  thread,
  onClose,
  onImportToTracker
}) => {
  const { showToast } = useInterviews();
  const [copied, setCopied] = useState(false);

  if (!thread) return null;

  const messages = thread.messages || [
    {
      id: thread.id,
      from: thread.from,
      subject: thread.subject,
      date: thread.date,
      body: thread.snippet
    }
  ];

  const handleCopyThreadText = async () => {
    let text = `Subject: ${thread.subject}\nFrom: ${thread.from}\nDate: ${thread.date}\n\n`;
    messages.forEach((m, idx) => {
      text += `--- Message ${idx + 1} (${m.date}) ---\nFrom: ${m.from}\n\n${m.body}\n\n`;
    });

    const success = await copyTextToClipboard(text);
    if (success) {
      setCopied(true);
      showToast('Copied email thread text to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-3xl max-h-[88vh] rounded-2xl flex flex-col border border-slate-700/90 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-100 truncate">
                {thread.subject}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="truncate">{thread.from}</span>
                <span>•</span>
                <span>{thread.date}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyThreadText}
              className="glass-button-secondary text-xs py-1.5 px-3"
              title="Copy email content"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conversation Message List */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-slate-950/60">
          {messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-md space-y-3"
            >
              {/* Message Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 text-xs">
                <div className="flex items-center gap-2 font-medium text-slate-200">
                  <User className="w-4 h-4 text-brand-400" />
                  <span>{msg.from || thread.from}</span>
                </div>
                <div className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{msg.date || thread.date}</span>
                </div>
              </div>

              {/* Message Body */}
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-sans select-text">
                {msg.body}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 flex items-center justify-between bg-slate-900/90">
          <span className="text-xs text-slate-400">
            {messages.length} message{messages.length === 1 ? '' : 's'} in this thread
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="glass-button-secondary text-xs"
            >
              Close
            </button>
            {onImportToTracker && (
              <button
                onClick={() => onImportToTracker(thread)}
                className="glass-button-primary text-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Interview from Email</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
