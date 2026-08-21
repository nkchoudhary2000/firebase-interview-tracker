import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Copy, Check } from 'lucide-react';
import { copyTextToClipboard } from '../../../services/markdownService';
import { useInterviews } from '../../../context/InterviewContext';

export const TreeNode = ({
  title,
  subtitle,
  icon,
  badge,
  markdownText,
  level = 0,
  defaultExpanded = true,
  children,
  actions,
  className = '',
  headerClassName = '',
  copyLabel = 'Copy as Markdown',
  isLeaf = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);
  const { showToast } = useInterviews();

  const handleCopy = async (e) => {
    e.stopPropagation();
    if (!markdownText) return;

    const success = await copyTextToClipboard(markdownText);
    if (success) {
      setCopied(true);
      showToast(`Copied ${title || 'Node'} as Markdown to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleExpand = () => {
    if (!isLeaf) {
      setIsExpanded(!isExpanded);
    }
  };

  // Indentation margins per level
  const indentClass = level > 0 ? `ml-${Math.min(level * 3, 12)}` : '';

  return (
    <div className={`relative ${level > 0 ? 'mt-2.5' : ''} ${className}`}>
      {/* Node Header Row */}
      <div
        onClick={toggleExpand}
        className={`group relative flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl border transition-all duration-150 select-none ${
          isLeaf ? 'cursor-default' : 'cursor-pointer hover:border-slate-600'
        } ${
          isExpanded
            ? 'bg-slate-900/90 border-slate-700/80 shadow-md'
            : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900/70'
        } ${headerClassName}`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Expand / Collapse Icon */}
          {!isLeaf ? (
            <button
              type="button"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-brand-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>
          ) : (
            <div className="w-6 shrink-0 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            </div>
          )}

          {/* Node Icon */}
          {icon && (
            <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-brand-400 shrink-0">
              {icon}
            </div>
          )}

          {/* Titles & Meta */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-slate-100 truncate">
                {title}
              </span>
              {badge}
            </div>
            {subtitle && (
              <div className="text-xs text-slate-400 mt-0.5 truncate">
                {subtitle}
              </div>
            )}
          </div>
        </div>

        {/* Action Controls & Copy Markdown Button */}
        <div
          className="flex items-center gap-1.5 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {actions}

          {/* Markdown Copy Icon Button */}
          {markdownText && (
            <button
              type="button"
              onClick={handleCopy}
              title={copied ? 'Copied!' : copyLabel}
              className={`p-2 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 active:scale-95 ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-copy-success'
                  : 'bg-slate-800/70 hover:bg-brand-600 text-slate-300 hover:text-white border-slate-700/80 hover:border-brand-500 shadow-sm'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Copy MD</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Node Children Subtree */}
      {!isLeaf && isExpanded && children && (
        <div className="relative pl-4 sm:pl-6 ml-2 sm:ml-4 border-l border-slate-800/90 pt-2 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};
