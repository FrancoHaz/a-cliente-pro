
import React, { useState } from 'react';
import { GeneratedEmail } from '../types';
import { CopyIcon, CheckIcon, CodeIcon, EyeIcon, ExpandIcon, XIcon, SendIcon, MagicWandIcon, RefreshIcon } from './Icons';

// --- Gmail Preview Modal Component ---
interface GmailPreviewModalProps {
  email: GeneratedEmail | null;
  onClose: () => void;
  t: any;
}

const GmailPreviewModal: React.FC<GmailPreviewModalProps> = ({ email, onClose, t }) => {
  if (!email) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#f2f2f2] dark:bg-[#1e1e1e] border-b border-slate-300 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" alt="Gmail" className="w-5 h-5" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Gmail Preview</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Email Headers Area */}
        <div className="px-6 py-4 bg-white dark:bg-[#1e1e1e] space-y-4 flex-shrink-0">
          <h2 className="text-xl font-normal text-slate-900 dark:text-white">{email.subject}</h2>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
              F
            </div>
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">Franco AI Team <span className="font-normal text-xs text-slate-500">&lt;support@franco-ai.com&gt;</span></span>
                <span className="text-xs text-slate-500">10:30 AM (0 minutes ago)</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                to {t.modalTo} <span className="text-slate-800 dark:text-slate-200">Me</span>
              </div>
            </div>
          </div>
        </div>

        {/* Email Body */}
        <div className="flex-grow p-6 overflow-y-auto bg-white dark:bg-[#1e1e1e] custom-scrollbar">
          <div className="max-w-3xl" dangerouslySetInnerHTML={{ __html: email.body }} />
          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-700 flex gap-2">
            <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Reply</button>
            <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Forward</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Preview Panel Component ---
interface PreviewPanelProps {
  generatedEmail: GeneratedEmail | null;
  setGeneratedEmail: (email: GeneratedEmail | null) => void;
  isLoading: boolean;
  error: string | null;
  copied: boolean;
  onCopyToClipboard: (htmlContent: string) => void;
  onRefine: (text: string) => void;
  onApprove: () => void;
  t: any;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  generatedEmail,
  setGeneratedEmail,
  isLoading,
  error,
  copied,
  onCopyToClipboard,
  onRefine,
  onApprove,
  t,
}) => {
  const [isHtmlView, setIsHtmlView] = useState(false);
  const [isGmailPreviewOpen, setIsGmailPreviewOpen] = useState(false);
  const [refinementText, setRefinementText] = useState('');

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (generatedEmail) {
      setGeneratedEmail({ ...generatedEmail, body: e.target.value });
    }
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (generatedEmail) {
      setGeneratedEmail({ ...generatedEmail, subject: e.target.value });
    }
  };

  const handleRefineSubmit = () => {
    if (refinementText.trim()) {
      onRefine(refinementText);
      setRefinementText('');
    }
  };

  const formatHTML = () => {
    if (!generatedEmail) return;

    const html = generatedEmail.body;
    let formatted = '';
    let indent = '';

    html.split(/>\s*</).forEach(function (element) {
      if (element.match(/^\/\w/)) {
        indent = indent.substring(2);
      }

      formatted += indent + '<' + element + '>\r\n';

      if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("input") && !element.startsWith("img") && !element.startsWith("br")) {
        indent += '  ';
      }
    });

    setGeneratedEmail({ ...generatedEmail, body: formatted.substring(1, formatted.length - 3) });
  };

  if (isLoading) {
    return (
      <div className="h-full min-h-[400px] bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-8 space-y-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-indigo-100 dark:border-indigo-900/40 border-t-indigo-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <SendIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
        <div className="text-center animate-pulse">
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{t.previewGenerating}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Analyzing request...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full min-h-[400px] bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-red-100 dark:border-red-900/30 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <XIcon className="w-8 h-8" />
        </div>
        <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{t.previewFailed}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md">{error}</p>
      </div>
    );
  }

  if (!generatedEmail) {
    return (
      <div className="h-full min-h-[400px] bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-10 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-400 blur-3xl opacity-20 rounded-full"></div>
          <div className="relative w-24 h-24 bg-white dark:bg-slate-700 rounded-2xl shadow-xl flex items-center justify-center transform rotate-6 transition-transform hover:rotate-0 duration-500">
            <SendIcon className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">{t.previewPlaceholder}</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
          {t.previewPlaceholderDesc}
        </p>

        <div className="mt-8 flex gap-2 opacity-60">
          <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
          <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
          <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full min-h-[500px] bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-all duration-500">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-wrap gap-2 justify-between items-center bg-white dark:bg-slate-800 z-10">
          <div className="flex bg-slate-100 dark:bg-slate-700/50 p-1 rounded-xl">
            <button
              onClick={() => setIsHtmlView(false)}
              className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center space-x-2 transition-all ${!isHtmlView ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
            >
              <EyeIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.previewBtn}</span>
            </button>
            <button
              onClick={() => setIsHtmlView(true)}
              className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center space-x-2 transition-all ${isHtmlView ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
            >
              <CodeIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.htmlBtn}</span>
            </button>
          </div>

          <div className="flex gap-2">
            {isHtmlView && (
              <button
                onClick={formatHTML}
                className="px-3 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-1.5"
                title="Auto-format HTML"
              >
                <MagicWandIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.formatBtn}</span>
              </button>
            )}
            <button
              onClick={() => setIsGmailPreviewOpen(true)}
              className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:bg-slate-700 rounded-xl transition-colors"
              title="Open Gmail Preview"
            >
              <ExpandIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onApprove}
              className="px-5 py-2.5 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl flex items-center space-x-2 transition-all shadow-md active:scale-95"
            >
              <CheckIcon className="w-4 h-4" />
              <span>Approve</span>
            </button>
            <button
              onClick={() => onCopyToClipboard(generatedEmail.body)}
              className={`px-5 py-2.5 text-xs font-bold text-white rounded-xl flex items-center space-x-2 transition-all shadow-md active:scale-95 ${copied ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500'}`}
            >
              {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
              <span>{copied ? t.copiedBtn : t.copyBtn}</span>
            </button>
          </div>
        </div>

        {/* Refinement Bar (Chat Style) */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-700">
          <div className="relative flex items-center">
            <input
              type="text"
              value={refinementText}
              onChange={(e) => setRefinementText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRefineSubmit()}
              placeholder={t.refinePlaceholder}
              className="w-full pl-4 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
            <button
              onClick={handleRefineSubmit}
              disabled={!refinementText.trim()}
              className="absolute right-2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-300 dark:disabled:bg-slate-700 transition-colors"
            >
              <RefreshIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow flex flex-col overflow-hidden relative group h-[500px] lg:h-auto">
          {/* Subject Line Input */}
          <div className="px-6 sm:px-8 pt-6 pb-4 bg-white dark:bg-slate-800">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">{t.emailSubject}</label>
            <input
              type="text"
              value={generatedEmail.subject}
              onChange={handleSubjectChange}
              className="w-full bg-transparent border-0 border-b border-slate-100 dark:border-slate-700 focus:border-indigo-500 focus:ring-0 px-0 py-1 text-lg sm:text-xl font-bold text-slate-800 dark:text-white placeholder-slate-300 transition-colors"
              spellCheck="false"
            />
          </div>

          <div className="flex-grow min-h-0 relative">
            {isHtmlView ? (
              <div className="absolute inset-0 bg-[#0d1117] flex flex-col">
                <div className="flex flex-1 overflow-hidden">
                  <div className="hidden sm:block w-10 bg-[#0d1117] border-r border-slate-800 pt-6 text-right pr-2 text-slate-600 select-none font-mono text-xs leading-6">
                    {Array.from({ length: 20 }).map((_, i) => <div key={i}>{i + 1}</div>)}
                  </div>
                  <textarea
                    value={generatedEmail.body}
                    onChange={handleBodyChange}
                    className="flex-1 w-full h-full p-4 sm:p-6 bg-[#0d1117] text-slate-300 font-mono text-xs sm:text-sm leading-6 resize-none focus:outline-none custom-scrollbar whitespace-pre"
                    spellCheck="false"
                    autoCorrect="off"
                    autoCapitalize="off"
                  />
                </div>
              </div>
            ) : (
              <div className="h-full overflow-y-auto px-4 sm:px-8 pb-8 custom-scrollbar">
                {/* Simulate Email Client Container within the card */}
                <div className="bg-white rounded-lg p-1 min-h-full shadow-sm border border-slate-100">
                  <div className="overflow-x-auto">
                    <div dangerouslySetInnerHTML={{ __html: generatedEmail.body }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Hint */}
        {isHtmlView && (
          <div className="py-2 text-[10px] text-center text-slate-400 dark:text-slate-500 bg-[#0d1117] border-t border-slate-800 uppercase tracking-widest flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 mt-0.5 animate-pulse"></div>
            {t.editHtmlTip}
          </div>
        )}
      </div>

      {isGmailPreviewOpen && (
        <GmailPreviewModal
          email={generatedEmail}
          onClose={() => setIsGmailPreviewOpen(false)}
          t={t}
        />
      )}
    </>
  );
};
