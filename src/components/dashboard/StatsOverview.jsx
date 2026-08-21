import React from 'react';
import { Briefcase, Calendar, Award, XCircle, DollarSign, MessageSquare, Layers } from 'lucide-react';
import { useInterviews } from '../../context/InterviewContext';

export const StatsOverview = () => {
  const { stats, setActiveTab, setStatusFilter } = useInterviews();

  const cards = [
    {
      title: 'Active Loops',
      value: stats.interviewing,
      subtitle: `${stats.total} total tracked`,
      icon: <Calendar className="w-5 h-5 text-purple-400" />,
      bg: 'from-purple-500/15 via-purple-500/5 to-transparent border-purple-500/30',
      onClick: () => {
        setStatusFilter('Interviewing');
        setActiveTab('cards');
      }
    },
    {
      title: 'Offers Received',
      value: stats.offered,
      subtitle: 'Success status',
      icon: <Award className="w-5 h-5 text-emerald-400" />,
      bg: 'from-emerald-500/15 via-emerald-500/5 to-transparent border-emerald-500/30',
      onClick: () => {
        setStatusFilter('Offered');
        setActiveTab('cards');
      }
    },
    {
      title: 'Interview Rounds',
      value: stats.totalRounds,
      subtitle: 'Across all stages',
      icon: <Layers className="w-5 h-5 text-sky-400" />,
      bg: 'from-sky-500/15 via-sky-500/5 to-transparent border-sky-500/30',
      onClick: () => setActiveTab('tree')
    },
    {
      title: 'Q&A Bank',
      value: stats.totalQAs,
      subtitle: 'Archived questions',
      icon: <MessageSquare className="w-5 h-5 text-amber-400" />,
      bg: 'from-amber-500/15 via-amber-500/5 to-transparent border-amber-500/30',
      onClick: () => setActiveTab('knowledge')
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          onClick={card.onClick}
          className={`glass-panel rounded-2xl p-4 sm:p-5 border bg-gradient-to-b ${card.bg} hover:border-slate-600/80 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
              {card.title}
            </span>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 shrink-0">
              {card.icon}
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              {card.value}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {card.subtitle}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
