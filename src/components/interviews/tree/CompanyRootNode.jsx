import React from 'react';
import { 
  Building2, 
  DollarSign, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Layers,
  FileText,
  Briefcase
} from 'lucide-react';
import { TreeNode } from './TreeNode';
import { ContactsSubtree } from './ContactsSubtree';
import { InterviewersSubtree } from './InterviewersSubtree';
import { RoundsSubtree } from './RoundsSubtree';
import { 
  generateCompanyMarkdown, 
  generateOverviewMarkdown 
} from '../../../services/markdownService';
import { Badge } from '../../common/Badge';
import { useInterviews } from '../../../context/InterviewContext';

export const CompanyRootNode = ({
  interview,
  onEdit,
  onDelete
}) => {
  if (!interview) return null;

  const fullDossierMarkdown = generateCompanyMarkdown(interview);
  const overviewMarkdown = generateOverviewMarkdown(interview);

  return (
    <div className="space-y-4">
      {/* Root Company Tree Node */}
      <TreeNode
        title={interview.companyName || 'Untitled Company'}
        subtitle={
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
            {interview.jobTitle && (
              <span className="text-slate-200 font-medium">
                {interview.jobTitle}
              </span>
            )}
            {interview.expectedCtc && (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <DollarSign className="w-3.5 h-3.5" />
                {interview.expectedCtc}
              </span>
            )}
            {interview.location && (
              <span className="flex items-center gap-1 text-slate-400">
                <MapPin className="w-3 h-3 text-slate-500" />
                {interview.location}
              </span>
            )}
          </div>
        }
        icon={<Building2 className="w-5 h-5 text-brand-400" />}
        badge={<Badge status={interview.applicationStatus} size="md" />}
        markdownText={fullDossierMarkdown}
        copyLabel="Copy Complete Company Dossier as Markdown"
        level={0}
        defaultExpanded={true}
        headerClassName="bg-slate-900/90 border-brand-500/30 shadow-glow-sm"
        actions={
          <div className="flex items-center gap-1.5">
            {interview.jobLink && (
              <a
                href={interview.jobLink.startsWith('http') ? interview.jobLink : `https://${interview.jobLink}`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg text-slate-400 hover:text-brand-300 hover:bg-slate-800 transition-colors"
                title="Open Job Posting"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(interview)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Edit Dossier"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(interview.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Delete Dossier"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        }
      >
        {/* Branch 1: Overview & Compensation */}
        <TreeNode
          title="Role Overview & Compensation"
          subtitle={`Company Size: ${interview.companySize || 'N/A'} • Applied: ${interview.appliedDate || 'N/A'}`}
          icon={<Briefcase className="w-4 h-4 text-indigo-400" />}
          markdownText={overviewMarkdown}
          copyLabel="Copy Overview as Markdown"
          level={1}
          defaultExpanded={true}
        >
          <div className="mt-2 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Company Size</span>
                <span className="text-xs font-semibold text-slate-200 mt-0.5 block">{interview.companySize || 'Not specified'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Expected CTC / Comp</span>
                <span className="text-xs font-semibold text-emerald-400 mt-0.5 block">{interview.expectedCtc || 'Not specified'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Applied Date</span>
                <span className="text-xs font-semibold text-slate-200 mt-0.5 block">{interview.appliedDate || 'Not specified'}</span>
              </div>
            </div>

            {interview.notes && (
              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/60">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">General Notes & Strategy:</span>
                <p className="text-slate-300 whitespace-pre-line leading-relaxed">{interview.notes}</p>
              </div>
            )}

            {interview.tags && interview.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {interview.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-300 border border-brand-500/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </TreeNode>

        {/* Branch 2: HR Contacts */}
        <ContactsSubtree interview={interview} level={1} />

        {/* Branch 3: Interviewers */}
        <InterviewersSubtree interview={interview} level={1} />

        {/* Branch 4: Rounds & Q&A */}
        <RoundsSubtree interview={interview} level={1} />
      </TreeNode>
    </div>
  );
};
