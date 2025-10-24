'use client';

import React, { useState, useCallback } from 'react';

// --- Consolidated Dependencies: ICONS, TYPES, CONSTANTS, UTILS ---

// 1. ICONS (Moved inline to resolve import path issues)

export interface IconProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
}

const BaseIcon: React.FC<IconProps> = ({ children, className = "w-6 h-6", ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        {...props}
    >
        {children}
    </svg>
);

// Standard Icons
const UserIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </BaseIcon>
);

const MailIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </BaseIcon>
);

const LockIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </BaseIcon>
);

const PhoneIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-3.67-2.94L3.93 11.4A1.85 1.85 0 0 1 3 10.5V7c0-1.1.9-2 2-2h3" />
        <path d="M18 9a6 6 0 0 0-6-6h-1" />
    </BaseIcon>
);

const CalendarIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </BaseIcon>
);

const BuildingIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="7" y1="5" x2="7" y2="19" />
        <line x1="17" y1="5" x2="17" y2="19" />
    </BaseIcon>
);

// Health/Delivery Specific Icons
const PillBottleIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <path d="M10 5V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M16 11H8" />
        <path d="M16 15H8" />
    </BaseIcon>
);

const DeliveryTruckIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <path d="M12 18H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
        <path d="M15 18h2a2 2 0 0 0 2-2v-3" />
        <path d="M12 11h9" />
    </BaseIcon>
);

// Utility/State Icons
const EyeIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </BaseIcon>
);

const EyeOffIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a1.8 1.8 0 0 1 1.05-1.05M22 12s-3 7-10 7c-1.39 0-2.73-.24-4-.72" />
        <path d="M10.94 5.06A12.01 12.01 0 0 0 12 4c7 0 10 7 10 7a1.8 1.8 0 0 1-1.05 1.05" />
        <path d="m14 14.12-1.47-1.47a2 2 0 0 0-2.83 0" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </BaseIcon>
);

const AlertIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </BaseIcon>
);

const CheckIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <polyline points="20 6 9 17 4 12" />
    </BaseIcon>
);

// 2. TYPES, CONSTANTS, UTILS

export interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    dateOfBirth: string;
    role: string;          
    pharmacyName: string;  
    deliveryAddress: string; 
}

export type AlertType = 'info' | 'error' | 'success';
export interface AlertMessage {
    type: AlertType;
    message: string;
}

// Simple clsx equivalent for Tailwind class joining
const clsx = (...args: (string | boolean | null | undefined)[]) => args.filter(Boolean).join(' ');

// Example constant 
const KIBRAN_COLOR = '#003A70'; 


// --- FormInput Component (Nested Helper) ---

