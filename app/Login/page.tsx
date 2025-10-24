'use client';
import Link from 'next/link';
import React, { useState, useEffect, useCallback, useRef, forwardRef } from 'react';
// KIBRAN BRAND COLOR: Vibrant Blue, based on the logo
// UPDATED: Changed to slightly darker, deeper blue shades.
const KIBRAN_COLOR = '#003A70'; // Deeper Blue (Primary)
const KIBRAN_COLOR_HOVER = '#002C55'; // Darker for hover effect
const KIBRAN_COLOR_LIGHT = '#1A6AA5'; // Slightly darker light blue for dark mode contrast

// Class name helpers
const clsx = (...classes) => classes.filter(Boolean).join(' ');

// The backgrounds images and the overlay colors (Using placeholder assets)
const DARK_MODE_BACKGROUND_IMAGE = '/background2.jpg';
const LIGHT_MODE_BACKGROUND_IMAGE = '/background1.jpg'
const LIGHT_OVERLAY = 'rgba(255, 255, 255, 0.8)'; 
const DARK_OVERLAY = 'rgba(0, 0, 0, 0.4)';

// Assigning password criteria check function (Used here only for minimum length visual feedback)
const checkPasswordCriteria = (password) => ({
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password), 
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
});

// Icon defination (lucide-react equivalents used for portability)
const Icons = {
    UserIcon: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
    MailIcon: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>),
    LockIcon: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>),
    SunIcon: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2m-4-8H4m16 0h-2M6.34 6.34l1.41 1.41m12.71 12.71-1.41-1.41M6.34 17.66l1.41-1.41m12.71-12.71-1.41 1.41"/></svg>),
    MoonIcon: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>),
    CheckIcon: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>),
    AlertIcon: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>),
    EyeIcon: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>),
    EyeOffIcon: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a1.86 1.86 0 0 1-.3-1"/><path d="M22 12s-3 7-10 7a9.78 9.78 0 0 1-2.92-.52"/><line x1="2" y1="2" x2="22" y2="22"/></svg>),
    PillBottleIcon: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 20h4M12 20V4M10 4h4a3 3 0 0 1 3 3v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7a3 3 0 0 1 3-3z"/><circle cx="10" cy="9" r="0.5" fill="currentColor" stroke="none"/><circle cx="14" cy="12" r="0.5" fill="currentColor" stroke="none"/><circle cx="12" cy="15" r="0.5" fill="currentColor" stroke="none"/><rect x="9" y="3" width="6" height="2" rx="0.5" ry="0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
    DeliveryTruckIcon: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v14H1z"/><path d="M15 17h5l4-5V3H15z"/><circle cx="5.5" cy="19.5" r="2.5"/><circle cx="18.5" cy="19.5" r="2.5"/><polyline points="7 7 11 7 11 11 7 11"/></svg>),
    // Loader Icon for submission feedback
    LoaderIcon: (props) => (
        <svg className="animate-spin" viewBox="0 0 24 24" {...props}>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    ),
};

// --- Custom Alert Component ---
const CustomAlert = ({ message, type, onClose }) => {
    if (!message) return null;

    const baseClasses = "fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded-xl shadow-2xl z-[100] transition-all duration-500 max-w-sm w-11/12 flex items-center space-x-3";
    let typeClasses = "";
    let IconComponent = Icons.AlertIcon;

    if (type === 'success') {
        typeClasses = "bg-green-600 text-white border border-green-700";
        IconComponent = Icons.CheckIcon;
    } else if (type === 'error') {
        typeClasses = "bg-red-600 text-white border border-red-700";
        IconComponent = Icons.AlertIcon;
    }

    return (
        <div className={clsx(baseClasses, typeClasses)} role="alert" aria-live="assertive">
            <IconComponent className="w-6 h-6 flex-shrink-0"/>
            <span className="font-medium text-sm flex-grow">{message}</span>
            <button 
                onClick={onClose} 
                className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close notification"
            >
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
    );
};

