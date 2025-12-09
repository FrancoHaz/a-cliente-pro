import React from 'react';
import { CheckIcon, TrashIcon } from './Icons';
import { MappedEmail } from '../services/airtableService';
import { Sentiment } from '../types';

interface EmailListProps {
  emails: MappedEmail[];
  selectedEmailId: string | null;
  onSelectEmail: (email: MappedEmail) => void;
  onDiscard: (emailId: string) => void;
  isGenerating?: boolean;
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

// Helper to get sentiment emoji
// Helper to get sentiment badge style - Pastel/Outline
const getSentimentBadge = (sentiment?: Sentiment) => {
  switch (sentiment) {
    case 'Angry':
      return { label: 'Angry', color: 'bg-red-50 text-red-600 border border-red-100', icon: '😡' };
    case 'Happy':
      return { label: 'Happy', color: 'bg-green-50 text-green-600 border border-green-100', icon: '😃' };
    case 'Neutral':
      return { label: 'Neutral', color: 'bg-gray-50 text-gray-500 border border-gray-100', icon: '😐' };
    default:
      return null;
  }
};

export const EmailList: React.FC<EmailListProps> = ({
  emails,
  selectedEmailId,
  onSelectEmail,
  onDiscard,
  isGenerating = false,
  t
}) => {
  const handleEmailClick = (email: MappedEmail) => {
    // Block email selection while AI is generating
    if (isGenerating) return;
    onSelectEmail(email);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header/Search area would go here with flex-none if needed */}

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar p-2 pb-20">
        <ul className="space-y-2">
          {emails.map((email) => {
            // Determine urgency styling
            const isHighUrgency = email.urgency === 'High';
            const isSelected = selectedEmailId === email.id;

            // Build border/bg classes based on state - Minimalist
            let containerClasses = 'border transition-all duration-200 ';

            if (isSelected) {
              // Selected: White bg, Black border
              containerClasses += 'bg-white border-black ring-1 ring-black shadow-sm z-10';
            } else {
              // Normal: White bg, Gray border, Subtle hover
              containerClasses += 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm';

              if (email.urgency === 'High') {
                containerClasses += ' border-l-4 border-l-red-500';
              }
            }

            const sentimentBadge = getSentimentBadge(email.sentiment);

            return (
              <li
                key={email.id}
                onClick={() => handleEmailClick(email)}
                className={`group relative p-4 rounded-lg cursor-pointer ${containerClasses} ${isGenerating ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${isSelected ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {isSelected ? <CheckIcon className="w-4 h-4" /> : getInitials(email.senderName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <p className={`font-semibold text-sm truncate ${isSelected ? 'text-gray-900' : 'text-gray-900'}`}>
                        {email.senderName}
                      </p>
                      <div className="flex items-center gap-1.5">
                        {/* Sentiment Badge */}
                        {sentimentBadge && (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 ${sentimentBadge.color}`}>
                            {sentimentBadge.label}
                          </span>
                        )}

                        {/* Urgency Icon for High Urgency */}
                        {email.urgency === 'High' && (
                          <span title="High Urgency" className="text-red-500 text-xs">🔥</span>
                        )}
                        <span className="text-[10px] text-gray-400">{new Date(email.receivedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-gray-700 truncate mb-1">
                      {email.subject}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {email.body.substring(0, 60)}...
                    </p>
                  </div>

                  {/* Delete Button - Appears on Hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isGenerating) return;
                      onDiscard(email.id);
                    }}
                    disabled={isGenerating}
                    className="absolute right-4 top-4 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1.5 rounded-md hover:bg-red-50"
                    title="Eliminar correo"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        {emails.length === 0 && (
          <div className="text-center py-10 text-slate-600 text-sm">
            {t.inboxEmpty}
          </div>
        )}
      </div>
    </div>
  );
};
