import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  DollarSign, 
  Users, 
  UserCheck, 
  Calendar, 
  HelpCircle, 
  Plus, 
  Trash2, 
  X, 
  Check,
  Briefcase,
  Link as LinkIcon,
  MapPin,
  Tag,
  Search,
  Loader2
} from 'lucide-react';
import { 
  createEmptyInterview, 
  createEmptyHRContact, 
  createEmptyInterviewer, 
  createEmptyRound, 
  createEmptyQA,
  APPLICATION_STATUS, 
  ROUND_STATUS 
} from '../../types/interview';
import { searchCompanyNames } from '../../services/companySearchService';

export const InterviewFormModal = ({
  isOpen,
  initialData = null,
  onClose,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState('company'); // 'company' | 'contacts' | 'interviewers' | 'rounds'
  const [formData, setFormData] = useState(createEmptyInterview());
  const [tagInput, setTagInput] = useState('');

  // Company Name Google-style suggestion state
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [isSearchingCompanies, setIsSearchingCompanies] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...createEmptyInterview(),
        ...initialData,
        hrContacts: initialData.hrContacts || [],
        interviewers: initialData.interviewers || [],
        rounds: initialData.rounds || []
      });
    } else {
      setFormData(createEmptyInterview());
    }
    setActiveTab('company');
    setCompanySuggestions([]);
    setShowCompanyDropdown(false);
    setSelectedSuggestionIndex(-1);
  }, [initialData, isOpen]);

  // Click outside to close suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCompanyDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // Handle typing in Company Name input
  const handleCompanyNameChange = (value) => {
    setFormData((prev) => ({ ...prev, companyName: value }));
    setSelectedSuggestionIndex(-1);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value || !value.trim()) {
      setCompanySuggestions([]);
      setShowCompanyDropdown(false);
      return;
    }

    setIsSearchingCompanies(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const names = await searchCompanyNames(value);
        setCompanySuggestions(names);
        setShowCompanyDropdown(names.length > 0);
      } catch (err) {
        console.warn('Company search error:', err);
      } finally {
        setIsSearchingCompanies(false);
      }
    }, 150);
  };

  // Only set the company name when clicked, leave all other fields blank for manual user entry
  const handleSelectCompanyName = (companyName) => {
    setFormData((prev) => ({
      ...prev,
      companyName: companyName
    }));
    setShowCompanyDropdown(false);
    setCompanySuggestions([]);
  };

  // Keyboard navigation for suggestion dropdown
  const handleCompanyInputKeyDown = (e) => {
    if (!showCompanyDropdown || companySuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev + 1) % companySuggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev - 1 + companySuggestions.length) % companySuggestions.length);
    } else if (e.key === 'Enter') {
      if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < companySuggestions.length) {
        e.preventDefault();
        handleSelectCompanyName(companySuggestions[selectedSuggestionIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowCompanyDropdown(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.companyName.trim()) {
      setActiveTab('company');
      return;
    }
    onSave(formData);
    onClose();
  };

  // Tag helper
  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, '');
      if (val && !formData.tags?.includes(val)) {
        setFormData({ ...formData, tags: [...(formData.tags || []), val] });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter((t) => t !== tagToRemove)
    });
  };

  // HR Contacts
  const handleAddContact = () => {
    setFormData({
      ...formData,
      hrContacts: [...(formData.hrContacts || []), createEmptyHRContact()]
    });
  };

  const handleUpdateContact = (index, field, value) => {
    const updated = [...(formData.hrContacts || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, hrContacts: updated });
  };

  const handleRemoveContact = (index) => {
    setFormData({
      ...formData,
      hrContacts: (formData.hrContacts || []).filter((_, i) => i !== index)
    });
  };

  // Interviewers
  const handleAddInterviewer = () => {
    setFormData({
      ...formData,
      interviewers: [...(formData.interviewers || []), createEmptyInterviewer()]
    });
  };

  const handleUpdateInterviewer = (index, field, value) => {
    const updated = [...(formData.interviewers || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, interviewers: updated });
  };

  const handleRemoveInterviewer = (index) => {
    setFormData({
      ...formData,
      interviewers: (formData.interviewers || []).filter((_, i) => i !== index)
    });
  };

  // Rounds
  const handleAddRound = () => {
    setFormData({
      ...formData,
      rounds: [...(formData.rounds || []), createEmptyRound()]
    });
  };

  const handleUpdateRound = (index, field, value) => {
    const updated = [...(formData.rounds || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, rounds: updated });
  };

  const handleRemoveRound = (index) => {
    setFormData({
      ...formData,
      rounds: (formData.rounds || []).filter((_, i) => i !== index)
    });
  };

  // Q&A inside a round
  const handleAddQA = (roundIndex) => {
    const updatedRounds = [...(formData.rounds || [])];
    const currentQAs = updatedRounds[roundIndex].questionsAnswers || [];
    updatedRounds[roundIndex] = {
      ...updatedRounds[roundIndex],
      questionsAnswers: [...currentQAs, createEmptyQA()]
    };
    setFormData({ ...formData, rounds: updatedRounds });
  };

  const handleUpdateQA = (roundIndex, qaIndex, field, value) => {
    const updatedRounds = [...(formData.rounds || [])];
    const qas = [...(updatedRounds[roundIndex].questionsAnswers || [])];
    qas[qaIndex] = { ...qas[qaIndex], [field]: value };
    updatedRounds[roundIndex] = { ...updatedRounds[roundIndex], questionsAnswers: qas };
    setFormData({ ...formData, rounds: updatedRounds });
  };

  const handleRemoveQA = (roundIndex, qaIndex) => {
    const updatedRounds = [...(formData.rounds || [])];
    updatedRounds[roundIndex] = {
      ...updatedRounds[roundIndex],
      questionsAnswers: (updatedRounds[roundIndex].questionsAnswers || []).filter((_, i) => i !== qaIndex)
    };
    setFormData({ ...formData, rounds: updatedRounds });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col border border-slate-700/90 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {initialData ? `Edit Interview: ${initialData.companyName}` : 'Add New Interview Dossier'}
              </h3>
              <p className="text-xs text-slate-400">
                Search company name with Google-style suggestions, and fill in your interview details manually.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 text-xs overflow-x-auto no-scrollbar">
          {[
            { id: 'company', label: '1. Company & Role', icon: <Briefcase className="w-3.5 h-3.5" /> },
            { id: 'contacts', label: `2. HR Contacts (${formData.hrContacts?.length || 0})`, icon: <Users className="w-3.5 h-3.5" /> },
            { id: 'interviewers', label: `3. Interviewers (${formData.interviewers?.length || 0})`, icon: <UserCheck className="w-3.5 h-3.5" /> },
            { id: 'rounds', label: `4. Rounds & Q&A (${formData.rounds?.length || 0})`, icon: <Calendar className="w-3.5 h-3.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium flex items-center gap-1.5 transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-glow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
            {/* Tab 1: Company Overview */}
            {activeTab === 'company' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Company Name with Google Search Style Suggestions */}
                  <div className="relative" ref={dropdownRef}>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Company Name <span className="text-rose-400">*</span>
                    </label>

                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search company (e.g. Google, Stripe, Microsoft)..."
                        value={formData.companyName}
                        onChange={(e) => handleCompanyNameChange(e.target.value)}
                        onKeyDown={handleCompanyInputKeyDown}
                        onFocus={() => {
                          if (companySuggestions.length > 0) setShowCompanyDropdown(true);
                        }}
                        required
                        className="w-full glass-input pr-9"
                        autoFocus
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        {isSearchingCompanies ? (
                          <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                        ) : (
                          <Search className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                    </div>

                    {/* Google Style Autocomplete Dropdown */}
                    {showCompanyDropdown && companySuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl glass-panel border border-slate-700/90 shadow-2xl bg-slate-900/95 overflow-hidden divide-y divide-slate-800/80 animate-fade-in max-h-60 overflow-y-auto">
                        {companySuggestions.map((name, idx) => {
                          const isSelected = selectedSuggestionIndex === idx;
                          return (
                            <div
                              key={name + idx}
                              onClick={() => handleSelectCompanyName(name)}
                              className={`px-3.5 py-2.5 cursor-pointer transition-colors flex items-center gap-2.5 select-none ${
                                isSelected
                                  ? 'bg-brand-600 text-white'
                                  : 'hover:bg-slate-800/80 text-slate-200'
                              }`}
                            >
                              <Search className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                              <span className="text-xs font-medium truncate">{name}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Target Role / Job Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Software Engineer"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      className="w-full glass-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Company Size / Employee Count
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 5,000+ employees"
                      value={formData.companySize}
                      onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                      className="w-full glass-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Expected CTC / Target Comp
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. $180,000 Base / ₹40 LPA"
                      value={formData.expectedCtc}
                      onChange={(e) => setFormData({ ...formData, expectedCtc: e.target.value })}
                      className="w-full glass-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Application Status
                    </label>
                    <select
                      value={formData.applicationStatus}
                      onChange={(e) => setFormData({ ...formData, applicationStatus: e.target.value })}
                      className="w-full glass-input"
                    >
                      {Object.values(APPLICATION_STATUS).map((st) => (
                        <option key={st} value={st} className="bg-slate-900">
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Location / Work Arrangement
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Remote / Hybrid / Bengaluru"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full glass-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Applied Date
                    </label>
                    <input
                      type="date"
                      value={formData.appliedDate}
                      onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                      className="w-full glass-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Job Posting / Careers Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.jobLink}
                      onChange={(e) => setFormData({ ...formData, jobLink: e.target.value })}
                      className="w-full glass-input"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Tags & Keywords (Press Enter or comma)
                  </label>
                  <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center gap-1.5">
                    {(formData.tags || []).map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1"
                      >
                        #{t}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Add tag (e.g. Fintech, FullStack)..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="bg-transparent text-xs text-slate-200 focus:outline-none flex-1 min-w-[140px] px-1 py-0.5"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Company Notes & Strategy
                  </label>
                  <textarea
                    placeholder="Enter your notes, prep strategy, referral info, etc..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full glass-input"
                  />
                </div>
              </div>
            )}

            {/* Tab 2: HR Contacts */}
            {activeTab === 'contacts' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cyan-300">
                    HR & Talent Acquisition Contacts
                  </span>
                  <button
                    type="button"
                    onClick={handleAddContact}
                    className="glass-button-secondary text-xs py-1.5 px-3"
                  >
                    <Plus className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Add Contact</span>
                  </button>
                </div>

                {(!formData.hrContacts || formData.hrContacts.length === 0) && (
                  <div className="p-6 text-center rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-500">
                    No HR contacts added yet. Click &quot;Add Contact&quot; to add recruiters.
                  </div>
                )}

                <div className="space-y-3">
                  {(formData.hrContacts || []).map((contact, idx) => (
                    <div
                      key={contact.id || idx}
                      className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 relative space-y-3 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300">
                          Recruiter #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveContact(idx)}
                          className="p-1 text-slate-500 hover:text-rose-400"
                          title="Remove contact"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Name *"
                          value={contact.name}
                          onChange={(e) => handleUpdateContact(idx, 'name', e.target.value)}
                          className="glass-input text-xs"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={contact.email}
                          onChange={(e) => handleUpdateContact(idx, 'email', e.target.value)}
                          className="glass-input text-xs"
                        />
                        <input
                          type="tel"
                          placeholder="Phone"
                          value={contact.phone}
                          onChange={(e) => handleUpdateContact(idx, 'phone', e.target.value)}
                          className="glass-input text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Role / Notes (e.g., Lead Technical Recruiter)"
                          value={contact.notes}
                          onChange={(e) => handleUpdateContact(idx, 'notes', e.target.value)}
                          className="glass-input text-xs sm:col-span-3"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Interviewers */}
            {activeTab === 'interviewers' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-300">
                    Interviewers & Panelists
                  </span>
                  <button
                    type="button"
                    onClick={handleAddInterviewer}
                    className="glass-button-secondary text-xs py-1.5 px-3"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Add Interviewer</span>
                  </button>
                </div>

                {(!formData.interviewers || formData.interviewers.length === 0) && (
                  <div className="p-6 text-center rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-500">
                    No interviewers added yet. Click &quot;Add Interviewer&quot; to track panel details.
                  </div>
                )}

                <div className="space-y-3">
                  {(formData.interviewers || []).map((interviewer, idx) => (
                    <div
                      key={interviewer.id || idx}
                      className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 relative space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300">
                          Interviewer #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveInterviewer(idx)}
                          className="p-1 text-slate-500 hover:text-rose-400"
                          title="Remove interviewer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Full Name *"
                          value={interviewer.name}
                          onChange={(e) => handleUpdateInterviewer(idx, 'name', e.target.value)}
                          className="glass-input text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Role / Title (e.g. Staff Architect)"
                          value={interviewer.role}
                          onChange={(e) => handleUpdateInterviewer(idx, 'role', e.target.value)}
                          className="glass-input text-xs"
                        />
                        <input
                          type="text"
                          placeholder="LinkedIn URL"
                          value={interviewer.linkedIn}
                          onChange={(e) => handleUpdateInterviewer(idx, 'linkedIn', e.target.value)}
                          className="glass-input text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Notes / Interview focus"
                          value={interviewer.notes}
                          onChange={(e) => handleUpdateInterviewer(idx, 'notes', e.target.value)}
                          className="glass-input text-xs sm:col-span-3"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Rounds & Q&A */}
            {activeTab === 'rounds' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-300">
                    Interview Rounds & Technical Q&A
                  </span>
                  <button
                    type="button"
                    onClick={handleAddRound}
                    className="glass-button-secondary text-xs py-1.5 px-3"
                  >
                    <Plus className="w-3.5 h-3.5 text-purple-400" />
                    <span>Add Round</span>
                  </button>
                </div>

                {(!formData.rounds || formData.rounds.length === 0) && (
                  <div className="p-6 text-center rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-500">
                    No interview rounds added yet. Click &quot;Add Round&quot; to begin building your loop.
                  </div>
                )}

                <div className="space-y-4">
                  {(formData.rounds || []).map((round, rIdx) => (
                    <div
                      key={round.id || rIdx}
                      className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold text-xs">
                            Round {rIdx + 1}
                          </span>
                          <span className="text-xs font-semibold text-slate-200">
                            {round.roundName || 'Untitled Stage'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveRound(rIdx)}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <input
                          type="text"
                          placeholder="Round Name *"
                          value={round.roundName}
                          onChange={(e) => handleUpdateRound(rIdx, 'roundName', e.target.value)}
                          className="glass-input text-xs sm:col-span-2"
                        />
                        <input
                          type="date"
                          value={round.date}
                          onChange={(e) => handleUpdateRound(rIdx, 'date', e.target.value)}
                          className="glass-input text-xs"
                        />
                        <select
                          value={round.status}
                          onChange={(e) => handleUpdateRound(rIdx, 'status', e.target.value)}
                          className="glass-input text-xs"
                        >
                          {Object.values(ROUND_STATUS).map((st) => (
                            <option key={st} value={st} className="bg-slate-900">
                              {st}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Interviewer Name"
                          value={round.interviewerName}
                          onChange={(e) => handleUpdateRound(rIdx, 'interviewerName', e.target.value)}
                          className="glass-input text-xs sm:col-span-2"
                        />
                        <input
                          type="text"
                          placeholder="Round Notes & Strategy"
                          value={round.notes}
                          onChange={(e) => handleUpdateRound(rIdx, 'notes', e.target.value)}
                          className="glass-input text-xs sm:col-span-2"
                        />
                      </div>

                      {/* Nested Q&A Section */}
                      <div className="pt-2 border-t border-slate-800/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5" />
                            Questions & Answers ({round.questionsAnswers?.length || 0})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAddQA(rIdx)}
                            className="p-1 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-[11px] flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Q&A</span>
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {(round.questionsAnswers || []).map((qa, qIdx) => (
                            <div
                              key={qa.id || qIdx}
                              className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-2 relative"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold text-amber-400">
                                  Q{qIdx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveQA(rIdx, qIdx)}
                                  className="text-slate-500 hover:text-rose-400 p-0.5"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <input
                                  type="text"
                                  placeholder="Question Asked *"
                                  value={qa.question}
                                  onChange={(e) => handleUpdateQA(rIdx, qIdx, 'question', e.target.value)}
                                  className="glass-input text-xs sm:col-span-2"
                                />
                                <input
                                  type="text"
                                  placeholder="Topic / Category"
                                  value={qa.topic}
                                  onChange={(e) => handleUpdateQA(rIdx, qIdx, 'topic', e.target.value)}
                                  className="glass-input text-xs"
                                />
                              </div>
                              <textarea
                                placeholder="Answer / Key Points / Code..."
                                value={qa.answer}
                                onChange={(e) => handleUpdateQA(rIdx, qIdx, 'answer', e.target.value)}
                                rows={2}
                                className="w-full glass-input text-xs font-mono"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center gap-2">
              {activeTab !== 'company' && (
                <button
                  type="button"
                  onClick={() => {
                    const tabs = ['company', 'contacts', 'interviewers', 'rounds'];
                    const prevIndex = tabs.indexOf(activeTab) - 1;
                    if (prevIndex >= 0) setActiveTab(tabs[prevIndex]);
                  }}
                  className="glass-button-secondary text-xs"
                >
                  Previous Step
                </button>
              )}
              {activeTab !== 'rounds' && (
                <button
                  type="button"
                  onClick={() => {
                    const tabs = ['company', 'contacts', 'interviewers', 'rounds'];
                    const nextIndex = tabs.indexOf(activeTab) + 1;
                    if (nextIndex < tabs.length) setActiveTab(tabs[nextIndex]);
                  }}
                  className="glass-button-secondary text-xs"
                >
                  Next Step
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="glass-button-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="glass-button-primary text-xs"
              >
                <Check className="w-4 h-4" />
                <span>Save Dossier</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