// --- Form Input Component ---
const FormInput = React.memo(forwardRef(({ 
    name, type = 'text', label, icon: Icon, isRequired, error, isDarkMode, 
    value, onChange, onKeyDown, onBlur 
}, ref) => {
    const isPasswordField = name.toLowerCase().includes('password');
    const [showPassword, setShowPassword] = useState(false);

    const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

    // Adjusted label class for visual match
    const labelClasses = clsx(
        "block text-sm font-bold transition-colors duration-500 mb-1",
        isDarkMode ? 'text-blue-300' : 'text-slate-900'
    );

    // Adjusted icon positioning
    // CHANGED: Icon color relies on style prop instead of Tailwind class
    const iconClasses = clsx(
        "absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-500",
        error ? 'text-red-500' : (isDarkMode ? 'text-blue-400' : '') 
    );

    // Adjusted input classes for lighter appearance
    const inputClasses = clsx(
        "w-full pl-12 py-3 border rounded-xl shadow-md outline-none transition-all duration-300 font-normal text-base appearance-none",
        isPasswordField ? 'pr-12' : 'pr-4',
        error ? 'border-red-500 ring-1 ring-red-500/50' : 'border-gray-300 hover:border-blue-400',
        isDarkMode 
            ? 'bg-slate-700 text-slate-100 border-slate-600 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50' 
            // CHANGED: Removed Tailwind classes and rely on inline style for light mode focus/border
            : 'bg-white/90 text-black placeholder:text-gray-500' 
    );


    return (
        <div className="mb-6">
            <label htmlFor={name} className={labelClasses}>
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                {/* CHANGED: Apply KIBRAN_COLOR via style */}
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
                    // CHANGED: Focus border style applied inline
                    style={!isDarkMode ? { 
                        '--tw-ring-color': KIBRAN_COLOR, 
                        borderWidth: '1px',
                        borderColor: KIBRAN_COLOR_HOVER,
                        outlineColor: KIBRAN_COLOR_HOVER
                    } : {}}
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
                            isDarkMode ? 'text-slate-400 hover:text-blue-400' : 'text-slate-600 hover:text-opacity-80'
                        )}
                        // CHANGED: Eye icon hover uses the custom KIBRAN_COLOR_HOVER hex code in light mode.
                        style={!isDarkMode ? { color: KIBRAN_COLOR_HOVER } : {}}
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
}));

// --- Pharmacy Hero/Branding Component ---
const PharmacyHero = ({ isDarkMode }) => {
    // CHANGED: Shadow uses the lighter brand color for visibility (updated RGBA value)
    const logoShadowClass = isDarkMode ? 'hover:shadow-blue-500/80' : `hover:shadow-[0_20px_25px_-5px_rgba(0,76,153,0.6)]`; 

    return (
        <div className={clsx(`hidden lg:flex flex-col justify-center items-center pb-12 px-12 lg:w-6/12 min-h-screen relative 
            transition-all duration-700 ease-in-out overflow-hidden bg-transparent`,
            isDarkMode ? 'text-white' : 'text-slate-900')} 
        >
            <div className={clsx(`absolute inset-0 z-0 transition-opacity duration-700`, isDarkMode ? 'opacity-30' : 'opacity-10')}>
                <div className={clsx(`absolute w-96 h-96 rounded-full blur-3xl transition-all duration-1000 animate-pulse-slow top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2`, isDarkMode ? 'bg-blue-400/20' : 'bg-blue-300/50')}></div>
                <div className={clsx(`absolute w-64 h-32 rounded-full transform rotate-45 blur-3xl transition-all duration-1000 animate-pulse-fast bottom-1/4 right-1/4 translate-x-1/2 -translate-y-1/2`, isDarkMode ? 'bg-blue-400/20' : 'bg-blue-200/50')}></div>
            </div>

            <div className="relative z-10 max-w-xl text-center">
                <div className={clsx(`mx-auto mb-16 w-80 h-80 rounded-full overflow-hidden border-4 
                            shadow-2xl transition-all duration-500 group cursor-pointer`, logoShadowClass,
                            isDarkMode ? 'border-blue-400/50' : 'border-white/50')}>
                  
                    <img 
                        src="logo.jpeg"
                        alt="Kibran Pharmaceutical Wholesale Logo" 
                        className="w-full h-full object-cover animate-fadeInDown transition-all duration-500 ease-out group-hover:scale-105"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/320x320/1e293b/d1d5db?text=KIBRAN+LOGO"; }}
                    />
                </div>
                
                <p className={`text-2xl leading-relaxed font-light opacity-90 mb-12`}>
                    Log in to access your dashboard, manage inventory, and ensure medication distribution compliance.
                </p>
                
                <div className="flex justify-center items-center space-x-12 animate-fadeInUp delay-500">
                    <Icons.PillBottleIcon 
                        // CHANGED: Icon color uses the custom KIBRAN_COLOR hex code in light mode.
                        className={clsx(`w-16 h-16 stroke-1.5 transform hover:scale-110 transition-transform duration-500`, isDarkMode ? 'text-blue-300' : '')}
                        style={!isDarkMode ? { filter: 'drop-shadow(0 4px 6px rgba(0 0 0 / 0.2))', color: KIBRAN_COLOR } : { filter: 'drop-shadow(0 4px 6px rgba(0 0 0 / 0.2))' }}
                    />
                    
                    <Icons.DeliveryTruckIcon 
                        // CHANGED: Icon color uses the custom KIBRAN_COLOR hex code in light mode.
                        className={clsx(`w-16 h-16 stroke-1.5 animate-pulse-fast transition-transform duration-500`, isDarkMode ? 'text-blue-300' : '')}
                        style={!isDarkMode ? { filter: 'drop-shadow(0 4px 6px rgba(0 0 0 / 0.2))', color: KIBRAN_COLOR } : { filter: 'drop-shadow(0 4px 6px rgba(0 0 0 / 0.2))' }}
                    />
                </div>
            </div>
        </div>
    );
};

