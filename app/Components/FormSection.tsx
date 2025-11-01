import React, { RefObject } from 'react';
import Link from 'next/link';
import { Icons } from '../Components/ui/Icons'
import { clsx } from '../lib/utility';
import { FormData, FormErrors } from '../lib/types'
import { FormInput } from './ui/FormInput';
import { KIBRAN_COLOR, KIBRAN_COLOR_HOVER, KIBRAN_COLOR_LIGHT } from '../lib/constants';

interface FormSectionProps {
    isDarkMode: boolean;
    formData: FormData;
    formErrors: FormErrors;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, nextRef: RefObject<HTMLInputElement> | null) => void;
    handleSubmit: (e: React.FormEvent) => void;
    usernameRef: RefObject<HTMLInputElement>;
    emailRef: RefObject<HTMLInputElement>;
    passwordRef: RefObject<HTMLInputElement>;
    confirmPasswordRef: RefObject<HTMLInputElement>;
    submitButtonRef: RefObject<HTMLButtonElement>;
}

// --- Form Section (Right Column) (Updated for Deep Blue Theme) ---
export const FormSection: React.FC<FormSectionProps> = ({
    isDarkMode, formData, formErrors, handleChange, handleBlur, handleKeyDown,
    handleSubmit, usernameRef, emailRef, passwordRef,
    confirmPasswordRef, submitButtonRef
}) => {
    // Changed gradients to Kibran colors
    const primaryTextGradient = 'bg-gradient-to-r from-[#003A70] to-blue-900'; // KIBRAN_COLOR to dark blue
    const darkTextGradient = 'bg-gradient-to-r from-blue-400 to-[#1A6AA5]'; // Light blue to KIBRAN_COLOR_LIGHT
    const buttonGradient = 'from-[#003A70] to-blue-800'; // KIBRAN_COLOR to dark blue
    const buttonHover = 'hover:from-[#1A6AA5] hover:to-[#003A70]'; // KIBRAN_COLOR_LIGHT to KIBRAN_COLOR

    return (
        <div className={clsx(`w-full lg:w-6/12 p-6 sm:p-12 md:p-16 lg:p-20 flex flex-col justify-center min-h-screen relative
            transition-colors duration-700 overflow-hidden animate-slideInRight bg-transparent`)}
        >
            <div className={clsx("relative z-10 max-w-md mx-auto w-full p-0 sm:p-0 rounded-2xl transition-all duration-700",
                                isDarkMode ? 'text-slate-100' : 'text-slate-900')}>

                <div className="transition-colors duration-700">

                    <h1 className={clsx(`text-4xl sm:text-5xl font-extrabold mb-2 transition-colors duration-500
                        bg-clip-text text-transparent`, isDarkMode ? darkTextGradient : primaryTextGradient)}
                        style={{ // Custom gradient for light mode
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
                            onKeyDown={(e) => handleKeyDown(e, emailRef)}
                        />
                        <FormInput
                            name="email" type="email" label="Email Address" icon={Icons.MailIcon} isRequired={true}
                            error={formErrors.email} isDarkMode={isDarkMode}
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            ref={emailRef}
                            onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                        />
                        <FormInput
                            name="password" type="password" label="Password" icon={Icons.LockIcon} isRequired={true}
                            error={formErrors.password} isDarkMode={isDarkMode}
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            ref={passwordRef}
                            onKeyDown={(e) => handleKeyDown(e, confirmPasswordRef)}
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

                        {/* Note: The original role selection input was missing from the form, so I've omitted it here to maintain the original component's form structure and focus flow. */}

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
                            style={{ // Custom gradient for submit button
                                backgroundImage: `linear-gradient(to right, ${KIBRAN_COLOR}, ${KIBRAN_COLOR_HOVER})`,
                            }}
                        >
                            Sign Up
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