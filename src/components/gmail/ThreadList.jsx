import React from 'react';
import { Mail, Calendar, User, ChevronRight, MessageSquare, ExternalLink } from 'lucide-react';

export const ThreadList = ({
  threads = [],
  loading = false,
  onSelectThread
}) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="glass-panel rounded-2xl p-4 border border-slate-800 animate-pulse space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-48 bg-slate-800 rounded" />
              <div className="h-3 w-16 bg-slate-800 rounded" />
            </div>
            <div className="h-3.5 w-3/4 bg-slate-800/60 rounded" />
            <div className="h-3 w-full bg-slate-800/40 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!threads || threads.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center border border-slate-800 text-slate-400 text-xs">
        <Mail className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-60" />
        <p>No email threads found under this label or search query.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {threads.map((thread) => (
        <div
          key={thread.id}
          onClick={() => onSelectThread(thread)}
          className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800/80 hover:border-brand-500/50 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group space-y-2"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center text-xs font-bold shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-slate-200 block truncate group-hover:text-brand-300 transition-colors">
                  {thread.from || 'Recruiter / Sender'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
              <span>{thread.date}</span>
              {thread.messageCount > 1 && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {thread.messageCount} msgs
                </span>
              )}
            </div>
          </div>

          {/* Subject */}
          <h4 className="text-sm font-bold text-slate-100 line-clamp-1">
            {thread.subject}
          </h4>

          {/* Snippet preview */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {thread.snippet}
          </p>

          {/* Footer */}
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-brand-400">
            <span className="text-slate-500">Click to view full thread conversation</span>
            <div className="flex items-center gap-1 font-medium group-hover:translate-x-1 transition-transform">
              <span>Read Thread</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