// --- Login Form Section (Right Column) ---
const FormSection = ({
    isDarkMode, formData, formErrors, handleChange, handleBlur, handleKeyDown,
    handleSubmit, emailRef, passwordRef, submitButtonRef, isLoading
}) => {
    
    // CHANGED: Heading gradient uses the custom KIBRAN_COLOR hex code and a slightly lighter shade for a smooth transition.
    const primaryTextGradientStyle = { backgroundImage: `linear-gradient(to right, ${KIBRAN_COLOR}, ${KIBRAN_COLOR_LIGHT})` }; 
    const darkTextGradient = 'bg-gradient-to-r from-blue-400 to-blue-200';
    
    // Adjusted button classes for a more prominent blue background and flatter look
    const buttonBaseClasses = 'w-full py-3.5 rounded-xl font-medium text-lg shadow-none mt-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-60';
    
    // CHANGED: Button uses KIBRAN_COLOR for background and hover effect (Updated hex codes)
    const buttonColorClasses = `text-white hover:bg-[#003E80] active:bg-[#002D64] focus:ring-[#004C99]`; 
    const buttonDisabledClasses = 'opacity-70 cursor-not-allowed bg-blue-400';

    // Helper to conditionally render the Link component only if it's imported (in a real Next.js app)
    const NextLink = ({ href, className, children }) => {
        // Since the 'Link' import is commented out, we use a simple <a> tag for portability.
        return <a href={href} className={className}>{children}</a>;
    };

    // FIX: Define baseLinkClasses here to resolve the ReferenceError.
    const baseLinkClasses = 'font-semibold ml-1 transition-colors duration-300 hover:underline cursor-pointer';

    // Conditional button style
    const buttonStyle = isLoading 
        ? {} 
        : { backgroundColor: KIBRAN_COLOR }; // CHANGED: Set background color here


    return (
        <div className={clsx(`w-full lg:w-6/12 p-6 sm:p-12 md:p-16 lg:p-20 flex flex-col justify-center min-h-screen relative 
            transition-colors duration-700 overflow-hidden animate-slideInRight bg-transparent`)}
        >
            <div className={clsx(`relative z-10 max-w-md mx-auto w-full p-0 sm:p-0 rounded-2xl transition-all duration-700`,
                            isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                
                <div className="transition-colors duration-700"> 
                    
                    <h1 className={clsx(`text-4xl sm:text-5xl font-extrabold mb-2 pb-6 transition-colors duration-500 
                        bg-clip-text text-transparent text-center`, isDarkMode ? darkTextGradient : '')}
                        // CHANGED: Apply custom gradient style inline
                        style={!isDarkMode ? primaryTextGradientStyle : {}}
                    >
                        Welcome Back
                    </h1>
                    <p className="mb-10 text-lg text-slate-600 dark:text-slate-400 transition-colors duration-500">
                        Sign in to access the Kibran Stock Management System.
                    </p>

                    <form onSubmit={handleSubmit} noValidate>
                        
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
                            onKeyDown={(e) => handleKeyDown(e, submitButtonRef)}
                        />

                        {/* Submit Button - Updated with simpler styling and loading state feedback */}
                        <button 

                            type="submit"
                            ref={submitButtonRef}
                            disabled={isLoading}
                            className={clsx(
                                buttonBaseClasses,
                                "flex items-center justify-center space-x-2",
                                isLoading ? buttonDisabledClasses : buttonColorClasses
                            )}
                            // CHANGED: Apply custom KIBRAN_COLOR style inline
                            style={buttonStyle}
                        >
                            {isLoading ? (
                                <>
                                    <Icons.LoaderIcon className="w-5 h-5 text-white" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <span className='cursor-pointer'>LOG IN</span>
                            )}
                        </button>
                    </form>

                    {/* New links container for Forgot Password and Register */}
                    <div className="flex justify-between items-center mt-6 text-xs text-slate-600 dark:text-slate-400 transition-colors duration-500">
                        {/* Forgotten Password Link - Classes applied directly */}
                        <Link 
                            href='../ChangePassword' 
                            className={clsx(baseLinkClasses, isDarkMode ? 'text-blue-500 hover:text-blue-400' : 'hover:text-opacity-80')}
                            // CHANGED: Link color uses the custom KIBRAN_COLOR hex code in light mode.
                            style={!isDarkMode ? { color: KIBRAN_COLOR } : {}}
                        >
                            change Password?
                        </Link>

                        {/* Register Link - Classes applied directly for consistency */}
                        <p className="text-center font-bold">
                            New user?
                            <Link 
                                href='/Registration' 
                                className={clsx(baseLinkClasses, isDarkMode ? 'text-blue-500 hover:text-blue-400' : 'hover:text-opacity-80')}
                                // CHANGED: Link color uses the custom KIBRAN_COLOR hex code in light mode.
                                style={!isDarkMode ? { color: KIBRAN_COLOR} : {}}
                            >
                                Register here.
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Application Component (Container) ---
const App = () => { 
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // New loading state for submission
    const [formData, setFormData] = useState({
        email: '', password: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [message, setMessage] = useState({ text: '', type: '' });

    // Refs for focus management
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const submitButtonRef = useRef(null);

    const toggleTheme = () => setIsDarkMode(prev => !prev);
    
    // Auto-hide alert message
    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message.text]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []); 

    const handleBlur = useCallback((e) => {
        const { name, value } = e.target;
        
        setFormErrors(prev => ({ ...prev, [name]: '' }));
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (name === 'email') {
            if (value.length > 0 && !emailRegex.test(value)) {
                setFormErrors(prev => ({ ...prev, email: 'Please enter a valid email address.' }));
            }
        } else if (name === 'password') {
            // Check for minimum length criteria from the source code
            if (value.length > 0 && value.length < 8) {
                setFormErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters long.' }));
            }
        }
        
    }, []); 

    
    const handleKeyDown = useCallback((e, nextRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            } else if (submitButtonRef.current) {
                submitButtonRef.current.focus();
            }
        }
    }, []); 

    // **Login Validation Logic**
    const validate = useCallback(() => {
        let errors = {};
        let isValid = true;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!formData.email) {
            errors.email = 'Email address is required.'; 
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            errors.email = 'Please enter a valid email address.'; 
            isValid = false;
        }

        if (!formData.password) {
            errors.password = 'Password is required.';
            isValid = false;
        } else if (formData.password.length < 8) {
             // Retaining the minimum length criteria check requested (Min 8 Chars)
            errors.password = 'Password must be at least 8 characters long.';
            isValid = false;
        }
        
        setFormErrors(errors);
        return isValid;
    }, [formData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' }); 
        
        if (validate()) {
            setIsLoading(true); // Start loading state

            // Success: Simulate async login process (e.g., API call)
            console.log('Kibran Login Data Validated. Simulating API call...');

            // Simulating a 1.5 second API request delay
            setTimeout(() => {
                setIsLoading(false); // Stop loading state

                // In a real application, you would check the API response here.
                const loginSuccess = true; // Assume success for simulation

                if (loginSuccess) {
                    setMessage({ text: 'Login successful! Redirecting to dashboard...', type: 'success' }); 

                    // Simulate form reset after successful login attempt
                    setFormData({
                        email: '', password: ''
                    });
                    setFormErrors({});
                    if(emailRef.current) { emailRef.current.focus(); } 
                } else {
                    // Handle actual API failure (e.g., incorrect credentials)
                    setMessage({ text: 'Login failed. Check your email and password.', type: 'error' });
                }

            }, 1500); // 1.5 second delay simulation

        } else {
            // Validation failed before submission
            setMessage({ text: 'Please correct the errors in the form and try again.', type: 'error' });
        }
    };
    
    return (
        <div className={clsx(`min-h-screen flex flex-col lg:flex-row font-sans antialiased transition-colors duration-700 relative z-0`,
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
                // CHANGED: Theme toggle button uses the custom KIBRAN_COLOR for contrast
                style={!isDarkMode ? { color: KIBRAN_COLOR } : {}}
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
                    emailRef={emailRef}
                    passwordRef={passwordRef}
                    submitButtonRef={submitButtonRef}
                    isLoading={isLoading}
                />
            </div>

            <CustomAlert message={message.text} type={message.type} onClose={() => setMessage({ text: '', type: '' })} />
        </div>
    );
};

export default App;
