import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="sticky bottom-0 w-full bg-white/90 backdrop-blur-sm border-t border-gray-200 py-3 px-6 z-20">
            <div className="max-w-[1600px] mx-auto flex items-center justify-center">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="font-medium">Sistema Conectado a Airtable</span>
                </div>
            </div>
        </footer>
    );
};
