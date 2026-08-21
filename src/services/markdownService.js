/**
 * Markdown Export Service for Interview Tracker
 * Converts any level of the interview hierarchy into formatted Markdown.
 */

export const copyTextToClipboard = async (text) => {
  if (!text) return false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers / non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};

/**
 * Format Single Question & Answer
 */
export const generateSingleQAMarkdown = (qa, index = null) => {
  if (!qa) return '';
  const prefix = index !== null ? `### Q${index + 1}: ` : '### ';
  let md = `${prefix}${qa.question || 'Untitled Question'}\n\n`;
  if (qa.topic) {
    md += `*Topic:* \`${qa.topic}\`\n\n`;
  }
  md += `**Answer / Key Talking Points:**\n`;
  md += `> ${qa.answer ? qa.answer.replace(/\n/g, '\n> ') : '_No answer recorded yet._'}\n`;
  return md.trim();
};

/**
 * Format List of Questions & Answers
 */
export const generateQAListMarkdown = (qas = [], roundName = '') => {
  if (!qas || qas.length === 0) return '_No questions & answers recorded._\n';
  let md = roundName ? `### 💬 Questions & Answers (${roundName})\n\n` : `### 💬 Questions & Answers\n\n`;
  qas.forEach((qa, idx) => {
    md += generateSingleQAMarkdown(qa, idx) + '\n\n---\n\n';
  });
  return md.trim();
};

/**
 * Format Single Round
 */
export const generateSingleRoundMarkdown = (round, index = null) => {
  if (!round) return '';
  const title = index !== null ? `## Round ${index + 1}: ${round.roundName || 'Unnamed Round'}` : `## ${round.roundName || 'Unnamed Round'}`;
  let md = `${title}\n\n`;
  md += `- **Date:** ${round.date || 'TBD'}\n`;
  md += `- **Status:** \`${round.status || 'Scheduled'}\`\n`;
  if (round.interviewerName) {
    md += `- **Interviewer:** ${round.interviewerName}\n`;
  }
  if (round.notes) {
    md += `- **Round Notes & Feedback:** ${round.notes}\n`;
  }
  md += '\n';

  if (round.questionsAnswers && round.questionsAnswers.length > 0) {
    md += `### Questions & Answers (${round.questionsAnswers.length})\n\n`;
    round.questionsAnswers.forEach((qa, qIdx) => {
      md += `#### Q${qIdx + 1}: ${qa.question || 'Untitled Question'}\n`;
      if (qa.topic) md += `*Topic:* \`${qa.topic}\`\n\n`;
      md += `> ${qa.answer ? qa.answer.replace(/\n/g, '\n> ') : '_No answer recorded._'}\n\n`;
    });
  } else {
    md += `*No questions recorded for this round yet.*\n\n`;
  }
  return md.trim();
};

/**
 * Format All Rounds
 */
export const generateRoundsMarkdown = (rounds = []) => {
  if (!rounds || rounds.length === 0) return '_No interview rounds scheduled yet._\n';
  let md = `# 🎯 Interview Rounds & Q&A Breakdown (${rounds.length} Total)\n\n`;
  rounds.forEach((round, idx) => {
    md += generateSingleRoundMarkdown(round, idx) + '\n\n==============================\n\n';
  });
  return md.trim();
};

/**
 * Format Single HR Contact
 */
export const generateSingleHRContactMarkdown = (contact) => {
  if (!contact) return '';
  let md = `### 👤 ${contact.name || 'Unnamed Contact'}\n`;
  if (contact.email) md += `- **Email:** [${contact.email}](mailto:${contact.email})\n`;
  if (contact.phone) md += `- **Phone:** ${contact.phone}\n`;
  if (contact.notes) md += `- **Notes:** ${contact.notes}\n`;
  return md.trim();
};

/**
 * Format List of HR Contacts
 */
