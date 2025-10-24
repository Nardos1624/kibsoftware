// components/ui/FormInput.tsx

import React from 'react';
import { clsx } from '../../lib/types'; // Adjust path as necessary
import { KIBRAN_COLOR } from '../../lib/constants'; // Adjust path as necessary

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label: string;
    type: string;
    icon: React.ElementType; // The component function for the icon
    isRequired?: boolean;
    isDarkMode: boolean;
    value: string | number;
    // ADDED: Optional placeholder property
    placeholder?: string; 
}

// ForwardRef is used to allow the component to be focused/manipulated by the parent if needed
export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    ({ name, label, type, icon, isRequired = false, isDarkMode, className, value, onChange, placeholder, ...rest }, ref) => {
        
    // Rename the prop 'icon' to 'Icon' (capitalized) for React rendering.
    const Icon = icon; 

    const inputClasses = clsx(
        "w-full pl-12 pr-4 py-3 border rounded-xl shadow-lg outline-none transition-all duration-300 font-medium text-sm",
        isDarkMode 
            ? 'bg-slate-700 text-slate-100 border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 placeholder-slate-400' 
            : 'bg-white/95 text-slate-900 border-gray-300 shadow-md focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700/50 placeholder-gray-500'
    );
    
    const iconClasses = clsx(
        "absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-500 z-10", 
        isDarkMode ? 'text-blue-400' : 'text-slate-700'
    );
    
    return (
        <div className="mb-4">
            <label htmlFor={name} className={clsx("block text-base font-medium transition-colors duration-500 mb-1", isDarkMode ? 'text-blue-300' : 'text-slate-900')}>
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <Icon 
                    className={iconClasses} 
                    style={!isDarkMode ? { color: KIBRAN_COLOR } : {}} 
                />
                
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    required={isRequired}
                    ref={ref}
                    className={clsx(inputClasses, className)}
                    placeholder={placeholder} // ADDED: Placeholder prop
                    {...rest}
                />
            </div>
        </div>
    );
});

FormInput.displayName = 'FormInput';