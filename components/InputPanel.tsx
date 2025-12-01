import React, { useState } from 'react';
import { GenerationMode } from '../types';
import { GoogleIcon, ClipboardIcon, InboxIcon } from './Icons';
import { EmailList } from './EmailList';
import { MappedEmail } from '../services/airtableService';

interface InputPanelProps {
  emails: MappedEmail[];
  selectedEmailId: string | null;
  onSelectEmailId: (id: string | null) => void;
  customerEmail: string;
  setCustomerEmail: (email: string) => void;
  isEmailSelected: boolean;
  onDiscard: (emailId: string) => void;
  t: any;
}

type Tab = 'inbox' | 'manual';

export const InputPanel: React.FC<InputPanelProps> = ({
  emails,
  selectedEmailId,
  onSelectEmailId,
  customerEmail,
  setCustomerEmail,
  onDiscard,
  t,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('inbox');

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
    }, 1500);
  };

  const handleSelectEmail = (email: MappedEmail) => {
    onSelectEmailId(email.id);
    setCustomerEmail(email.body);
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] rounded-3xl overflow-hidden border border-slate-800 shadow-xl">
      {/* Connection Overlay (Simpler Design) */}
      {!isConnected ? (
        <div className="p-8 flex flex-col items-center justify-center h-full text-center">
          <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 shadow-inner border border-slate-700">
            <GoogleIcon className="w-7 h-7 opacity-90" />
          </div>
          <h2 className="text-lg font-bold text-white mb-1">{t.connectTitle}</h2>
          <p className="text-sm text-slate-400 mb-6">{t.connectDesc}</p>
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="py-2.5 px-8 bg-white text-slate-900 rounded-xl font-semibold text-sm hover:scale-105 transition-transform disabled:opacity-50 shadow-md"
          >
            {isConnecting ? t.connectBtnLoading : t.connectBtn}
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Tabs Header */}
          <div className="flex border-b border-slate-800 bg-[#1a1a1a]">
            <button
              onClick={() => {
                setActiveTab('inbox');
                setCustomerEmail('');
                onSelectEmailId(null);
              }}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-colors ${activeTab === 'inbox' ? 'text-yellow-400 border-b-2 border-yellow-400 bg-yellow-400/5' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
            >
              <InboxIcon className="w-4 h-4" />
              {t.tabInbox}
            </button>
            <button
              onClick={() => {
                setActiveTab('manual');
                setCustomerEmail('');
                onSelectEmailId(null);
              }}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-colors ${activeTab === 'manual' ? 'text-yellow-400 border-b-2 border-yellow-400 bg-yellow-400/5' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
            >
              <ClipboardIcon className="w-4 h-4" />
              {t.tabManual}
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-grow overflow-hidden relative bg-[#1a1a1a]">
            {activeTab === 'inbox' ? (
              <>
                <EmailList emails={emails} selectedEmailId={selectedEmailId} onSelectEmail={handleSelectEmail} onDiscard={onDiscard} t={t} />
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                  <ClipboardIcon className="w-8 h-8 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">{t.manualLabel}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed max-w-[200px] mx-auto">
                    {t.manualPlaceholder}
                  </p>
                </div>
                <button
                  onClick={() => onSelectEmailId('manual_draft')}
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-xl transition-colors w-full shadow-lg shadow-yellow-500/20"
                >
                  Open Editor
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