interface FormInputProps {
    name: keyof FormData;
    label: string;
    type?: string;
    icon: React.FC<IconProps>;
    isRequired?: boolean;
    error?: string;
    isDarkMode: boolean;
    // FIX: Ensure 'value' can handle undefined or null in case the parent state isn't initialized,
    // although React typically forces controlled components to use empty string if undefined.
    value: string | undefined; 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({
    name,
    label,
    type = 'text',
    icon: Icon,
    isRequired = false,
    error,
    isDarkMode,
    value,
    onChange,
    onKeyDown,
    onBlur,
}) => {
    // FIX for 'Cannot read properties of undefined (reading 'toLowerCase')'
    const nameString = name ? String(name) : '';
    const isPasswordField = nameString.toLowerCase().includes('password'); 
    
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const currentType = (isPasswordField && isPasswordVisible) ? 'text' : type;
    const inputId = nameString ? nameString.toLowerCase() : 'unknown-input'; 
    const primaryColor = isDarkMode ? 'text-blue-400' : `text-[${KIBRAN_COLOR}]`;
    const focusRingColor = isDarkMode ? 'focus:ring-blue-500' : 'focus:ring-[#1A6AA5]';

    return (
        <div className="mb-6 relative">
            <label htmlFor={inputId} className={clsx(
                "block text-sm font-semibold mb-2 transition-colors duration-300",
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <input
                    id={inputId}
                    name={name}
                    type={currentType}
                    required={isRequired}
                    // Crucial FIX for "changing an uncontrolled input to be controlled" warning
                    // If the parent component passes undefined, it must be treated as an empty string for a controlled input.
                    value={value ?? ''}
                    onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                    onKeyDown={onKeyDown}
                    onBlur={onBlur}
                    className={clsx(
                        "w-full py-3 pl-12 pr-4 border rounded-xl shadow-inner transition-all duration-300",
                        isDarkMode 
                            ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400',
                        error 
                            ? 'border-red-500 ring-2 ring-red-500/50' 
                            : `focus:border-[#1A6AA5] focus:ring-2 ${focusRingColor}/50`
                    )}
                    placeholder={`Enter ${label}`}
                />
                <div className={clsx(
                    "absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300",
                    primaryColor
                )}>
                    <Icon className="w-5 h-5" />
                </div>

                {isPasswordField && (
                    <button
                        type="button"
                        onClick={() => setIsPasswordVisible(prev => !prev)}
                        className={clsx(
                            "absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors duration-300",
                            isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
                        )}
                        aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                    >
                        {isPasswordVisible ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                )}
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-500 flex items-center">
                    <AlertIcon className="w-4 h-4 mr-1 inline" />
                    {error}
                </p>
            )}
        </div>
    );
};

// --- CustomAlert Component (Nested Helper) ---

interface CustomAlertProps {
    message: string;
    type: AlertMessage['type'];
    onClose: () => void;
    isDarkMode: boolean;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, type, onClose, isDarkMode }) => {
    if (!message) return null;

    const baseClasses = "fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded-xl shadow-2xl z-[100] transition-all duration-500 max-w-sm w-11/12 flex items-center space-x-3";
    let typeClasses = "";
    let IconComponent: React.FC<IconProps> = AlertIcon; 

    if (type === 'success') {
        typeClasses = "bg-green-600 text-white border border-green-700";
        IconComponent = CheckIcon;
    } else if (type === 'error') {
        typeClasses = "bg-red-600 text-white border border-red-700";
        IconComponent = AlertIcon;
    } else if (type === 'info') {
        typeClasses = clsx(
            "border",
            isDarkMode 
                ? "bg-blue-800 text-blue-100 border-blue-700" 
                : "bg-blue-500 text-white border-blue-600"
        );
        IconComponent = AlertIcon; 
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


// --- Main FormSection Component ---

interface FormSectionProps {
    formData: FormData;
    errors: Partial<Record<keyof FormData, string>>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    isDarkMode: boolean;
}

const initialAlert: AlertMessage = { type: 'info', message: 'Ready to register.' };

const FormSection: React.FC<FormSectionProps> = ({ 
    formData, 
    // FIX 1: Default errors to an empty object if undefined is passed, preventing the crash on initial render.
    errors = {} as Partial<Record<keyof FormData, string>>, 
    handleChange, 
    handleKeyDown, 
    handleBlur, 
    isDarkMode 
}) => {
    const [alertMessage, setAlertMessage] = useState<AlertMessage>(initialAlert);
    const [isAlertVisible, setIsAlertVisible] = useState(true);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Simple client-side validation check (only checks if all required fields have a value)
        const requiredFields: (keyof FormData)[] = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'role', 'pharmacyName'];
        const hasMissingFields = requiredFields.some(field => !formData[field]);

        if (hasMissingFields) {
            setAlertMessage({ type: 'error', message: 'Please fill out all required fields (*).' });
            setIsAlertVisible(true);
            return;
        }

        // --- Mock API Call / Success Simulation ---
        console.log("Submitting form data:", formData);
        
        // Success alert demonstration
        setAlertMessage({ type: 'success', message: 'Registration successful! Processing account creation.' });
        setIsAlertVisible(true);
        
        // Optional: clear form data here
    };

    const closeAlert = useCallback(() => {
        setIsAlertVisible(false);
    }, []);


    return (
        <div className={clsx(
            "p-6 md:p-8 rounded-2xl shadow-2xl transition-all duration-500",
            isDarkMode ? 'bg-slate-800/80 shadow-slate-900/50' : 'bg-white shadow-xl'
        )}>
            <h2 className={clsx(
                "text-2xl font-extrabold mb-8 text-center transition-colors duration-500",
                isDarkMode ? 'text-blue-300' : 'text-[#003A70]'
            )}>
                Account Registration
            </h2>
            
            {isAlertVisible && (
                <CustomAlert 
                    message={alertMessage.message} 
                    type={alertMessage.type} 
                    onClose={closeAlert} 
                    isDarkMode={isDarkMode}
                />
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    {/* First Name Field */}
                    <FormInput
                        name="firstName" 
                        label="First Name"
                        icon={UserIcon}
                        isRequired={true}
                        error={errors.firstName} // This now safely reads from {} if errors was undefined
                        isDarkMode={isDarkMode}
                        value={formData.firstName}
                        onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                    />
                    
                    {/* Last Name Field */}
                    <FormInput
                        name="lastName" 
                        label="Last Name"
                        icon={UserIcon}
                        isRequired={true}
                        error={errors.lastName}
                        isDarkMode={isDarkMode}
                        value={formData.lastName}
                        onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                    />

                    {/* Email Field */}
                    <FormInput
                        name="email" 
                        type="email"
                        label="Email Address"
                        icon={MailIcon}
                        isRequired={true}
                        error={errors.email}
                        isDarkMode={isDarkMode}
                        value={formData.email}
                        onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                    />

                    {/* Password Field */}
                    <FormInput
                        name="password" 
                        type="password"
                        label="Password"
                        icon={LockIcon}
                        isRequired={true}
                        error={errors.password}
                        isDarkMode={isDarkMode}
                        value={formData.password}
                        onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                    />

                    {/* Confirm Password Field */}
                    <FormInput
                        name="confirmPassword" 
                        type="password"
                        label="Confirm Password"
                        icon={LockIcon}
                        isRequired={true}
                        error={errors.confirmPassword}
                        isDarkMode={isDarkMode}
                        value={formData.confirmPassword}
                        onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                    />

                    {/* Phone Number Field */}
                    <FormInput
                        name="phoneNumber" 
                        type="tel"
                        label="Phone Number"
                        icon={PhoneIcon}
                        isRequired={false}
                        error={errors.phoneNumber}
                        isDarkMode={isDarkMode}
                        value={formData.phoneNumber}
                        onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                    />
                    
                    {/* Date of Birth Field */}
                    <FormInput
                        name="dateOfBirth" 
                        type="date"
                        label="Date of Birth"
                        icon={CalendarIcon}
                        isRequired={false}
                        error={errors.dateOfBirth}
                        isDarkMode={isDarkMode}
                        value={formData.dateOfBirth}
                        onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                    />

                    {/* NEW: Role Field - Using PillBottleIcon */}
                    {/* <FormInput
                        name="role" 
                        label="Role (e.g., Pharmacist, Technician)"
                        icon={PillBottleIcon}
                        isRequired={true}
                        error={errors.role}
                        isDarkMode={isDarkMode}
                        value={formData.role} 
                        onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                    /> */}
                    
                    {/* NEW: Pharmacy Name Field - Using BuildingIcon */}
                    <FormInput
                        name="pharmacyName" 
                        label="Pharmacy/Clinic Name"
                        icon={BuildingIcon}
                        isRequired={true}
                        error={errors.pharmacyName}
                        isDarkMode={isDarkMode}
                        value={formData.pharmacyName} 
                        onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                    />

                    {/* NEW: Delivery Address Field - Using DeliveryTruckIcon */}
                    <FormInput
                        name="deliveryAddress" 
                        label="Default Delivery Address"
                        icon={DeliveryTruckIcon}
                        isRequired={false}
                        error={errors.deliveryAddress}
                        isDarkMode={isDarkMode}
                        value={formData.deliveryAddress} 
                        onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                    />
                </div>
                
                <div className="mt-8 text-center">
                    <button 
                        type="submit"
                        className={clsx(
                            "w-full py-3 px-6 rounded-xl font-bold text-lg shadow-lg transform transition-all duration-300",
                            "bg-[#1A6AA5] hover:bg-[#003A70] text-white",
                            "focus:outline-none focus:ring-4 focus:ring-[#1A6AA5]/50 focus:scale-[1.01]"
                        )}
                    >
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormSection;
