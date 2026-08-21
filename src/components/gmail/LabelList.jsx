import React from 'react';
import { Tag, Inbox, Star, AlertCircle, Send, Folder, Mail } from 'lucide-react';

export const LabelList = ({
  labels = [],
  selectedLabelId,
  onSelectLabel
}) => {
  const getIcon = (label) => {
    switch (label.id) {
      case 'INBOX':
        return <Inbox className="w-3.5 h-3.5" />;
      case 'STARRED':
        return <Star className="w-3.5 h-3.5" />;
      case 'IMPORTANT':
        return <AlertCircle className="w-3.5 h-3.5" />;
      case 'SENT':
        return <Send className="w-3.5 h-3.5" />;
      default:
        return <Tag className="w-3.5 h-3.5" />;
    }
  };

  const formatLabelName = (name) => {
    if (name === 'INBOX') return 'Inbox';
    if (name === 'STARRED') return 'Starred';
    if (name === 'IMPORTANT') return 'Important';
    if (name === 'SENT') return 'Sent';
    return name;
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
      {labels.map((lbl) => {
        const isSelected = lbl.id === selectedLabelId;
        return (
          <button
            key={lbl.id}
            onClick={() => onSelectLabel(lbl.id)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium flex items-center gap-2 transition-all border ${
              isSelected
                ? 'bg-brand-600 text-white border-brand-500 shadow-glow-sm'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            <span className={isSelected ? 'text-white' : 'text-brand-400'}>
              {getIcon(lbl)}
            </span>
            <span>{formatLabelName(lbl.name)}</span>
            {lbl.messagesTotal !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-950/80 text-slate-400'
                }`}
              >
                {lbl.messagesTotal}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
