import React, { useState } from 'react';
import { 
  Calendar, 
  HelpCircle, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  User
} from 'lucide-react';
import { TreeNode } from './TreeNode';
import { QAItemNode } from './QAItemNode';
import { 
  generateRoundsMarkdown, 
  generateSingleRoundMarkdown, 
  generateQAListMarkdown, 
  copyTextToClipboard 
} from '../../../services/markdownService';
import { useInterviews } from '../../../context/InterviewContext';
import { createEmptyRound, createEmptyQA, ROUND_STATUS, ROUND_STATUS_CONFIG } from '../../../types/interview';
import { Badge } from '../../common/Badge';

export const RoundsSubtree = ({ interview, level = 1 }) => {
  const { addRound, updateRound, deleteRound, addQA, showToast } = useInterviews();
  const rounds = interview.rounds || [];
  const [isAddingRound, setIsAddingRound] = useState(false);
  const [newRound, setNewRound] = useState(createEmptyRound());
  
  // State for adding QA to a specific round
  const [activeRoundForQA, setActiveRoundForQA] = useState(null);
  const [newQA, setNewQA] = useState(createEmptyQA());
  const [copiedRoundId, setCopiedRoundId] = useState(null);
  const [copiedQASectionRoundId, setCopiedQASectionRoundId] = useState(null);

  const allRoundsMarkdown = generateRoundsMarkdown(rounds);

  const handleCopyRound = async (e, round, index) => {
    e.stopPropagation();
    const md = generateSingleRoundMarkdown(round, index);
    const success = await copyTextToClipboard(md);
    if (success) {
      setCopiedRoundId(round.id);
      showToast(`Copied Round ${index + 1} (${round.roundName || 'Details'}) as Markdown!`);
      setTimeout(() => setCopiedRoundId(null), 2000);
    }
  };

  const handleCopyQAList = async (e, round) => {
    e.stopPropagation();
    const md = generateQAListMarkdown(round.questionsAnswers, round.roundName);
    const success = await copyTextToClipboard(md);
    if (success) {
      setCopiedQASectionRoundId(round.id);
      showToast(`Copied Q&A list for ${round.roundName || 'Round'}!`);
      setTimeout(() => setCopiedQASectionRoundId(null), 2000);
    }
  };

  const handleSaveNewRound = async (e) => {
    e.preventDefault();
    if (!newRound.roundName.trim()) return;
    await addRound(interview.id, newRound);
    setNewRound(createEmptyRound());
    setIsAddingRound(false);
  };

  const handleSaveNewQA = async (e, roundId) => {
    e.preventDefault();
    if (!newQA.question.trim()) return;
    await addQA(interview.id, roundId, newQA);
    setNewQA(createEmptyQA());
    setActiveRoundForQA(null);
  };

  return (
    <TreeNode
      title="Interview Rounds & Q&A Stages"
      subtitle={`${rounds.length} round${rounds.length === 1 ? '' : 's'} scheduled / completed`}
      icon={<Calendar className="w-4 h-4 text-purple-400" />}
      badge={
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
          {rounds.length} Rounds
        </span>
      }
      markdownText={allRoundsMarkdown}
      copyLabel="Copy all interview rounds and Q&As as Markdown"
      level={level}
      actions={
        <button
          type="button"
          onClick={() => setIsAddingRound(true)}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-purple-300 border border-purple-500/30 text-xs flex items-center gap-1 transition-all"
          title="Add Round"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Add Round</span>
        </button>
      }
    >
      <div className="space-y-3 mt-2">
        {rounds.length === 0 && !isAddingRound && (
          <div className="p-3 text-xs text-slate-500 rounded-xl bg-slate-950/40 border border-slate-800/60 italic">
            No interview rounds added yet. Click &quot;Add Round&quot; to begin mapping your loop.
          </div>
        )}

        {/* List of Individual Rounds */}
        {rounds.map((round, idx) => {
          const qas = round.questionsAnswers || [];
          const roundMd = generateSingleRoundMarkdown(round, idx);

          return (
            <TreeNode
              key={round.id}
              title={round.roundName || `Round ${idx + 1}`}
              subtitle={
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-400" />
                    {round.date || 'TBD'}
                  </span>
                  {round.interviewerName && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" />
                      {round.interviewerName}
                    </span>
                  )}
                </div>
              }
              badge={<Badge status={round.status || ROUND_STATUS.SCHEDULED} size="sm" />}
              icon={<span className="text-xs font-bold text-purple-400">R{idx + 1}</span>}
              markdownText={roundMd}
              copyLabel={`Copy Round ${idx + 1} & Q&As as Markdown`}
              level={level + 1}
              actions={
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveRoundForQA(round.id)}
                    className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs flex items-center gap-1 transition-all"
                    title="Add Question & Answer to this round"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[10px]">Add Q&A</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete ${round.roundName || 'this round'}?`)) {
                        deleteRound(interview.id, round.id);
                      }
                    }}
                    title="Delete Round"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              }
            >
              {/* Round Details Box */}
              {round.notes && (
                <div className="mb-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-300 mb-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Round Notes & Feedback:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans">{round.notes}</p>
                </div>
              )}

              {/* Collapsible Q&A Sub-Branch */}
              <div className="mt-2">
                <div className="flex items-center justify-between gap-2 mb-2 p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-semibold text-slate-200">
                      Questions & Answers ({qas.length})
                    </span>
                  </div>

                  {qas.length > 0 && (
                    <button
                      type="button"
                      onClick={(e) => handleCopyQAList(e, round)}
                      className={`p-1 px-2 rounded-md border text-[11px] font-medium transition-all flex items-center gap-1 ${
                        copiedQASectionRoundId === round.id
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800/70 hover:bg-brand-600 text-slate-300 hover:text-white border-slate-700/60'
                      }`}
                    >
                      {copiedQASectionRoundId === round.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy All Q&As</span>
                    </button>
                  )}
                </div>

                {/* List of QA Nodes */}
                <div className="space-y-1.5">
                  {qas.length === 0 && !activeRoundForQA && (
                    <div className="p-2.5 text-[11px] text-slate-500 rounded-lg bg-slate-950/30 border border-slate-800/50 italic">
                      No questions recorded for this round yet. Click &quot;Add Q&A&quot; to log interview prompts and your answers.
                    </div>
                  )}

                  {qas.map((qa, qIdx) => (
                    <QAItemNode
                      key={qa.id}
                      qa={qa}
                      index={qIdx}
                      interviewId={interview.id}
                      roundId={round.id}
                    />
                  ))}
                </div>

                {/* Add QA Inline Form */}
                {activeRoundForQA === round.id && (
                  <form
                    onSubmit={(e) => handleSaveNewQA(e, round.id)}
                    className="mt-2.5 p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-2.5 animate-fade-in"
                  >
                    <div className="text-xs font-semibold text-amber-300">
                      Log New Interview Question & Answer
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Question asked (e.g. How does garbage collection work in V8?)"
                        value={newQA.question}
                        onChange={(e) => setNewQA({ ...newQA, question: e.target.value })}
                        required
                        className="w-full glass-input text-xs"
                        autoFocus
                      />
                      <input
                        type="text"
                        placeholder="Topic / Category (e.g. Memory Management, System Design, Behavioral)"
                        value={newQA.topic}
                        onChange={(e) => setNewQA({ ...newQA, topic: e.target.value })}
                        className="w-full glass-input text-xs"
                      />
                      <textarea
                        placeholder="Your Answer / Key Talking Points / Code snippet..."
                        value={newQA.answer}
                        onChange={(e) => setNewQA({ ...newQA, answer: e.target.value })}
                        rows={3}
                        className="w-full glass-input text-xs font-mono"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveRoundForQA(null)}
                        className="px-3 py-1 text-xs rounded-lg text-slate-400 hover:text-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-medium"
                      >
                        Save Q&A
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </TreeNode>
          );
        })}

        {/* Add Round Inline Form */}
        {isAddingRound && (
          <form
            onSubmit={handleSaveNewRound}
            className="p-3.5 rounded-xl bg-slate-900/90 border border-purple-500/30 space-y-3 animate-fade-in"
          >
            <div className="text-xs font-semibold text-purple-300">Add Interview Round</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Round Name (e.g. Round 2: System Design) *"
                value={newRound.roundName}
                onChange={(e) => setNewRound({ ...newRound, roundName: e.target.value })}
                required
                className="glass-input text-xs sm:col-span-2"
                autoFocus
              />
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Date</label>
                <input
                  type="date"
                  value={newRound.date}
                  onChange={(e) => setNewRound({ ...newRound, date: e.target.value })}
                  className="w-full glass-input text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Status</label>
                <select
                  value={newRound.status}
                  onChange={(e) => setNewRound({ ...newRound, status: e.target.value })}
                  className="w-full glass-input text-xs"
                >
                  {Object.values(ROUND_STATUS).map((st) => (
                    <option key={st} value={st} className="bg-slate-900">
                      {st}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                placeholder="Interviewer Name (Optional)"
                value={newRound.interviewerName}
                onChange={(e) => setNewRound({ ...newRound, interviewerName: e.target.value })}
                className="glass-input text-xs"
              />
              <input
                type="text"
                placeholder="Notes / Focus areas"
                value={newRound.notes}
                onChange={(e) => setNewRound({ ...newRound, notes: e.target.value })}
                className="glass-input text-xs"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingRound(false)}
                className="px-3 py-1 text-xs rounded-lg text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium"
              >
                Save Round
              </button>
            </div>
          </form>
        )}
      </div>
    </TreeNode>
  );
};
