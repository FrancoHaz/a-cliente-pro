
import React from 'react';
import { Language } from '../types';
import { GlobeIcon } from './Icons';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: any;
}

export const Header: React.FC<HeaderProps> = ({ language, setLanguage, t }) => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img 
            src="https://res.cloudinary.com/dytb3hwko/image/upload/v1763320162/file_00000000a12c722f9ddc39481212ab22-removebg-preview_hadh4g.png" 
            alt="Franco AI Automations Logo" 
            className="h-12 w-12 object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.headerTitle}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t.headerSubtitle}</p>
          </div>
        </div>
        
        <button 
          onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
          className="flex items-center space-x-2 px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors text-slate-700 dark:text-slate-200 text-sm font-medium"
        >
          <GlobeIcon className="w-5 h-5" />
          <span>{language === 'en' ? 'Español' : 'English'}</span>
        </button>
      </div>
    </header>
  );
};
