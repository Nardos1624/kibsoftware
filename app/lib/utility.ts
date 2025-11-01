import { PasswordCriteria } from '../types';

// Utility function to merge Tailwind classes
export const clsx = (...classes: (string | boolean | null | undefined)[]) => classes.filter(Boolean).join(' ');

// Assigning password criteria check function
export const checkPasswordCriteria = (password: string): PasswordCriteria => ({
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
});

// Email Regex for validation
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;