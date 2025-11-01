import React from 'react';
import { Icons } from '../ui/Icons';
import { clsx } from '../../lib/utility';
import { AlertMessage } from '../../lib/types';

interface CustomAlertProps extends AlertMessage {
    onClose: () => void;
}

// custom Alert Components
export const CustomAlert: React.FC<CustomAlertProps> = ({ message, type, onClose }) => {
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