import React from 'react';
import { Icons } from '../Components/ui/Icons';
import { clsx } from '../lib/utility';
import { KIBRAN_COLOR, KIBRAN_COLOR_LIGHT } from '../lib/constants';

interface ThemeToggleButtonProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ isDarkMode, toggleTheme }) => (
    <button
        onClick={toggleTheme}
        className={clsx(`fixed top-4 right-4 p-3 rounded-full shadow-lg transition-all duration-500 z-50
            hover:scale-105 active:scale-95`,
            isDarkMode
                ? 'bg-slate-700 text-blue-400 hover:bg-slate-600'
                : 'bg-white text-blue-700 hover:bg-slate-200'
        )}
        style={{ color: isDarkMode ? KIBRAN_COLOR_LIGHT : KIBRAN_COLOR }}
        aria-label="Toggle dark and light mode"
    >
        {isDarkMode ? <Icons.SunIcon className="w-6 h-6"/> : <Icons.MoonIcon className="w-6 h-6"/>}
    </button>
);