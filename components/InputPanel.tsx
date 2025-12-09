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
  isGenerating?: boolean;
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
  isGenerating = false,
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
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      {/* Connection Overlay (Simpler Design) */}
      {!isConnected ? (
        <div className="p-8 flex flex-col items-center justify-center h-full text-center">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 border border-gray-200 shadow-sm">
            <GoogleIcon className="w-7 h-7 opacity-90" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">{t.connectTitle}</h2>
          <p className="text-sm text-gray-500 mb-6">{t.connectDesc}</p>
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="py-2.5 px-8 bg-black text-white rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isConnecting ? t.connectBtnLoading : t.connectBtn}
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Tabs Header */}
          <div className="flex border-b border-gray-200 bg-gray-50 px-4 pt-2 gap-4">
            <button
              onClick={() => {
                setActiveTab('inbox');
                setCustomerEmail('');
                onSelectEmailId(null);
              }}
              className={`pb-3 text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-all ${activeTab === 'inbox' ? 'text-black border-b-2 border-black' : 'text-gray-400 hover:text-gray-600'}`}
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
              className={`pb-3 text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-all ${activeTab === 'manual' ? 'text-black border-b-2 border-black' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ClipboardIcon className="w-4 h-4" />
              {t.tabManual}
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-grow overflow-hidden relative bg-gray-50">
            {activeTab === 'inbox' ? (
              <>
                <EmailList emails={emails} selectedEmailId={selectedEmailId} onSelectEmail={handleSelectEmail} onDiscard={onDiscard} isGenerating={isGenerating} t={t} />
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
                  <ClipboardIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-bold text-lg mb-1">{t.manualLabel}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-[200px] mx-auto">
                    {t.manualPlaceholder}
                  </p>
                </div>
                <button
                  onClick={() => onSelectEmailId('manual_draft')}
                  className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors w-full"
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
