// components/medicine/MedicineForm.tsx
'use client';

import React from 'react';
import { clsx } from '../../lib/types';
// Assuming your component paths
import { FormInput } from '../ui/FormInput'; 
import { Icons } from '../ui/Icons'; // Using the named export
import { KIBRAN_COLOR, KIBRAN_COLOR_HOVER } from '../../lib/constants'; 

// Define the shape of the form data
interface MedicineFormData {
    name: string;
    category: string;
    type: string;
    batchNumber: string;
    manufacturer: string;
    expiryDate: string;
    unit: string;
    buyingPrice: number | string; // Use string for form input handling
    sellingPrice: number | string; // Use string for form input handling
    country: string;
}

interface MedicineFormProps {
    formData: MedicineFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    dropdownOptions: {
        categories: string[];
        types: string[];
        units: string[];
        countries: string[];
    };
    isEdit: boolean;
    isDarkMode: boolean;
}

export const MedicineForm = ({
    formData, handleChange, handleSubmit, dropdownOptions, isEdit, isDarkMode
}: MedicineFormProps) => {

    const inputClasses = clsx(
        "w-full pl-4 pr-10 py-3.5 border rounded-xl shadow-lg outline-none appearance-none transition-all duration-300 font-semibold text-sm cursor-pointer",
        isDarkMode 
            ? 'bg-slate-700 text-slate-100 border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50' 
            : 'bg-white/95 text-slate-900 border-gray-300 shadow-md focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700/50'
    );
    
    // Helper function for dropdowns
    const SelectInput = ({ name, label, value, options, icon }: { name: string, label: string, value: string, options: string[], icon: React.ElementType }) => {
        // Renaming the prop 'icon' to 'Icon' for rendering. This is the same fix used in FormInput.
        const Icon = icon; 

        return (
            <div className="mb-4">
                <label htmlFor={name} className={clsx("block text-base font-medium transition-colors duration-500 mb-1", isDarkMode ? 'text-blue-300' : 'text-slate-900')}>
                    {label} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    {/* Icon for the Select input */}
                    <div className={clsx("absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-500 z-10", isDarkMode ? 'text-blue-400' : 'text-slate-700')} style={!isDarkMode ? { color: KIBRAN_COLOR } : {}}>
                        {/* Render the icon component passed in props */}
                        {React.createElement(Icon, { className: 'w-full h-full' })}
                    </div>

                    <select
                        id={name}
                        name={name}
                        value={value}
                        onChange={handleChange as any}
                        required
                        className={clsx(inputClasses, "pl-12")} // Added pl-12 for icon space
                    >
                        {options.map(opt => (
                            <option key={opt} value={opt} className={isDarkMode ? 'bg-slate-700' : 'bg-white'}>
                                {opt}
                            </option>
                        ))}
                    </select>
                    <svg className={clsx("absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-500",
                        isDarkMode ? 'text-slate-400' : 'text-slate-600')} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        );
    }; // End of SelectInput

    return (
        // CHANGED: Replaced "bg-white" with "bg-blue-50/70" for light mode
        <div className={clsx("p-8 rounded-2xl shadow-2xl transition-colors duration-700", isDarkMode ? "bg-slate-800" : "bg-blue-50/70")}>
            <h2 className={clsx("text-2xl font-extrabold mb-6 transition-colors duration-500", isDarkMode ? 'text-blue-400' : 'text-indigo-900')}>
                {isEdit ? "Edit Medicine Record" : "Add New Medicine"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                
                {/* 1. Name (Text) */}
                <FormInput 
                    name="name" 
                    label="Name" 
                    type="text" 
                    icon={Icons.PillBottleIcon} 
                    value={formData.name} 
                    onChange={handleChange} 
                    isRequired={true} 
                    isDarkMode={isDarkMode} 
                    placeholder="e.g., Paracetamol 500mg"
                />
                
                {/* 2. Batch Number (Text) */}
                <FormInput 
                    name="batchNumber" 
                    label="Batch Number" 
                    type="text" 
                    icon={Icons.CheckIcon} 
                    value={formData.batchNumber} 
                    onChange={handleChange} 
                    isRequired={true} 
                    isDarkMode={isDarkMode} 
                    placeholder="e.g., BTX-54321"
                />

                {/* 3. Manufacturer (Text) */}
                <FormInput 
                    name="manufacturer" 
                    label="Manufacturer" 
                    type="text" 
                    icon={Icons.DeliveryTruckIcon} 
                    value={formData.manufacturer} 
                    onChange={handleChange} 
                    isRequired={true} 
                    isDarkMode={isDarkMode} 
                    placeholder="e.g., Bayer or Highnoon"
                />
                
                {/* 4. Expiry Date (Date Picker) */}
                <FormInput name="expiryDate" label="Expiry Date" type="date" icon={Icons.AlertIcon} value={formData.expiryDate} onChange={handleChange} isRequired={true} isDarkMode={isDarkMode} />
                
                {/* 5. Buying Price (Number) */}
                <FormInput 
                    name="buyingPrice" 
                    label="Buying Price (Unit Cost)" 
                    type="number" 
                    icon={Icons.CheckIcon} 
                    value={formData.buyingPrice} 
                    onChange={handleChange} 
                    isRequired={true} 
                    isDarkMode={isDarkMode} 
                    placeholder="0.00" 
                />
                
                {/* 6. Selling Price (Number) */}
                <FormInput 
                    name="sellingPrice" 
                    label="Selling Price (Sale Price)" 
                    type="number" 
                    icon={Icons.CheckIcon} 
                    value={formData.sellingPrice} 
                    onChange={handleChange} 
                    isRequired={true} 
                    isDarkMode={isDarkMode} 
                    placeholder="0.00" 
                />

                {/* 7. Category (Dropdown) */}
                <SelectInput name="category" label="Category" value={formData.category} options={dropdownOptions.categories} icon={Icons.AlertIcon} />
                
                {/* 8. Type (Dropdown) */}
                <SelectInput name="type" label="Type (Form)" value={formData.type} options={dropdownOptions.types} icon={Icons.PillBottleIcon} />
                
                {/* 9. Unit (Dropdown) */}
                <SelectInput name="unit" label="Selling Unit" value={formData.unit} options={dropdownOptions.units} icon={Icons.DeliveryTruckIcon} />
                
                {/* 10. Country (Dropdown) */}
                <SelectInput name="country" label="Country of Origin" value={formData.country} options={dropdownOptions.countries} icon={Icons.RoleIcon} />
                
                <div className="col-span-1 sm:col-span-2 mt-4">
                    <button 
                        type="submit" 
                        className={`w-full py-3 rounded-xl font-bold text-lg shadow-xl uppercase tracking-wider
                            transition-all duration-300 transform hover:scale-[1.005] active:scale-[0.99]
                            bg-gradient-to-r from-blue-700 to-indigo-800 text-white 
                            focus:outline-none focus:ring-4 focus:ring-blue-500/60
                        `}
                        style={{ 
                            backgroundImage: `linear-gradient(to right, ${KIBRAN_COLOR}, ${KIBRAN_COLOR_HOVER})`,
                        }}
                    >
                        {isEdit ? "Update Medicine Record" : "Add Medicine"}
                    </button>
                </div>
            </form>
        </div>
    );
};