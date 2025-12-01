import React, { useState } from 'react';
import { UserIcon, XIcon, CheckIcon, TrashIcon } from './Icons';
import { MappedEmail } from '../services/airtableService';

interface EmailListProps {
  emails: MappedEmail[];
  selectedEmailId: string | null;
  onSelectEmail: (email: MappedEmail) => void;
  onDiscard: (emailId: string) => void;
  t: any;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const EmailList: React.FC<EmailListProps> = ({ emails, selectedEmailId, onSelectEmail, onDiscard, t }) => {
  const [viewingEmail, setViewingEmail] = useState<MappedEmail | null>(null);

  const handleOpenEmail = (email: MappedEmail) => {
    setViewingEmail(email);
  };

  const handleConfirmSelection = () => {
    if (viewingEmail) {
      onSelectEmail(viewingEmail);
      setViewingEmail(null);
    }
  };

  const handleDiscard = () => {
    if (viewingEmail) {
      onDiscard(viewingEmail.id);
      setViewingEmail(null);
    }
  };

  return (
    <>
      <div className="h-full overflow-y-auto custom-scrollbar p-2">
        <ul className="space-y-2">
          {emails.map((email) => (
            <li
              key={email.id}
              onClick={() => handleOpenEmail(email)}
              className={`group p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${selectedEmailId === email.id
                ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800'
                : 'bg-white border-transparent hover:border-slate-200 hover:shadow-md dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:border-transparent dark:hover:border-slate-700'
                }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${selectedEmailId === email.id ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'}`}>
                  {selectedEmailId === email.id ? <CheckIcon className="w-5 h-5" /> : getInitials(email.senderName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <p className={`font-semibold text-sm truncate ${selectedEmailId === email.id ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-white'}`}>
                      {email.senderName}
                    </p>
                    <span className="text-[10px] text-slate-400">{new Date(email.receivedAt).toLocaleDateString()}</span>
                  </div>
                  <p className={`text-xs font-medium truncate mb-1 ${selectedEmailId === email.id ? 'text-indigo-700 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-300'}`}>
                    {email.subject}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate group-hover:text-slate-500 transition-colors">
                    {email.body.substring(0, 60)}...
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {emails.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm">
            {t.inboxEmpty}
          </div>
        )}
      </div>

      {/* Pop-up (Modal) to Read Full Email */}
      {viewingEmail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewingEmail(null)}>
          <div
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col h-[85vh] sm:h-auto sm:max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t.readEmailTitle}</h3>
              <button
                onClick={() => setViewingEmail(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Flex Grow to take available space, scrollable */}
            <div className="flex-grow overflow-y-auto p-4 sm:p-8 bg-slate-50/50 dark:bg-slate-800/50 custom-scrollbar pb-20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 flex-shrink-0 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center text-lg font-bold">
                  {getInitials(viewingEmail.senderName)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg">{viewingEmail.senderName}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t.modalSubject}: {viewingEmail.subject}</p>
                </div>
              </div>
              <div className="prose dark:prose-invert prose-slate max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                {viewingEmail.body}
              </div>
            </div>

            {/* Modal Footer (Actions) - Fixed at bottom of card */}
            <div className="flex-shrink-0 p-4 sm:p-6 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex justify-between gap-3 z-10 mb-safe">
              {/* Discard Button - Left Side */}
              <button
                onClick={handleDiscard}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 border border-red-200 dark:border-red-800"
              >
                <TrashIcon className="w-4 h-4" />
                {t.discardBtn}
              </button>

              {/* Right Side Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setViewingEmail(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  {t.closeBtn}
                </button>
                <button
                  onClick={handleConfirmSelection}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4" />
                  {t.useEmailBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
