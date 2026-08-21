import React, { useState } from 'react';
import { Users, Mail, Phone, Plus, Copy, Check, Trash2, Edit, FileText } from 'lucide-react';
import { TreeNode } from './TreeNode';
import { 
  generateHRContactsMarkdown, 
  generateSingleHRContactMarkdown, 
  copyTextToClipboard 
} from '../../../services/markdownService';
import { useInterviews } from '../../../context/InterviewContext';
import { createEmptyHRContact } from '../../../types/interview';

export const ContactsSubtree = ({ interview, level = 1 }) => {
  const { updateInterview, showToast } = useInterviews();
  const contacts = interview.hrContacts || [];
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState(createEmptyHRContact());
  const [copiedId, setCopiedId] = useState(null);

  const allContactsMarkdown = generateHRContactsMarkdown(contacts);

  const handleCopySingle = async (e, contact) => {
    e.stopPropagation();
    const md = generateSingleHRContactMarkdown(contact);
    const success = await copyTextToClipboard(md);
    if (success) {
      setCopiedId(contact.id);
      showToast(`Copied contact info for ${contact.name || 'HR'}!`);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleDelete = (contactId) => {
    const updated = contacts.filter((c) => c.id !== contactId);
    updateInterview(interview.id, { hrContacts: updated });
  };

  const handleSaveNew = (e) => {
    e.preventDefault();
    if (!newContact.name.trim()) return;
    const updated = [...contacts, newContact];
    updateInterview(interview.id, { hrContacts: updated });
    setNewContact(createEmptyHRContact());
    setIsAdding(false);
  };

  return (
    <TreeNode
      title="HR & Talent Contacts"
      subtitle={`${contacts.length} recruiter${contacts.length === 1 ? '' : 's'} / coordinator${contacts.length === 1 ? '' : 's'}`}
      icon={<Users className="w-4 h-4 text-cyan-400" />}
      badge={
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
          {contacts.length}
        </span>
      }
      markdownText={allContactsMarkdown}
      copyLabel="Copy all HR contacts as Markdown table"
      level={level}
      actions={
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs flex items-center gap-1 transition-all"
          title="Add HR Contact"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Add HR</span>
        </button>
      }
    >
      {/* Contact Cards */}
      <div className="space-y-2.5 mt-2">
        {contacts.length === 0 && !isAdding && (
          <div className="p-3 text-xs text-slate-500 rounded-xl bg-slate-950/40 border border-slate-800/60 italic">
            No HR contacts added yet. Click &quot;Add HR&quot; to track recruiters.
          </div>
        )}

        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-100">
                  {contact.name || 'Unnamed Recruiter'}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
                  >
                    <Mail className="w-3 h-3 text-cyan-400" />
                    <span>{contact.email}</span>
                  </a>
                )}
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
                  >
                    <Phone className="w-3 h-3 text-cyan-400" />
                    <span>{contact.phone}</span>
                  </a>
                )}
              </div>
              {contact.notes && (
                <div className="mt-1 text-[11px] text-slate-500 flex items-start gap-1">
                  <FileText className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                  <span>{contact.notes}</span>
                </div>
              )}
            </div>

            {/* Individual Contact Actions */}
            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={(e) => handleCopySingle(e, contact)}
                title="Copy this contact as Markdown"
                className={`p-1.5 rounded-lg border text-xs transition-all flex items-center gap-1 ${
                  copiedId === contact.id
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700/60'
                }`}
              >
                {copiedId === contact.id ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span className="text-[10px]">{copiedId === contact.id ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDelete(contact.id)}
                title="Delete Contact"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Add Contact Inline Form */}
        {isAdding && (
          <form
            onSubmit={handleSaveNew}
            className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-3 animate-fade-in"
          >
            <div className="text-xs font-semibold text-cyan-300">Add Recruiter / HR Contact</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Full Name *"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                required
                className="glass-input text-xs"
                autoFocus
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                className="glass-input text-xs"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="glass-input text-xs"
              />
              <input
                type="text"
                placeholder="Role / Notes (e.g., Primary recruiter)"
                value={newContact.notes}
                onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                className="glass-input text-xs"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 text-xs rounded-lg text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium"
              >
                Save Contact
              </button>
            </div>
          </form>
        )}
      </div>
    </TreeNode>
  );
};