export const generateHRContactsMarkdown = (contacts = []) => {
  if (!contacts || contacts.length === 0) return '_No HR contacts recorded._\n';
  let md = `## 👥 HR & Talent Acquisition Contacts (${contacts.length})\n\n`;
  md += `| Name | Email | Phone | Notes |\n`;
  md += `| :--- | :--- | :--- | :--- |\n`;
  contacts.forEach((c) => {
    md += `| **${c.name || '-'}** | ${c.email ? `[${c.email}](mailto:${c.email})` : '-'} | ${c.phone || '-'} | ${c.notes || '-'} |\n`;
  });
  return md.trim();
};

/**
 * Format Single Interviewer
 */
export const generateSingleInterviewerMarkdown = (interviewer) => {
  if (!interviewer) return '';
  let md = `### 🧑‍💻 ${interviewer.name || 'Unnamed Interviewer'}\n`;
  if (interviewer.role) md += `- **Role / Title:** ${interviewer.role}\n`;
  if (interviewer.linkedIn) md += `- **LinkedIn:** [Profile Link](${interviewer.linkedIn})\n`;
  if (interviewer.notes) md += `- **Notes:** ${interviewer.notes}\n`;
  return md.trim();
};

/**
 * Format List of Interviewers
 */
export const generateInterviewersMarkdown = (interviewers = []) => {
  if (!interviewers || interviewers.length === 0) return '_No interviewer details recorded._\n';
  let md = `## 🧑‍💻 Technical & Leadership Interviewers (${interviewers.length})\n\n`;
  md += `| Name | Role / Title | LinkedIn | Notes |\n`;
  md += `| :--- | :--- | :--- | :--- |\n`;
  interviewers.forEach((i) => {
    md += `| **${i.name || '-'}** | ${i.role || '-'} | ${i.linkedIn ? `[LinkedIn](${i.linkedIn})` : '-'} | ${i.notes || '-'} |\n`;
  });
  return md.trim();
};

/**
 * Format Overview Details
 */
export const generateOverviewMarkdown = (interview) => {
  if (!interview) return '';
  let md = `## 📋 Company & Position Overview\n\n`;
  md += `- **Company:** ${interview.companyName || 'N/A'}\n`;
  md += `- **Job Role:** ${interview.jobTitle || 'N/A'}\n`;
  md += `- **Company Size:** ${interview.companySize || 'N/A'}\n`;
  md += `- **Expected CTC:** ${interview.expectedCtc || 'N/A'}\n`;
  md += `- **Status:** \`${interview.applicationStatus || 'Applied'}\`\n`;
  if (interview.location) md += `- **Location:** ${interview.location}\n`;
  if (interview.appliedDate) md += `- **Applied Date:** ${interview.appliedDate}\n`;
  if (interview.jobLink) md += `- **Job Posting:** [Link](${interview.jobLink})\n`;
  if (interview.notes) md += `\n**General Notes:**\n> ${interview.notes.replace(/\n/g, '\n> ')}\n`;
  return md.trim();
};

/**
 * Full Company / Interview Profile Markdown
 */
export const generateCompanyMarkdown = (interview) => {
  if (!interview) return '';
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  
  let md = `# 🏢 Interview Dossier: ${interview.companyName || 'Company'}\n`;
  md += `*Exported from InterviewTracker on ${dateStr}*\n\n`;
  md += `---\n\n`;

  // Overview
  md += generateOverviewMarkdown(interview) + '\n\n';
  md += `---\n\n`;

  // HR Contacts
  if (interview.hrContacts && interview.hrContacts.length > 0) {
    md += generateHRContactsMarkdown(interview.hrContacts) + '\n\n';
    md += `---\n\n`;
  }

  // Interviewers
  if (interview.interviewers && interview.interviewers.length > 0) {
    md += generateInterviewersMarkdown(interview.interviewers) + '\n\n';
    md += `---\n\n`;
  }

  // Rounds & Q&A
  if (interview.rounds && interview.rounds.length > 0) {
    md += generateRoundsMarkdown(interview.rounds) + '\n';
  } else {
    md += `## 🎯 Interview Rounds\n*No rounds scheduled yet.*\n`;
  }

  return md.trim();
};
