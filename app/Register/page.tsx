'use client';
import React, { useState, useEffect, useCallback, useRef, RefObject } from 'react';

// NOTE: Using the relative paths you provided. Check if 'Components' should be 'components'.
import { PharmacyHero } from '../Components/PharmacyHero'; 
import { FormSection } from '../Components/auth/RegistrationForm'; 
import { CustomAlert } from '../Components/ui/CustomAlert'; 
import { Icons } from '../Components/ui/Icons'; // Assuming this is correct
import { clsx, checkPasswordCriteria } from '../lib/types'; // Assuming this is correct

import { 
    KIBRAN_COLOR, KIBRAN_COLOR_LIGHT, ROLES, 
    DARK_MODE_BACKGROUND_IMAGE, LIGHT_MODE_BACKGROUND_IMAGE, 
    DARK_OVERLAY, LIGHT_OVERLAY 
} from '../lib/constants'; 


// --- Main Application Component (Container) ---
const Page = () => { 
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', confirmPassword: '', role: 'Cashier',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({}); 
    const [message, setMessage] = useState({ text: '', type: '' });

    // Refs with correct, nullable types
    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const submitButtonRef = useRef<HTMLButtonElement>(null); 

    const roles = ROLES;

    const toggleTheme = () => setIsDarkMode(prev => !prev);
    
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
        
        setFormErrors(prev => ({ ...prev, [name]: '' }));
        
        if (name === 'confirmPassword' && formData.password !== value) {
            setFormErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
        } else if (name === 'password') {
            const criteriaMet = Object.values(checkPasswordCriteria(value)).every(v => v);
            if (!criteriaMet && value.length > 0) {
                setFormErrors(prev => ({ ...prev, password: 'Password must meet all security criteria.' }));
            }
        } else if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value.length > 0 && !emailRegex.test(value)) {
                setFormErrors(prev => ({ ...prev, email: 'Please enter a valid email address.' }));
            }
        }
    }, [formData.password]); 

    
    const handleKeyDown = useCallback((
        e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>, 
        nextRef: RefObject<HTMLInputElement | HTMLButtonElement> | null
    ) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            } else if (submitButtonRef.current) {
                submitButtonRef.current.focus();
            }
        }
    }, []); 

    const validate = useCallback(() => {
        const errors: Record<string, string> = {}; 
        let isValid = true;

        if (!formData.username) { errors.username = 'Username is required.'; isValid = false; }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!formData.email) {
            errors.email = 'Email address is required.'; 
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
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
                username: '', email: '', password: '', confirmPassword: '', role: 'Cashier'
            });
            setFormErrors({});
            if(usernameRef.current) { usernameRef.current.focus(); } 
        } else {
            setMessage({ text: 'Please review and correct the errors in the form.', type: 'error' });
        }
    };
    
    return (
        <div className={clsx(`min-h-screen flex flex-col lg:flex-row font-[Poppins,sans-serif] transition-colors duration-700 relative z-0`,
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
            
            <div className="flex flex-col lg:flex-row w-full relative z-20">
                <PharmacyHero isDarkMode={isDarkMode} />
                
                <FormSection 
                    isDarkMode={isDarkMode}
                    formData={formData}
                    formErrors={formErrors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    handleKeyDown={handleKeyDown}
                    handleSubmit={handleSubmit}
                    roles={roles}
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

// CRITICAL: Must be exported as default
export default Page;