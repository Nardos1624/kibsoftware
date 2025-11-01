import React, { useState, forwardRef, memo, Ref } from 'react';
import { Icons } from '../../Components/ui/Icons';
import { clsx } from '../../lib/utility';
import { KIBRAN_COLOR, KIBRAN_COLOR_LIGHT } from '../../lib/constants';

interface FormInputProps {
    name: string;
    type?: 'text' | 'email' | 'password' | 'number';
    label: string;
    icon: (props: IconProps) => JSX.Element;
    isRequired: boolean;
    error?: string;
    isDarkMode: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

// --- Form Input Component (Updated for Deep Blue Theme) ---
const FormInputComponent: React.FC<FormInputProps & { ref: Ref<HTMLInputElement> }> = forwardRef(({
    name, type = 'text', label, icon: Icon, isRequired, error, isDarkMode,
    value, onChange, onKeyDown, onBlur
}, ref) => {
    const isPasswordField = name.toLowerCase().includes('password');
    const [showPassword, setShowPassword] = useState(false);

    const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

    // Use inline style for custom Kibran color where Tailwind utility classes are not available
    // and rely on custom classes defined below for focus/hover.
    const labelClasses = clsx(
        "block text-base font-medium transition-colors duration-500 mb-1",
        isDarkMode ? 'text-blue-300' : 'text-slate-900'
    );

    const iconClasses = clsx(
        "absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-500",
        error ? 'text-red-500' : (isDarkMode ? 'text-blue-400' : 'text-slate-700')
    );

    const inputClasses = clsx(
        "w-full pl-12 py-3.5 border rounded-xl shadow-lg outline-none transition-all duration-300 font-semibold text-sm appearance-none",
        isPasswordField ? 'pr-12' : 'pr-4',
        error ? 'border-red-500 ring-2 ring-red-500/50' : `hover:border-[${KIBRAN_COLOR_LIGHT}]`, // Use KIBRAN_COLOR_LIGHT for light hover
        isDarkMode
            ? `bg-slate-700 text-slate-100 border-slate-600 focus:border-[${KIBRAN_COLOR_LIGHT}] focus:ring-2 focus:ring-[${KIBRAN_COLOR_LIGHT}]/50` // Use KIBRAN_COLOR_LIGHT for focus
            : `bg-white/70 text-black border-gray-300 focus:border-[${KIBRAN_COLOR}] focus:ring-2 focus:ring-[${KIBRAN_COLOR}]/50 placeholder:text-slate-700/70` // Use KIBRAN_COLOR for focus
    );


    return (
        <div className="mb-6">
            <label htmlFor={name} className={labelClasses}>
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <Icon className={iconClasses} style={!isDarkMode ? { color: KIBRAN_COLOR } : {}} />


                <input
                    id={name}
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    onBlur={onBlur}
                    ref={ref}
                    required={isRequired}
                    className={inputClasses}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${name}-error` : undefined}
                />

                {isPasswordField && (
                    <button
                           type="button"
                           onClick={() => setShowPassword(prev => !prev)}
                           className={clsx(
                               "absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors duration-200",
                               isDarkMode ? 'text-slate-400 hover:text-blue-400' : `text-slate-600 hover:text-[${KIBRAN_COLOR}]` // Use KIBRAN_COLOR for hover
                           )}
                           aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <Icons.EyeOffIcon className="w-5 h-5" /> : <Icons.EyeIcon className="w-5 h-5" />}
                    </button>
                )}
            </div>
            {error && (
                <p id={`${name}-error`} className="mt-1 text-xs text-red-500 font-medium flex items-center ml-1" role="alert">
                    <Icons.AlertIcon className="w-4 h-4 mr-1"/>
                    {error}
                </p>
            )}
        </div>
    );
});

FormInputComponent.displayName = 'FormInput';

export const FormInput = memo(FormInputComponent);