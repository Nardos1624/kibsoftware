'use client';
import Link from 'next/link';
import React, { RefObject } from 'react'; 
import { FormInput } from '../ui/FormInput'; 
import { Icons } from '../ui/Icons'; 
import { clsx } from '../../lib/types';
import { KIBRAN_COLOR, KIBRAN_COLOR_HOVER } from '../../lib/constants'; 
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
export const FormSection = ({
    isDarkMode, formData, formErrors, handleChange, handleBlur, handleKeyDown,
    handleSubmit, usernameRef, emailRef, passwordRef,
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
                    <form onSubmit={handleSubmit} noValidate>
                        {/* Username FIELD WITH PLACEHOLDER */}
                        <FormInput 
                            name="username" label="Username" 
                            type="text" 
                            icon={Icons.UserIcon} isRequired={true} 
                            errorMessage={formErrors.username} isDarkMode={isDarkMode}
                            value={formData.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            ref={usernameRef}
                            onKeyDown={(e) => handleKeyDown(e, emailRef as NextRefType)}
                            placeholder="Enter Username"
                        />
                        {/* EMAIL FIELD with placeholder */}
                        <FormInput 
                            name="email" type="email" label="Email Address" icon={Icons.MailIcon} isRequired={true} 
                            errorMessage={formErrors.email} isDarkMode={isDarkMode}
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            ref={emailRef}
                            onKeyDown={(e) => handleKeyDown(e, passwordRef as NextRefType)}
                            placeholder="Enter Email Address"
                        />
                        {/* PASSWORD FIELD with placeholder */}
                        <FormInput 
                            name="password" type="password" label="Password" icon={Icons.LockIcon} isRequired={true} 
                            errorMessage={formErrors.password} isDarkMode={isDarkMode}
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            ref={passwordRef}
                            onKeyDown={(e) => handleKeyDown(e, confirmPasswordRef as NextRefType)}
                            placeholder="Enter a secure password"
                        />
                        {/* CONFIRM PASSWORD FIELD with placeholder */}
                        <FormInput 
                            name="confirmPassword" type="password" label="Confirm Password" icon={Icons.LockIcon} isRequired={true} 
                            errorMessage={formErrors.confirmPassword} isDarkMode={isDarkMode}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            ref={confirmPasswordRef}
                            onKeyDown={(e) => handleKeyDown(e, null)}
                            placeholder="Confirm your password"
                        />
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