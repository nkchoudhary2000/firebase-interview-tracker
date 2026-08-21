import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Tag, 
  Copy, 
  Check, 
  Building2, 
  Filter, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useInterviews } from '../../context/InterviewContext';
import { generateSingleQAMarkdown, copyTextToClipboard } from '../../services/markdownService';

export const KnowledgeBankView = () => {
  const { interviews, showToast } = useInterviews();
  const [bankSearch, setBankSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);

  // Flatten all Q&As with company and round metadata
  const allQuestions = [];
  interviews.forEach((interview) => {
    (interview.rounds || []).forEach((round) => {
      (round.questionsAnswers || []).forEach((qa) => {
        allQuestions.push({
          ...qa,
          companyName: interview.companyName,
          companyId: interview.id,
          roundName: round.roundName,
          roundDate: round.date
        });
      });
    });
  });

  // Extract unique topics
  const topics = ['ALL', ...Array.from(new Set(allQuestions.map((q) => q.topic).filter(Boolean)))];

  // Filter questions
  const filtered = allQuestions.filter((q) => {
    const matchesSearch =
      bankSearch === '' ||
      q.question?.toLowerCase().includes(bankSearch.toLowerCase()) ||
      q.answer?.toLowerCase().includes(bankSearch.toLowerCase()) ||
      q.companyName?.toLowerCase().includes(bankSearch.toLowerCase()) ||
      q.topic?.toLowerCase().includes(bankSearch.toLowerCase());

    const matchesTopic = selectedTopic === 'ALL' || q.topic === selectedTopic;

    return matchesSearch && matchesTopic;
  });

  const handleCopySingle = async (item) => {
    const md = generateSingleQAMarkdown(item);
    const success = await copyTextToClipboard(md);
    if (success) {
      setCopiedId(item.id);
      showToast('Copied Q&A as Markdown!');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleCopyAllFiltered = async () => {
    if (filtered.length === 0) return;
    let md = `# 🧠 Interview Preparation Knowledge Bank (${filtered.length} Questions)\n\n`;
    filtered.forEach((item, idx) => {
      md += `### Q${idx + 1}: ${item.question}\n`;
      md += `*Company:* **${item.companyName}** | *Round:* \`${item.roundName}\`${item.topic ? ` | *Topic:* \`${item.topic}\`` : ''}\n\n`;
      md += `> ${item.answer ? item.answer.replace(/\n/g, '\n> ') : '_No answer recorded._'}\n\n---\n\n`;
    });
    const success = await copyTextToClipboard(md.trim());
    if (success) {
      showToast(`Copied ${filtered.length} questions as a study cheat-sheet!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Knowledge Bank Hero & Search Bar */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-slate-100">
                Central Q&A Knowledge Bank & Cheat-Sheet
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Search, review, and export technical questions asked during your interviews across all companies.
            </p>
          </div>

          <button
            onClick={handleCopyAllFiltered}
            disabled={filtered.length === 0}
            className="glass-button-primary text-xs py-2 px-3.5 shrink-0"
          >
            <Copy className="w-4 h-4" />
            <span>Copy Filtered ({filtered.length}) as Study Guide</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions by topic, keywords, or company (e.g. Distributed Systems, V8, Idempotency)..."
            value={bankSearch}
            onChange={(e) => setBankSearch(e.target.value)}
            className="w-full glass-input pl-10 pr-4 py-2.5 text-xs"
          />
        </div>

        {/* Topic Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1 rounded-xl whitespace-nowrap font-medium text-xs transition-all ${
                selectedTopic === t
                  ? 'bg-amber-600 text-white shadow-glow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {t === 'ALL' ? 'All Topics' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center border border-slate-800 text-slate-400 text-xs">
            No questions match your current search or topic filter.
          </div>
        ) : (
          filtered.map((item, idx) => (
            <div
              key={item.id || idx}
              className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800/80 hover:border-slate-700/80 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 shrink-0 mt-0.5">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-slate-100">
                      {item.question}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                      <span className="font-medium text-brand-300 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {item.companyName}
                      </span>
                      <span>•</span>
                      <span className="text-slate-400">{item.roundName}</span>
                      {item.topic && (
                        <>
                          <span>•</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                            {item.topic}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopySingle(item)}
                  className={`p-2 rounded-lg border text-xs transition-all flex items-center gap-1 shrink-0 ${
                    copiedId === item.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700/80'
                  }`}
                  title="Copy Q&A as Markdown"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span className="text-[11px] hidden sm:inline">
                    {copiedId === item.id ? 'Copied' : 'Copy'}
                  </span>
                </button>
              </div>

              {/* Answer Content */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-line">
                {item.answer || <span className="text-slate-500 italic">No answer notes logged.</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
