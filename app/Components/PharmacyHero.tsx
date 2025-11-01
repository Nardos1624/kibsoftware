import React from 'react';
import { Icons } from '../Components/ui/Icons'; 
import { clsx } from '../lib/utility'; 
import { 
    KIBRAN_COLOR, 
    KIBRAN_COLOR_LIGHT, 
    KIBRAN_COLOR as PRIMARY_COLOR, 
    KIBRAN_COLOR_LIGHT as PRIMARY_COLOR_LIGHT 
} from '../lib/constants'; 

// --- Types ---

interface HeroProps {
    isDarkMode: boolean;
    pageType: 'login' | 'register'; 
}

interface ThemeToggleProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

// ----------------------------------------------------------------------
// 1. ThemeToggle Component
// ----------------------------------------------------------------------

// EXPORTED as NAMED EXPORT
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, toggleTheme }) => (
    <button
        onClick={toggleTheme}
        className={clsx(`fixed top-4 right-4 p-3 rounded-full shadow-lg transition-all duration-500 z-50
            hover:scale-105 active:scale-95`,
            isDarkMode
                ? 'bg-slate-700 text-blue-400 hover:bg-slate-600'
                : 'bg-white text-blue-700 hover:bg-slate-200'
        )}
        style={{ color: isDarkMode ? PRIMARY_COLOR_LIGHT : PRIMARY_COLOR }}
        aria-label="Toggle dark and light mode"
    >
        {isDarkMode ? <Icons.SunIcon className="w-6 h-6"/> : <Icons.MoonIcon className="w-6 h-6"/>}
    </button>
);

// ----------------------------------------------------------------------
// 2. PharmacyHero Component (Updated with dynamic content)
// ----------------------------------------------------------------------

// EXPORTED as NAMED EXPORT
export const PharmacyHero: React.FC<HeroProps> = ({ isDarkMode, pageType }) => {
    // Determine Header and Content based on pageType
    const headerText = pageType === 'login' 
        ? 'Welcome Back to Kibran Wholesale'
        : 'Create Your Kibran Wholesale Account';
        
    const bodyText = pageType === 'login'
        ? 'Please log in to access the core system for managing wholesale inventory, distribution, and medication safety assurance.'
        : 'Register a new user for access to the core system used to manage wholesale inventory, distribution, and medication safety assurance.';
        
    const logoShadowClass = isDarkMode ? 'hover:shadow-blue-500/80' : 'hover:shadow-blue-800/60';

    return (
        <div className={clsx(`hidden lg:flex flex-col justify-center items-center pb-12 px-12 lg:w-6/12 min-h-screen relative 
            transition-all duration-700 ease-in-out overflow-hidden bg-transparent`,
            isDarkMode ? 'text-white' : 'text-slate-900')} 
        >
            <div className={clsx(`absolute inset-0 z-0 transition-opacity duration-700`, isDarkMode ? 'opacity-30' : 'opacity-10')}>
                {/* Changed background accents to blue */}
                <div className={clsx(`absolute w-96 h-96 rounded-full blur-3xl transition-all duration-1000 animate-pulse-slow top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2`, isDarkMode ? 'bg-blue-400/20' : 'bg-blue-300/50')}></div>
                <div className={clsx(`absolute w-64 h-32 rounded-full transform rotate-45 blur-3xl transition-all duration-1000 animate-pulse-fast bottom-1/4 right-1/4 translate-x-1/2 -translate-y-1/2`, isDarkMode ? 'bg-blue-400/20' : 'bg-blue-200/50')}></div>
            </div>

            <div className="relative z-10 max-w-xl text-center">
                <div className={clsx(`mx-auto mb-16 w-80 h-80 rounded-full overflow-hidden border-4 
                            shadow-2xl transition-all duration-500 group cursor-pointer`, logoShadowClass,
                            isDarkMode ? 'border-blue-400/50' : 'border-white/50')}>
                  
                    <img 
                        src="./logo.jpeg"
                        alt="Kibran Pharmaceutical Wholesale Logo" 
                        className="w-full h-full object-cover animate-fadeInDown transition-all duration-500 ease-out group-hover:scale-105"
                        // Placeholder uses KIBRAN_COLOR for consistency
                        onError={(e) => { 
                            const target = e.currentTarget as HTMLImageElement;
                            const placeholderSrc = `https://placehold.co/320x320/${KIBRAN_COLOR.substring(1)}/d1d5db?text=KIBRAN+LOGO`;
                            if (target.src !== placeholderSrc) {
                                target.onerror = null; 
                                target.src = placeholderSrc; 
                            }
                        }}
                    />
                </div>
                
            
                
                <p className={`text-2xl leading-relaxed font-light opacity-90 mb-12 inline-block`}>
                    {bodyText}
                </p>
                
                <div className="flex justify-center items-center space-x-12 animate-fadeInUp delay-500">
                    <Icons.PillBottleIcon 
                        className={clsx(`w-16 h-16 stroke-1.5 transform hover:scale-110 transition-transform duration-500`, isDarkMode ? 'text-blue-300' : 'text-blue-600')} 
                        style={{ color: isDarkMode ? KIBRAN_COLOR_LIGHT : KIBRAN_COLOR, filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))' }}
                    />
                    
                    <Icons.DeliveryTruckIcon 
                        className={clsx(`w-16 h-16 stroke-1.5 animate-pulse-fast transition-transform duration-500`, isDarkMode ? 'text-blue-300' : 'text-blue-600')} 
                        style={{ color: isDarkMode ? KIBRAN_COLOR_LIGHT : KIBRAN_COLOR, filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))' }}
                    />
                </div>
            </div>
        </div>
    );
};