// Utility function to merge Tailwind classes
export const clsx = (...classes) => classes.filter(Boolean).join(' ');

// Assigning password criteria check function
export const checkPasswordCriteria = (password) => ({
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
});

export type UserRole = 'Super Admin' | 'Admin' | 'Store Keeper' | 'Sales' | 'Cashier' | 'Guest';

export const canModifyMedicine = (role: UserRole): boolean => {
    // Only Super Admin, Admin, and Store Keeper can modify (add, edit, delete)
    return ['Super Admin', 'Admin', 'Store Keeper'].includes(role);
};