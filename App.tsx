
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { ControlPanel } from './components/ControlPanel';
import { LoginScreen } from './components/LoginScreen';
import { ArrowLeftIcon, InboxIcon } from './components/Icons';
import { GenerationMode, GeneratedEmail, Language } from './types';
import { generateEmailResponse, refineEmailResponse } from './services/geminiService';
import { fetchPendingEmails, updateEmailStatus, MappedEmail } from './services/airtableService';

const translations = {
  en: {
    headerTitle: "A.Cliente Pro",
    headerSubtitle: "Response Studio",
    connectTitle: "Inbox Sync",
    connectDesc: "Connect your Gmail to start.",
    connectBtn: "Sync Account",
    connectBtnLoading: "Syncing...",
    demoNote: "Demo Environment",
    selectEmailLabel: "Incoming Messages",
    modeTitle: "Intelligence Model",
    modeStandard: "Standard",
    modeStandardDesc: "Balanced",
    modeSearch: "Search",
    modeSearchDesc: "Web Data",
    modeThinking: "Deep Reason",
    modeThinkingDesc: "Complex",
    instructionsTitle: "Tone & Intent",
    instructionsPlaceholder: "Describe how to reply...",
    generateBtn: "Draft Response",
    generatingBtn: "Drafting...",
    previewPlaceholder: "Ready to Assist",
    previewPlaceholderDesc: "Select a customer email from the inbox to instantly generate a professional response.",
    previewGenerating: "Crafting response...",
    previewFailed: "Generation Failed",
    previewBtn: "Preview",
    htmlBtn: "Code",
    formatBtn: "Prettify",
    expandBtn: "Expand",
    copyBtn: "Copy HTML",
    copiedBtn: "Copied!",
    emailSubject: "Subject Line",
    editHtmlMsg: "Advanced Code Editor Active",
    editHtmlTip: "💡 Tip: Search for 'INSERT_LINK_HERE' in the code to add your custom links.",
    modalTitle: "Preview Message",
    modalFrom: "From",
    modalTo: "To",
    modalSubject: "Subject",
    emailListHeader: "Inbox",
    emailListAgo: "ago",
    readEmailTitle: "Message Details",
    useEmailBtn: "Select",
    closeBtn: "Close",
    inboxEmpty: "All caught up",
    viewBtn: "View",
    tabInbox: "Inbox",
    tabManual: "Paste",
    manualPlaceholder: "Paste customer email content here...",
    manualLabel: "Context",
    refinePlaceholder: "Tell AI how to improve this draft...",
    refineBtn: "Refine",
    refineBtnLoading: "Updating...",
    // Quick Actions
    qaEmpathetic: "Empathetic",
    qaFirm: "Firm/Polite",
    qaRefund: "Refund",
    qaDiscount: "Discount",
    qaShipping: "Shipping Times",
    qaShippingValue: "Clarify that preparation time is 1-3 business days and shipping time is 3-6 business days.",
    // Discard/Spam
    discardBtn: "Discard",
    discardConfirm: "Are you sure you want to discard this email as spam? This action cannot be undone."
  },
  es: {
    headerTitle: "A.Cliente Pro",
    headerSubtitle: "Estudio de Respuestas",
    connectTitle: "Sincronización",
    connectDesc: "Conecta tu cuenta Gmail.",
    connectBtn: "Sincronizar",
    connectBtnLoading: "Conectando...",
    demoNote: "Entorno Demo",
    selectEmailLabel: "Mensajes Entrantes",
    modeTitle: "Modelo de Inteligencia",
    modeStandard: "Estándar",
    modeStandardDesc: "Balanceado",
    modeSearch: "Búsqueda",
    modeSearchDesc: "Datos Web",
    modeThinking: "Razonamiento",
    modeThinkingDesc: "Complejo",
    instructionsTitle: "Tono e Intención",
    instructionsPlaceholder: "Describe cómo responder...",
    generateBtn: "Redactar Respuesta",
    generatingBtn: "Redactando...",
    previewPlaceholder: "Listo para Asistir",
    previewPlaceholderDesc: "Selecciona un correo de la bandeja para generar una respuesta profesional al instante.",
    previewGenerating: "Diseñando respuesta...",
    previewFailed: "Fallo en Generación",
    previewBtn: "Vista Previa",
    htmlBtn: "Código",
    formatBtn: "Embellecer",
    expandBtn: "Expandir",
    copyBtn: "Copiar HTML",
    copiedBtn: "¡Copiado!",
    emailSubject: "Asunto",
    editHtmlMsg: "Editor de Código Avanzado Activo",
    editHtmlTip: "💡 Tip: Busca 'INSERT_LINK_HERE' en el código para poner tus enlaces reales.",
    modalTitle: "Vista Previa",
    modalFrom: "De",
    modalTo: "Para",
    modalSubject: "Asunto",
    emailListHeader: "Bandeja",
    emailListAgo: "hace",
    readEmailTitle: "Detalle del Mensaje",
    useEmailBtn: "Seleccionar",
    closeBtn: "Cerrar",
    inboxEmpty: "Todo al día",
    viewBtn: "Ver",
    tabInbox: "Bandeja",
    tabManual: "Pegar",
    manualPlaceholder: "Pega el contenido del correo aquí...",
    manualLabel: "Contexto",
    refinePlaceholder: "Dile a la IA cómo mejorar este borrador...",
    refineBtn: "Mejorar",
    refineBtnLoading: "Actualizando...",
    // Quick Actions
    qaEmpathetic: "Empático",
    qaFirm: "Firme/Educado",
    qaRefund: "Reembolso",
    qaDiscount: "Descuento",
    qaShipping: "Tiempos de Envío",
    qaShippingValue: "Aclarar que el tiempo estimado de preparación es de 1 a 3 días hábiles y el tiempo de envío es de 3 a 6 días hábiles.",
    // Discard/Spam
    discardBtn: "Descartar",
    discardConfirm: "¿Estás seguro de que quieres descartar este correo como spam? Esta acción no se puede deshacer."
  }
};

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // App state
  const [customerEmail, setCustomerEmail] = useState('');
  const [generationMode, setGenerationMode] = useState<GenerationMode>(GenerationMode.Standard);
  const [customInstructions, setCustomInstructions] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<Language>('es');
  const [emails, setEmails] = useState<MappedEmail[]>([]);
  const [activeEmailId, setActiveEmailId] = useState<string | null>(null);

  const t = translations[language];

  // Check authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load emails after authentication
  useEffect(() => {
    if (isAuthenticated) {
      const loadEmails = async () => {
        try {
          const pendingEmails = await fetchPendingEmails();
          setEmails(pendingEmails);
        } catch (err) {
          console.error("Failed to load emails", err);
        }
      };
      loadEmails();
    }
  }, [isAuthenticated]);

  // Handle login
  const handleLogin = (password: string) => {
    const correctPassword = import.meta.env.VITE_APP_PASSWORD;

    if (password === correctPassword) {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!customerEmail.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedEmail(null);
    setCopied(false);

    try {
      const response = await generateEmailResponse(customerEmail, generationMode, customInstructions);
      setGeneratedEmail(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [customerEmail, generationMode, customInstructions, isLoading]);

  const handleRefine = useCallback(async (refinementText: string) => {
    if (!customerEmail.trim() || !generatedEmail || !refinementText.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await refineEmailResponse(
        customerEmail,
        generatedEmail.subject,
        generatedEmail.body,
        refinementText
      );
      setGeneratedEmail(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refinement failed.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [customerEmail, generatedEmail, isLoading]);

  const handleCopyToClipboard = (htmlContent: string) => {
    navigator.clipboard.writeText(htmlContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleApprove = async () => {
    if (!activeEmailId || !generatedEmail) return;

    try {
      await updateEmailStatus(activeEmailId, 'Approved', generatedEmail.body);
      // Remove approved email from list
      setEmails(prev => prev.filter(e => e.id !== activeEmailId));
      setGeneratedEmail(null);
      setCustomerEmail('');
      setActiveEmailId(null);
    } catch (err) {
      console.error("Failed to approve email", err);
      setError("Failed to update status in Airtable");
    }
  };

  const handleDiscard = async (emailId: string) => {
    // Show confirmation dialog
    const confirmed = window.confirm(t.discardConfirm);

    if (!confirmed) return;

    try {
      await updateEmailStatus(emailId, 'Ignored');
      // Remove discarded email from list immediately
      setEmails(prev => prev.filter(e => e.id !== emailId));

      // Clear selection if the discarded email was selected
      if (activeEmailId === emailId) {
        setGeneratedEmail(null);
        setCustomerEmail('');
        setActiveEmailId(null);
      }
    } catch (err) {
      console.error("Failed to discard email", err);
      setError("Failed to update status in Airtable");
    }
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  const handleSelectEmailId = (id: string | null) => {
    setActiveEmailId(id);
  };

  // Find active email object for display
  const activeEmail = emails.find(e => e.id === activeEmailId);

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} error={loginError} />;
  }

  // Main app
  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#0f172a] text-slate-900 dark:text-slate-200 font-sans selection:bg-indigo-500 selection:text-white pb-24 lg:pb-0 lg:h-screen lg:overflow-hidden flex flex-col">
      {/* Refined Background */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent dark:from-slate-900 dark:to-transparent -z-10 pointer-events-none" />

      <Header
        language={language}
        setLanguage={handleSetLanguage}
        t={t}
      />

      <main className="flex-grow px-3 sm:px-6 md:px-8 pt-6 lg:pt-8 lg:pb-8 lg:h-[calc(100vh-80px)]">
        <div className="max-w-[1600px] mx-auto h-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* Left Column: Sidebar (Email List) */}
          <div className={`lg:col-span-4 xl:col-span-3 h-full flex flex-col ${activeEmailId ? 'hidden lg:flex' : 'flex'}`}>
            <InputPanel
              emails={emails}
              selectedEmailId={activeEmailId}
              onSelectEmailId={handleSelectEmailId}
              customerEmail={customerEmail}
              setCustomerEmail={setCustomerEmail}
              isEmailSelected={!!customerEmail.trim()}
              onDiscard={handleDiscard}
              t={t}
            />
          </div>

          {/* Right Column: Main Panel (Reading & Actions) */}
          <div className={`lg:col-span-8 xl:col-span-9 h-full flex flex-col gap-6 overflow-y-auto custom-scrollbar ${activeEmailId ? 'flex' : 'hidden lg:flex'}`}>

            {/* Mobile Back Button Header */}
            <div className="lg:hidden flex items-center gap-2 mb-2">
              <button
                onClick={() => {
                  setActiveEmailId(null);
                  setCustomerEmail('');
                  setGeneratedEmail(null);
                }}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium text-sm px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Volver a la lista
              </button>
            </div>

            {activeEmailId && (activeEmail || activeEmailId === 'manual_draft') ? (
              <div className="space-y-6 pb-20 lg:pb-0 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Email Reader Card OR Manual Input */}
                {activeEmailId === 'manual_draft' ? (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
                        <InboxIcon className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.manualLabel}</h2>
                    </div>
                    <textarea
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder={t.manualPlaceholder}
                      className="w-full h-64 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none resize-none custom-scrollbar transition-all font-mono"
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">{activeEmail?.subject}</h2>
                        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                          <span className="font-medium text-slate-900 dark:text-slate-200">{activeEmail?.senderName}</span>
                          <span>&lt;{activeEmail?.senderEmail}&gt;</span>
                          <span>•</span>
                          <span>{new Date(activeEmail?.receivedAt || '').toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="prose dark:prose-invert prose-slate max-w-none text-sm leading-relaxed whitespace-pre-wrap text-slate-600 dark:text-slate-300">
                      {activeEmail?.body}
                    </div>
                  </div>
                )}

                {/* Controls & Generation */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <ControlPanel
                    generationMode={generationMode}
                    setGenerationMode={setGenerationMode}
                    customInstructions={customInstructions}
                    setCustomInstructions={setCustomInstructions}
                    isGenerating={isLoading}
                    onGenerate={handleGenerate}
                    isEmailSelected={!!customerEmail.trim()}
                    t={t}
                  />

                  {/* Preview Panel - Only show if generated or generating */}
                  {(generatedEmail || isLoading || error) && (
                    <div className="xl:col-span-1">
                      <PreviewPanel
                        generatedEmail={generatedEmail}
                        setGeneratedEmail={setGeneratedEmail}
                        isLoading={isLoading}
                        error={error}
                        copied={copied}
                        onCopyToClipboard={handleCopyToClipboard}
                        onRefine={handleRefine}
                        onApprove={handleApprove}
                        t={t}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Empty State (Desktop) */
              <div className="hidden lg:flex h-full items-center justify-center text-center p-10 opacity-50">
                <div className="max-w-md">
                  <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <InboxIcon className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">{t.previewPlaceholder}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t.previewPlaceholderDesc}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
