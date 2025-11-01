// A simple utility type for form state
export interface FormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
}

// A simple utility type for form errors
export type FormErrors = {
    [K in keyof FormData]?: string;
};

// Type for the global alert message
export interface AlertMessage {
    text: string;
    type: 'success' | 'error' | '';
}

// Type for Icon components
export type IconProps = React.SVGProps<SVGSVGElement>;

// Type for password criteria check result
export interface PasswordCriteria {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
}