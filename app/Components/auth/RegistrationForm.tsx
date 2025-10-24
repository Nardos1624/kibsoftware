'use client';
import Link from 'next/link';
import React, { RefObject } from 'react'; 
// FIX 1: Assuming FormInput and Icons are from the same directory level as 'auth'
import { FormInput } from '../ui/FormInput'; 
import { Icons } from '../ui/Icons'; 
import { clsx } from '../../lib/types'; // FIX 2: Changed 'lib/types' to 'lib/utils'
import { KIBRAN_COLOR, KIBRAN_COLOR_HOVER } from '../../lib/constants'; 

// --- 1. Define Props Interface ---
interface FormSectionProps {
    isDarkMode: boolean;
    formData: {
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
        role: string;
    };
    formErrors: Record<string, string | undefined>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>, nextRef: RefObject<HTMLInputElement | HTMLButtonElement> | null) => void;
    
    handleSubmit: (e: React.FormEvent) => void;
    roles: string[];
    
    usernameRef: RefObject<HTMLInputElement | null>;
    emailRef: RefObject<HTMLInputElement | null>;
    passwordRef: RefObject<HTMLInputElement | null>;
    confirmPasswordRef: RefObject<HTMLInputElement | null>;
    submitButtonRef: RefObject<HTMLButtonElement | null>; 
}

// --- 2. Update Component Signature with Interface ---
export const FormSection = ({
    isDarkMode, formData, formErrors, handleChange, handleBlur, handleKeyDown,
    handleSubmit, roles, usernameRef, emailRef, passwordRef,
    confirmPasswordRef, submitButtonRef
}: FormSectionProps) => { 
    
    const primaryTextGradient = 'bg-gradient-to-r from-[#003A70] to-blue-900'; 
    const darkTextGradient = 'bg-gradient-to-r from-blue-400 to-[#1A6AA5]'; 
    const buttonGradient = 'from-[#003A70] to-blue-800'; 
    const buttonHover = 'hover:from-[#1A6AA5] hover:to-[#003A70]'; 

    const roleLabelClasses = clsx(
        "block text-base font-medium transition-colors duration-500 mb-1", 
        isDarkMode ? 'text-blue-300' : 'text-slate-900'
    );

    type NextRefType = RefObject<HTMLInputElement | HTMLButtonElement>;


    return (
        <div className={clsx(`w-full lg:w-6/12 p-6 sm:p-12 md:p-16 lg:p-20 flex flex-col justify-center min-h-screen relative 
            transition-colors duration-700 overflow-hidden animate-slideInRight bg-transparent`)}
        >
            <div className={clsx(`relative z-10 max-w-md mx-auto w-full p-0 sm:p-0 rounded-2xl transition-all duration-700`,
                            isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                
                <div className="transition-colors duration-700"> 
                    
                    <h1 className={clsx(`text-4xl sm:text-5xl font-extrabold mb-2 transition-colors duration-500 
                        bg-clip-text text-transparent`, isDarkMode ? darkTextGradient : primaryTextGradient)}
                        style={{ 
                            backgroundImage: isDarkMode ? undefined : `linear-gradient(to right, ${KIBRAN_COLOR}, ${KIBRAN_COLOR_HOVER})` 
                        }}
                    >
                        New User Access
                    </h1>
                    {/* <p className="mb-10 text-lg text-slate-600 dark:text-slate-400 transition-colors duration-500">
                        Assign a role and secure the new account details.
                    </p> */}

                    <form onSubmit={handleSubmit} noValidate>
                        <FormInput 
                            name="username" label="Username" icon={Icons.UserIcon} isRequired={true} 
                            error={formErrors.username} isDarkMode={isDarkMode}
                            value={formData.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            ref={usernameRef}
                            onKeyDown={(e) => handleKeyDown(e, emailRef as NextRefType)}
                        />
                        <FormInput 
                            name="email" type="email" label="Email Address" icon={Icons.MailIcon} isRequired={true} 
                            error={formErrors.email} isDarkMode={isDarkMode}
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            ref={emailRef}
                            onKeyDown={(e) => handleKeyDown(e, passwordRef as NextRefType)}
                        />
                        <FormInput 
                            name="password" type="password" label="Password" icon={Icons.LockIcon} isRequired={true} 
                            error={formErrors.password} isDarkMode={isDarkMode}
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            ref={passwordRef}
                            onKeyDown={(e) => handleKeyDown(e, confirmPasswordRef as NextRefType)}
                        />

                        <FormInput 
                            name="confirmPassword" type="password" label="Confirm Password" icon={Icons.LockIcon} isRequired={true} 
                            error={formErrors.confirmPassword} isDarkMode={isDarkMode}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            ref={confirmPasswordRef}
                            onKeyDown={(e) => handleKeyDown(e, null)}
                        />

                        {/* Role Selection Field: Fixed div nesting */}
                        {/* <div className="mb-8"> 
                            <label htmlFor="role" className={roleLabelClasses}> 
                                System Access Level <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Icons.RoleIcon className={clsx("absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-500",
                                    isDarkMode ? 'text-blue-400' : 'text-slate-700')}
                                    style={!isDarkMode ? { color: KIBRAN_COLOR } : {}} 
                                /> 
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                    onKeyDown={(e) => handleKeyDown(e as React.KeyboardEvent<HTMLSelectElement>, submitButtonRef as NextRefType)}
                                    className={clsx(`w-full pl-12 pr-10 py-3.5 border rounded-xl shadow-lg outline-none appearance-none transition-all duration-300 font-semibold text-sm cursor-pointer`,
                                        isDarkMode
                                            ? 'bg-slate-700 text-slate-100 border-slate-600 focus:border-[#1A6AA5] focus:ring-2 focus:ring-[#1A6AA5]/50' 
                                            : 'bg-white/70 text-slate-900 border-gray-300 focus:border-[#003A70] focus:ring-2 focus:ring-[#003A70]/50' 
                                    )}
                                >
                                    {roles.map(r => (
                                        <option key={r} value={r} className={isDarkMode ? 'bg-slate-700' : 'bg-white'}>
                                            {r}
                                        </option>
                                    ))}
                                </select>
                                <svg className={clsx("absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-500",
                                    isDarkMode ? 'text-slate-400' : 'text-slate-600')} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div> */}


                        {/* Submit Button */}
                        <button 
                            type="submit"
                            ref={submitButtonRef}
                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-2xl uppercase tracking-wider
                                transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.98]
                                bg-gradient-to-r ${buttonGradient} text-white 
                                ${buttonHover}
                                focus:outline-none focus:ring-4 focus:ring-blue-500/60
                            `}
                            style={{ 
                                backgroundImage: `linear-gradient(to right, ${KIBRAN_COLOR}, ${KIBRAN_COLOR_HOVER})`,
                            }}
                        >
                            SIGN UP
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-slate-600 dark:text-slate-400 transition-colors duration-500">
                        Already registered?
                        <Link href='./Login' className={clsx(`font-semibold ml-1 transition-colors duration-300 hover:underline`,
                            isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-800')}
                            style={!isDarkMode ? { color: KIBRAN_COLOR } : {}}
                            >
                            Log In here.
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};