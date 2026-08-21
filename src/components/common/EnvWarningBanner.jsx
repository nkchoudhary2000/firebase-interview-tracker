import React, { useState } from 'react';
import { Sparkles, Key, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useInterviews } from '../../context/InterviewContext';

export const EnvWarningBanner = () => {
  const { isConfigured, isDemoMode, enableDemoMode } = useAuth();
  const { loadSampleData } = useInterviews();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (isConfigured && !isDemoMode) {
    return null;
  }

  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-r from-brand-950/80 via-slate-900/90 to-indigo-950/80 border border-brand-500/30 p-4 sm:p-5 shadow-glow relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-100">
                Interactive Demo Mode Active
              </h4>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Ready to Explore
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-300 max-w-3xl leading-relaxed">
              All features — including the <strong>collapsible tree visualizer</strong>, <strong>multi-level Markdown copying</strong>, <strong>round Q&A management</strong>, and <strong>simulated Gmail inbox explorer</strong> — are fully operational.
              To connect live Firebase & Google Cloud, populate your credentials in <code className="px-1.5 py-0.5 rounded bg-slate-950/60 border border-slate-800 text-brand-300 font-mono text-[11px]">.env</code>.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <button
                onClick={loadSampleData}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600/80 hover:bg-brand-600 text-white text-xs font-medium border border-brand-400/30 transition-all shadow-sm active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Reset Sample Dossiers
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors shrink-0"
          title="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
