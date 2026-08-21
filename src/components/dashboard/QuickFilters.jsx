import React from 'react';
import { Search, SlidersHorizontal, Plus, Sparkles, Filter } from 'lucide-react';
import { useInterviews } from '../../context/InterviewContext';
import { APPLICATION_STATUS } from '../../types/interview';

export const QuickFilters = ({ onOpenAddModal }) => {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    interviews,
    loadSampleData
  } = useInterviews();

  const statuses = [
    { id: 'ALL', label: 'All Companies', count: interviews.length },
    { id: APPLICATION_STATUS.INTERVIEWING, label: 'Interviewing', count: interviews.filter(i => i.applicationStatus === APPLICATION_STATUS.INTERVIEWING).length },
    { id: APPLICATION_STATUS.OFFERED, label: 'Offered', count: interviews.filter(i => i.applicationStatus === APPLICATION_STATUS.OFFERED || i.applicationStatus === APPLICATION_STATUS.ACCEPTED).length },
    { id: APPLICATION_STATUS.APPLIED, label: 'Applied', count: interviews.filter(i => i.applicationStatus === APPLICATION_STATUS.APPLIED || i.applicationStatus === APPLICATION_STATUS.SCREENING).length },
    { id: APPLICATION_STATUS.REJECTED, label: 'Rejected', count: interviews.filter(i => i.applicationStatus === APPLICATION_STATUS.REJECTED).length }
  ];

  return (
    <div className="space-y-3 mb-6">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search companies, roles, topics, or tags (e.g., Stripe, Staff, Fintech)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input pl-10 pr-4 py-2.5 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort & Action controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs"
            >
              <option value="updated" className="bg-slate-900">Recently Updated</option>
              <option value="appliedDate" className="bg-slate-900">Applied Date</option>
              <option value="company" className="bg-slate-900">Company Name (A-Z)</option>
            </select>
          </div>

          <button
            onClick={onOpenAddModal}
            className="glass-button-primary py-2.5 px-4 text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Add Interview</span>
          </button>
        </div>
      </div>

      {/* Filter Status Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {statuses.map((s) => {
          const isActive = statusFilter === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setStatusFilter(s.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 font-medium ${
                isActive
                  ? 'bg-brand-600 text-white shadow-glow-sm'
                  : 'bg-slate-900/70 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              <span>{s.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {s.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
