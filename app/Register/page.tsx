'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';

import { clsx, checkPasswordCriteria, EMAIL_REGEX } from '../lib/utility';
import { DARK_MODE_BACKGROUND_IMAGE, LIGHT_MODE_BACKGROUND_IMAGE, DARK_OVERLAY, LIGHT_OVERLAY, USER_ROLES } from '../lib/constants';
import { FormData, FormErrors, AlertMessage } from '../lib/types';

import { CustomAlert } from '../Components/ui/CustomAlert';
import { PharmacyHero } from '../Components/PharmacyHero';
import { FormSection } from '../Components/FormSection';
import { ThemeToggleButton } from '../Components/ThemeToggleButton';

// --- Main Application Component (Container) ---
const Page = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        username: '', email: '', password: '', confirmPassword: '', role: USER_ROLES[USER_ROLES.length - 1], // Default to 'Cashier'
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [message, setMessage] = useState<AlertMessage>({ text: '', type: '' });

    // Refs for focus management
    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const submitButtonRef = useRef<HTMLButtonElement>(null);

    const toggleTheme = useCallback(() => setIsDarkMode(prev => !prev), []);

    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message.text]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Clear error for the current field as the user leaves it
        setFormErrors(prev => ({ ...prev, [name]: '' }));

        // Validation logic for specific fields on blur
        if (name === 'confirmPassword' && formData.password !== value) {
            setFormErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
        } else if (name === 'password') {
            const criteriaMet = Object.values(checkPasswordCriteria(value)).every(v => v);
            if (!criteriaMet && value.length > 0) {
                 setFormErrors(prev => ({ ...prev, password: 'Password must meet all security criteria.' }));
            }
        } else if (name === 'email') {
            if (value.length > 0 && !EMAIL_REGEX.test(value)) {
                setFormErrors(prev => ({ ...prev, email: 'Please enter a valid email address.' }));
            }
        }

    }, [formData.password]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, nextRef: React.RefObject<HTMLInputElement> | null) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            } else if (submitButtonRef.current) {
                submitButtonRef.current.focus();
            }
        }
    }, []);

    // Modularized Validation Logic
    const validate = useCallback(() => {
        let errors: FormErrors = {};
        let isValid = true;

        if (!formData.username) { errors.username = 'Username is required.'; isValid = false; }

        if (!formData.email) {
            errors.email = 'Email address is required.';
            isValid = false;
        } else if (!EMAIL_REGEX.test(formData.email)) {
            errors.email = 'Please enter a valid email address.';
            isValid = false;
        }

        const criteriaMet = Object.values(checkPasswordCriteria(formData.password)).every(v => v);
        if (!criteriaMet) {
            errors.password = 'Password must meet all security criteria (Min 8 Chars, Uppercase, Lowercase, Number, Special Char).';
            isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match.'; isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    }, [formData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (validate()) {
            console.log('Kibran Registration Data Validated:', formData);
            setMessage({ text: 'User account created successfully in Kibran Stock System!', type: 'success' });

            // Simulate form reset
            setFormData({
                username: '', email: '', password: '', confirmPassword: '', role: USER_ROLES[USER_ROLES.length - 1]
            });
            setFormErrors({});
            if(usernameRef.current) { usernameRef.current.focus(); }
        } else {
            setMessage({ text: 'Please review and correct the errors in the form.', type: 'error' });
        }
    };

    return (
        <div className={clsx("min-h-screen flex flex-col lg:flex-row font-[Poppins,sans-serif] transition-colors duration-700 relative z-0",
            isDarkMode ? 'bg-slate-900' : 'bg-white')}
            style={{
                backgroundImage: `url(${isDarkMode ? DARK_MODE_BACKGROUND_IMAGE : LIGHT_MODE_BACKGROUND_IMAGE})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundBlendMode: 'multiply',
                backgroundColor: isDarkMode ? DARK_OVERLAY : LIGHT_OVERLAY
            }}
        >
            <div className="absolute inset-0 z-10"></div>

            <ThemeToggleButton isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

            <div className="flex flex-col lg:flex-row w-full relative z-20">
                <PharmacyHero isDarkMode={isDarkMode} />

                <FormSection
                    isDarkMode={isDarkMode}
                    formData={formData}
                    formErrors={formErrors}
                    handleChange={handleChange}
                    handleBlur={handleBlur as (e: React.FocusEvent<HTMLInputElement>) => void} // Type assertion since FormInput is only ever HTMLInputElement
                    handleKeyDown={handleKeyDown}
                    handleSubmit={handleSubmit}
                    usernameRef={usernameRef}
                    emailRef={emailRef}
                    passwordRef={passwordRef}
                    confirmPasswordRef={confirmPasswordRef}
                    submitButtonRef={submitButtonRef}
                />
            </div>

            <CustomAlert message={message.text} type={message.type} onClose={() => setMessage({ text: '', type: '' })} />
        </div>
    );
};

export default Page;