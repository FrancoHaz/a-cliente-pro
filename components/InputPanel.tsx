import React, { useState } from 'react';
import { GenerationMode } from '../types';
import { SparkIcon, GoogleIcon, NetworkIntelligenceIcon, ChevronDownIcon, ChevronUpIcon, ClipboardIcon, InboxIcon, MagicWandIcon } from './Icons';
import { EmailList } from './EmailList';
import { MappedEmail } from '../services/airtableService';

interface InputPanelProps {
  emails: MappedEmail[];
  selectedEmailId: string | null;
  onSelectEmailId: (id: string | null) => void;
  customerEmail: string;
  setCustomerEmail: (email: string) => void;
  generationMode: GenerationMode;
  setGenerationMode: (mode: GenerationMode) => void;
  customInstructions: string;
  setCustomInstructions: (instructions: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
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
  generationMode,
  setGenerationMode,
  customInstructions,
  setCustomInstructions,
  isGenerating,
  onGenerate,
  isEmailSelected,
  onDiscard,
  t,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('inbox');

  const [isInstructionsOpen, setIsInstructionsOpen] = useState(true);

  const generationOptions = [
    {
      id: GenerationMode.Standard,
      label: t.modeStandard,
      description: t.modeStandardDesc,
      icon: <SparkIcon className="w-3.5 h-3.5 text-purple-600" />
    },
    {
      id: GenerationMode.Search,
      label: t.modeSearch,
      description: t.modeSearchDesc,
      icon: <GoogleIcon className="w-3.5 h-3.5" />
    },
    {
      id: GenerationMode.Thinking,
      label: t.modeThinking,
      description: t.modeThinkingDesc,
      icon: <NetworkIntelligenceIcon className="w-3.5 h-3.5 text-emerald-600" />
    },
  ];

  const quickActions = [
    { label: t.qaEmpathetic, value: "Use a very empathetic and apologetic tone." },
    { label: t.qaFirm, value: "Be polite but firm on company policies." },
    { label: t.qaRefund, value: "Process a full refund immediately." },
    { label: t.qaDiscount, value: "Offer a 15% discount code for next time." },
    { label: t.qaShipping, value: t.qaShippingValue },
  ];

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

  const GenerateButtonContent = () => (
    <>
      {isGenerating ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {t.generatingBtn}
        </>
      ) : (
        <>
          <SparkIcon className="w-5 h-5" />
          {t.generateBtn}
        </>
      )}
    </>
  );

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Input Source Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-all duration-300 h-[580px] lg:h-[calc(100vh-420px)] lg:min-h-[350px] lg:max-h-[600px]">

        {/* Connection Overlay (Simpler Design) */}
        {!isConnected ? (
          <div className="p-8 flex flex-col items-center justify-center h-full text-center">
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <GoogleIcon className="w-7 h-7 opacity-90" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t.connectTitle}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t.connectDesc}</p>
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="py-2.5 px-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold text-sm hover:scale-105 transition-transform disabled:opacity-50 shadow-md"
            >
              {isConnecting ? t.connectBtnLoading : t.connectBtn}
            </button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Tabs Header */}
            <div className="flex border-b border-slate-100 dark:border-slate-700">
              <button
                onClick={() => {
                  setActiveTab('inbox');
                  setCustomerEmail('');
                  onSelectEmailId(null);
                }}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-colors ${activeTab === 'inbox' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30 dark:bg-indigo-900/10' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}
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
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-colors ${activeTab === 'manual' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30 dark:bg-indigo-900/10' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}
              >
                <ClipboardIcon className="w-4 h-4" />
                {t.tabManual}
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-grow overflow-hidden relative">
              {activeTab === 'inbox' ? (
                <>
                  <EmailList emails={emails} selectedEmailId={selectedEmailId} onSelectEmail={handleSelectEmail} onDiscard={onDiscard} t={t} />
                </>
              ) : (
                <div className="h-full flex flex-col p-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                    {t.manualLabel}
                  </label>
                  <textarea
                    value={customerEmail}
                    onChange={(e) => {
                      setCustomerEmail(e.target.value);
                      onSelectEmailId(null);
                    }}
                    placeholder={t.manualPlaceholder}
                    className="w-full flex-grow bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none custom-scrollbar transition-all"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Configuration & Action Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-5">

        {/* Mode Selector - Horizontal & Compact */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            {t.modeTitle}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {generationOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setGenerationMode(option.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 ${generationMode === option.id
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-500/50 text-indigo-700 dark:text-indigo-300'
                  : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:border-indigo-200'
                  }`}
              >
                <div className="mb-1">{option.icon}</div>
                <span className="text-[10px] font-bold">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Instructions with Quick Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
            className="w-full flex items-center justify-between mb-3 group"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
              <MagicWandIcon className="w-3 h-3" />
              {t.instructionsTitle}
            </span>
            {isInstructionsOpen ? <ChevronUpIcon className="w-3 h-3 text-slate-400" /> : <ChevronDownIcon className="w-3 h-3 text-slate-400" />}
          </button>

          {isInstructionsOpen && (
            <div className="animate-in slide-in-from-top-2 duration-200 space-y-3">
              {/* Quick Actions Chips */}
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCustomInstructions(action.value)}
                    className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-indigo-100 hover:text-indigo-700 dark:hover:bg-indigo-900 dark:hover:text-indigo-300 transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder={t.instructionsPlaceholder}
                className="w-full h-20 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none custom-scrollbar"
              />
            </div>
          )}
        </div>

        {/* Generate Button - Desktop View */}
        <div className="hidden lg:block pt-1">
          <button
            onClick={onGenerate}
            disabled={isGenerating || !isEmailSelected}
            className="w-full py-3.5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 dark:shadow-indigo-500/20 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            <GenerateButtonContent />
          </button>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 lg:hidden z-50">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !isEmailSelected}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-500/30 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:shadow-none flex justify-center items-center gap-2"
        >
          <GenerateButtonContent />
        </button>
      </div>
    </div>
  );
};
