/**
 * Interview Tracker Data Models and Schema Definitions
 */

export const APPLICATION_STATUS = {
  APPLIED: 'Applied',
  SCREENING: 'Screening',
  INTERVIEWING: 'Interviewing',
  OFFERED: 'Offered',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn'
};

export const STATUS_CONFIG = {
  [APPLICATION_STATUS.APPLIED]: {
    label: 'Applied',
    color: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    dot: 'bg-blue-400',
    icon: 'Send'
  },
  [APPLICATION_STATUS.SCREENING]: {
    label: 'Screening',
    color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    dot: 'bg-cyan-400',
    icon: 'PhoneCall'
  },
  [APPLICATION_STATUS.INTERVIEWING]: {
    label: 'Interviewing',
    color: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    dot: 'bg-purple-400',
    icon: 'Calendar'
  },
  [APPLICATION_STATUS.OFFERED]: {
    label: 'Offered',
    color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    dot: 'bg-emerald-400',
    icon: 'Award'
  },
  [APPLICATION_STATUS.ACCEPTED]: {
    label: 'Accepted',
    color: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    dot: 'bg-teal-400',
    icon: 'CheckCircle2'
  },
  [APPLICATION_STATUS.REJECTED]: {
    label: 'Rejected',
    color: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    dot: 'bg-rose-400',
    icon: 'XCircle'
  },
  [APPLICATION_STATUS.WITHDRAWN]: {
    label: 'Withdrawn',
    color: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    dot: 'bg-slate-400',
    icon: 'MinusCircle'
  }
};

export const ROUND_STATUS = {
  SCHEDULED: 'Scheduled',
  CLEARED: 'Cleared',
  FAILED: 'Failed',
  PENDING_FEEDBACK: 'Pending Feedback'
};

export const ROUND_STATUS_CONFIG = {
  [ROUND_STATUS.SCHEDULED]: {
    label: 'Scheduled',
    color: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
  },
  [ROUND_STATUS.CLEARED]: {
    label: 'Cleared',
    color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
  },
  [ROUND_STATUS.FAILED]: {
    label: 'Did not clear',
    color: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
  },
  [ROUND_STATUS.PENDING_FEEDBACK]: {
    label: 'Pending Feedback',
    color: 'bg-sky-500/15 text-sky-300 border-sky-500/30'
  }
};

export const createEmptyInterview = () => ({
  companyName: '',
  companySize: '',
  expectedCtc: '',
  applicationStatus: APPLICATION_STATUS.APPLIED,
  jobTitle: '',
  location: '',
  jobLink: '',
  appliedDate: new Date().toISOString().split('T')[0],
  notes: '',
  tags: [],
  hrContacts: [],
  interviewers: [],
  rounds: []
});

export const createEmptyHRContact = () => ({
  id: 'hr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
  name: '',
  email: '',
  phone: '',
  notes: ''
});

export const createEmptyInterviewer = () => ({
  id: 'int_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
  name: '',
  role: '',
  linkedIn: '',
  notes: ''
});

export const createEmptyRound = () => ({
  id: 'rnd_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
  roundName: '',
  date: new Date().toISOString().split('T')[0],
  status: ROUND_STATUS.SCHEDULED,
  interviewerName: '',
  notes: '',
  questionsAnswers: []
});

export const createEmptyQA = () => ({
  id: 'qa_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
  question: '',
  answer: '',
  topic: ''
});
