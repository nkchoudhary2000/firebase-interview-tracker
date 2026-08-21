import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useInterviews } from '../../context/InterviewContext';

export const Toast = () => {
  const { toastMessage, closeToast } = useInterviews();

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      closeToast();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  if (!toastMessage) return null;

  const { message, type } = toastMessage;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/40 bg-slate-900/90 text-emerald-200',
    warning: 'border-amber-500/40 bg-slate-900/90 text-amber-200',
    info: 'border-sky-500/40 bg-slate-900/90 text-sky-200',
    error: 'border-rose-500/40 bg-slate-900/90 text-rose-200'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in max-w-md">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl ${
          borders[type] || borders.success
        }`}
      >
        {icons[type] || icons.success}
        <div className="text-sm font-medium text-slate-100 flex-1 whitespace-pre-line">
          {message}
        </div>
        <button
          onClick={closeToast}
          className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
