import React, { useEffect } from 'react';
import { GenerationMode, Sentiment } from '../types';
import { SparkIcon, MagicWandIcon, ChevronDownIcon, ChevronUpIcon } from './Icons';

interface ControlPanelProps {
    generationMode: GenerationMode;
    setGenerationMode: (mode: GenerationMode) => void;
    customInstructions: string;
    setCustomInstructions: (instructions: string) => void;
    isGenerating: boolean;
    onGenerate: () => void;
    isEmailSelected: boolean;
    // New Props for Enhanced UI
    trackingNumber: string;
    setTrackingNumber: (val: string) => void;
    selectedAction: string | null;
    setSelectedAction: (val: string | null) => void;
    selectedTone: string | null;
    setSelectedTone: (val: string | null) => void;
    currentSentiment?: Sentiment;
    t: any;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
    generationMode,
    setGenerationMode,
    customInstructions,
    setCustomInstructions,
    isGenerating,
    onGenerate,
    isEmailSelected,
    trackingNumber,
    setTrackingNumber,
    selectedAction,
    setSelectedAction,
    selectedTone,
    setSelectedTone,
    currentSentiment,
    t,
}) => {
    const [isInstructionsOpen, setIsInstructionsOpen] = React.useState(true);

    // ACTION CHIPS DATA
    const actions = [
        { label: '📍 Rastrear', value: 'Rastrear' },
        { label: '💸 Reembolso', value: 'Reembolso' },
        { label: '📦 Reenviar', value: 'Reenviar' },
        { label: '❌ Cancelar', value: 'Cancelar' },
    ];

    // TONE CHIPS DATA
    const tones = [
        { label: '🥰 Empático', value: 'Empático' },
        { label: '🧐 Formal', value: 'Formal' },
        { label: '⚡ Breve', value: 'Breve' },
    ];

    // SMART LOGIC: Auto-select 'Empático' if sentiment is 'Angry'
    useEffect(() => {
        if (currentSentiment === 'Angry') {
            setSelectedTone('Empático');
        }
    }, [currentSentiment, setSelectedTone]);

    // Update custom instructions based on selection
    useEffect(() => {
        let instructions = '';
        if (selectedAction) instructions += `Action: ${selectedAction}. `;
        if (selectedTone) instructions += `Tone: ${selectedTone}. `;
        if (trackingNumber) instructions += `Tracking Number: ${trackingNumber}. `;

        // Only update if we have structured data, otherwise leave manual edits?
        // For this task, we will just prepend/append or let the user see the chips state.
        // But commonly, these chips might feed into the prompt instructions variable.
        // Let's keep it simple: we pass these values to the parent, 
        // AND we can also sync them to customInstructions for visibility if desired.
        // The user asked for UI primarily. Let's JUST set the state for now.
    }, [selectedAction, selectedTone, trackingNumber]);


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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-5">

            {/* INSTRUCTIONS & CHIPS AREA */}
            <div className="pt-2">
                <button
                    onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
                    className="w-full flex items-center justify-between mb-4 group"
                >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                        <MagicWandIcon className="w-3 h-3" />
                        {t.instructionsTitle}
                    </span>
                    {isInstructionsOpen ? <ChevronUpIcon className="w-3 h-3 text-slate-400" /> : <ChevronDownIcon className="w-3 h-3 text-slate-400" />}
                </button>

                {isInstructionsOpen && (
                    <div className="animate-in slide-in-from-top-2 duration-200 space-y-4">

                        {/* CHIPS ROW 1: ACTIONS */}
                        {/* CHIPS ROW 1: ACTIONS */}
                        <div className="flex flex-wrap gap-2">
                            {actions.map((action) => (
                                <button
                                    key={action.value}
                                    onClick={() => setSelectedAction(selectedAction === action.value ? null : action.value)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${selectedAction === action.value
                                        ? 'bg-black text-white border-black shadow-sm'
                                        : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>

                        {/* CHIPS ROW 2: TONES */}
                        <div className="flex flex-wrap gap-2">
                            {tones.map((tone) => (
                                <button
                                    key={tone.value}
                                    onClick={() => setSelectedTone(selectedTone === tone.value ? null : tone.value)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${selectedTone === tone.value
                                        ? 'bg-black text-white border-black shadow-sm'
                                        : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {tone.label}
                                </button>
                            ))}
                        </div>

                        {/* TEXTAREA */}
                        <textarea
                            value={customInstructions}
                            onChange={(e) => setCustomInstructions(e.target.value)}
                            placeholder={t.instructionsPlaceholder}
                            className="w-full h-24 bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black outline-none resize-none custom-scrollbar transition-all"
                        />

                        {/* TRACKING INPUT */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-400">🔗</span>
                            </div>
                            <input
                                type="text"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                placeholder="Pegar enlace de seguimiento aquí"
                                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all shadow-sm"
                            />
                        </div>

                    </div>
                )}
            </div>

            {/* Generate Button - Desktop View */}
            <div className="hidden lg:block pt-1">
                <button
                    onClick={onGenerate}
                    disabled={isGenerating || !isEmailSelected}
                    className="w-full py-3.5 bg-black hover:bg-gray-800 text-white rounded-xl font-bold text-sm shadow-md transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                    <GenerateButtonContent />
                </button>
            </div>

            {/* Mobile Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 lg:hidden z-50">
                <button
                    onClick={onGenerate}
                    disabled={isGenerating || !isEmailSelected}
                    className="w-full py-4 bg-black text-white rounded-2xl font-bold text-sm shadow-lg transform transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    <GenerateButtonContent />
                </button>
            </div>
        </div>
    );
};
