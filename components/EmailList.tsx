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
  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-2">
      <ul className="space-y-2">
        {emails.map((email) => (
          <li
            key={email.id}
            onClick={() => onSelectEmail(email)}
            className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 border-l-4 ${selectedEmailId === email.id
              ? 'bg-yellow-500/10 border-yellow-500'
              : 'bg-transparent border-transparent hover:bg-white/5'
              }`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${selectedEmailId === email.id ? 'bg-yellow-500 text-slate-900' : 'bg-slate-700 text-slate-300'}`}>
                {selectedEmailId === email.id ? <CheckIcon className="w-5 h-5" /> : getInitials(email.senderName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <p className={`font-semibold text-sm truncate ${selectedEmailId === email.id ? 'text-yellow-400' : 'text-slate-200'}`}>
                    {email.senderName}
                  </p>
                  <span className="text-[10px] text-slate-500">{new Date(email.receivedAt).toLocaleDateString()}</span>
                </div>
                <p className={`text-xs font-medium truncate mb-1 ${selectedEmailId === email.id ? 'text-slate-300' : 'text-slate-400'}`}>
                  {email.subject}
                </p>
                <p className="text-[11px] text-slate-500 truncate group-hover:text-slate-400 transition-colors">
                  {email.body.substring(0, 60)}...
                </p>
              </div>

              {/* Quick Discard Action (Visible on Hover) */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Esto evita que se abra el email al borrarlo
                  if (window.confirm('¿Seguro que quieres descartar este correo?')) {
                    onDiscard(email.id);
                  }
                }}
                // Estas clases son la clave del diseño "Premium":
                className="absolute top-3 right-3 p-2 rounded-full 
                           text-gray-400 hover:text-red-500 hover:bg-red-500/10
                           opacity-0 group-hover:opacity-100 transition-all duration-200"
                title="Descartar"
              >
                {/* Asegúrate de que el icono se llame igual que en tu import (TrashIcon o similar) */}
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {emails.length === 0 && (
        <div className="text-center py-10 text-slate-600 text-sm">
          {t.inboxEmpty}
        </div>
      )}
    </div>
  );
};
