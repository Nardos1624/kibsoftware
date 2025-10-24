// app/medicine/page.tsx
'use client';
import React, { useState, useMemo } from 'react';
import { MedicineForm } from '../Components/auth/MedicineForm'; 
import { UserRole, canModifyMedicine } from '../lib/types'; 
import { clsx } from '../lib/types';
import { KIBRAN_COLOR, KIBRAN_COLOR_LIGHT, DARK_MODE_BACKGROUND_IMAGE, LIGHT_MODE_BACKGROUND_IMAGE, DARK_OVERLAY, LIGHT_OVERLAY } from '../lib/constants'; 

// FIX: Change to a namespace import to reliably access components like Icons.SearchIcon 
// This resolves the 'undefined' component error.
import * as IconExports from '../Components/ui/Icons'; 
const Icons = IconExports.Icons; // Alias the exported object to 'Icons'

// --- Interface for Medicine Data ---
interface Medicine {
    id: number;
    name: string;
    category: string;
    type: string;
    batchNumber: string;
    manufacturer: string;
    expiryDate: string;
    unit: string;
    buyingPrice: number;
    sellingPrice: number;
    country: string;
}

// --- Mock Data and Functions ---
const mockDropdowns = {
    categories: ['Select Category', 'Analgesic', 'Antibiotic', 'Vitamin'],
    types: ['Select Type', 'Tablet', 'Capsule', 'Syrup'],
    units: ['Select Unit', 'Box', 'Strip', 'Bottle'],
    countries: ['Select Country', 'Ethiopia', 'India', 'USA'],
};

const mockMedicineData: Medicine[] = [
    { id: 1, name: 'Paracetamol 500mg', category: 'Analgesic', type: 'Tablet', batchNumber: 'P12345', manufacturer: 'Highnoon', expiryDate: '2026-10-01', unit: 'Strip', buyingPrice: 5.50, sellingPrice: 7.00, country: 'India' },
    { id: 2, name: 'Amoxicillin 250mg', category: 'Antibiotic', type: 'Capsule', batchNumber: 'A98765', manufacturer: 'Bosch', expiryDate: '2025-05-15', unit: 'Box', buyingPrice: 120.00, sellingPrice: 150.00, country: 'USA' },
    { id: 3, name: 'Vitamin C Syrup', category: 'Vitamin', type: 'Syrup', batchNumber: 'V54321', manufacturer: 'Martin dow', expiryDate: '2027-01-20', unit: 'Bottle', buyingPrice: 45.00, sellingPrice: 60.00, country: 'Ethiopia' },
    { id: 4, name: 'Omeprazole 20mg', category: 'Analgesic', type: 'Capsule', batchNumber: 'O67890', manufacturer: 'Werwick', expiryDate: '2025-11-30', unit: 'Strip', buyingPrice: 8.25, sellingPrice: 10.50, country: 'India' },
];

const initialFormData: Omit<Medicine, 'id'> = { 
    name: '', 
    category: mockDropdowns.categories[0], 
    type: mockDropdowns.types[0], 
    batchNumber: '', 
    manufacturer: '', 
    expiryDate: '', 
    unit: mockDropdowns.units[0],
    buyingPrice: '', 
    sellingPrice: '', 
    country: mockDropdowns.countries[0] 
};

// --- Sub-Component: Medicine List Table ---

interface MedicineListTableProps {
    medicines: Medicine[];
    isDarkMode: boolean;
    userCanModify: boolean;
    onEdit: (medicine: Medicine) => void;
    onDelete: (id: number) => void;
    onCopy: (medicine: Medicine) => void;
}

const MedicineListTable: React.FC<MedicineListTableProps> = ({ medicines, isDarkMode, userCanModify, onEdit, onDelete, onCopy }) => {
    const headerClass = clsx("px-4 py-3 text-left text-xs font-medium uppercase tracking-wider", isDarkMode ? 'text-gray-300' : 'text-gray-500');
    const cellClass = clsx("px-4 py-3 whitespace-nowrap text-sm", isDarkMode ? 'text-gray-200' : 'text-gray-900');
    const actionButtonClass = "p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 mx-1";

    return (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className={clsx(isDarkMode ? 'bg-slate-700' : 'bg-gray-100')}>
                    <tr>
                        <th className={headerClass}>SL.</th>
                        <th className={headerClass}>Name</th>
                        <th className={headerClass}>Batch No.</th>
                        <th className={headerClass}>Category</th>
                        <th className={headerClass}>Unit</th>
                        <th className={headerClass}>Price (Buy)</th>
                        <th className={headerClass}>Price (Sell)</th>
                        <th className={headerClass}>Expiry Date</th>
                        <th className={headerClass}>Manufacturer</th>
                        <th className={headerClass}>Country</th>
                        <th className={headerClass}>Action</th>
                    </tr>
                </thead>
                <tbody className={clsx("divide-y divide-gray-200", isDarkMode ? 'bg-slate-800' : 'bg-white')}>
                    {medicines.length === 0 ? (
                        <tr>
                            <td colSpan={11} className="px-6 py-4 text-center text-sm text-gray-500">
                                No medicines found.
                            </td>
                        </tr>
                    ) : (
                        medicines.map((med, index) => (
                            <tr key={med.id} className={clsx("hover:bg-opacity-80 transition-colors", isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50')}>
                                <td className={cellClass}>{index + 1}</td>
                                <td className={cellClass}>{med.name}</td>
                                <td className={cellClass}>{med.batchNumber}</td>
                                <td className={cellClass}>{med.category}</td>
                                <td className={cellClass}>{med.unit}</td>
                                <td className={cellClass}>${med.buyingPrice.toFixed(2)}</td>
                                <td className={cellClass}>${med.sellingPrice.toFixed(2)}</td>
                                <td className={cellClass}>{med.expiryDate}</td>
                                <td className={cellClass}>{med.manufacturer}</td>
                                <td className={cellClass}>{med.country}</td>
                                <td className={clsx(cellClass, "text-right font-medium flex items-center")}>
                                    {userCanModify ? (
                                        <>
                                            <button 
                                                onClick={() => onEdit(med)} 
                                                className={clsx(actionButtonClass, 'text-blue-600 hover:bg-blue-100')}
                                                title="Edit"
                                            >
                                                <Icons.EditIcon className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => onDelete(med.id)} 
                                                className={clsx(actionButtonClass, 'text-red-600 hover:bg-red-100')}
                                                title="Delete"
                                            >
                                                <Icons.DeleteIcon className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => onCopy(med)} 
                                                className={clsx(actionButtonClass, 'text-green-600 hover:bg-green-100')}
                                                title="Copy Details"
                                            >
                                                <Icons.CopyIcon className="w-5 h-5" />
                                            </button>
                                        </>
                                    ) : (
                                        <span className="text-gray-500 italic">No Actions</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

// --- Main Page Component ---
const MedicinePage = () => {
    const [userRole, setUserRole] = useState<UserRole>('Admin'); 
    const [isDarkMode, setIsDarkMode] = useState(false); 
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [medicineList, setMedicineList] = useState<Medicine[]>(mockMedicineData);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>(initialFormData);

    const userCanModify = useMemo(() => canModifyMedicine(userRole), [userRole]);

    // Filtered list for the table
    const filteredMedicines = useMemo(() => {
        if (!searchTerm) return medicineList;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return medicineList.filter(med =>
            Object.values(med).some(value =>
                String(value).toLowerCase().includes(lowerCaseSearch)
            )
        );
    }, [medicineList, searchTerm]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        // Handle number inputs by ensuring value is correct, but storing as string for input element
        const processedValue = (type === 'number' && value === '') ? '' : value;
        setFormData((prev: any) => ({ ...prev, [name]: processedValue }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userCanModify) {
            alert("Permission denied. Only Admins/Store Keepers can modify records.");
            return;
        }

        const newMedicine = {
            ...formData,
            // Convert price fields back to numbers for data storage
            buyingPrice: parseFloat(formData.buyingPrice) || 0,
            sellingPrice: parseFloat(formData.sellingPrice) || 0,
        };
        
        if (isEditing) {
            // Update logic
            setMedicineList(prev => prev.map(med => med.id === newMedicine.id ? newMedicine : med));
            setIsEditing(false);
        } else {
            // Add logic
            newMedicine.id = Math.max(0, ...medicineList.map(m => m.id)) + 1; // Simple ID generation
            setMedicineList(prev => [newMedicine, ...prev]); // Add to top of list
        }

        // Reset form and close it
        setFormData(initialFormData);
        setIsAdding(false);
    };

    const handleEdit = (medicine: Medicine) => {
        if (!userCanModify) return alert("Permission denied.");
        setFormData({ 
            ...medicine, 
            // Convert numbers back to strings for input fields
            buyingPrice: String(medicine.buyingPrice),
            sellingPrice: String(medicine.sellingPrice)
        });
        setIsEditing(true);
        setIsAdding(true); // Open the form
    };

    // START OF MODIFIED handleCopy FUNCTION
    const handleCopy = async (medicine: Medicine) => {
        if (!userCanModify) return alert("Permission denied. Only Admins/Store Keepers can perform this action.");

        // 1. Format the data to be copied
        const detailsToCopy = 
            `Medicine Name: ${medicine.name}\n` +
            `Batch Number: ${medicine.batchNumber}\n` +
            `Manufacturer: ${medicine.manufacturer}\n` +
            `Category: ${medicine.category}\n` +
            `Selling Unit: ${medicine.unit}\n` +
            `Selling Price: $${medicine.sellingPrice.toFixed(2)}\n` +
            `Expiry Date: ${medicine.expiryDate}`;

        try {
            // 2. Use the Clipboard API to write the text
            await navigator.clipboard.writeText(detailsToCopy);
            alert(`Details for '${medicine.name}' successfully copied to clipboard!`);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Fallback
            prompt("Could not use clipboard API. Manually copy the text below:", detailsToCopy);
        }
        
        // Removed: setIsEditing(false) and setIsAdding(true) to prevent opening the form.
    };
    // END OF MODIFIED handleCopy FUNCTION

    const handleDelete = (id: number) => {
        if (!userCanModify) return alert("Permission denied.");
        if (window.confirm("Are you sure you want to delete this medicine record?")) {
            setMedicineList(prev => prev.filter(med => med.id !== id));
        }
    };

    const toggleTheme = () => setIsDarkMode(prev => !prev);
    const toggleAdding = () => {
        setIsAdding(prev => !prev);
        setIsEditing(false);
        setFormData(initialFormData); // Reset form on cancel
    };


    return (
        <div 
            className={clsx("min-h-screen flex flex-col p-8 transition-colors duration-700 relative z-0",
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
            
            {/* Theme Toggle Button (Fixed Position) */}
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


            <div className="relative z-20 max-w-7xl mx-auto w-full">
                <h1 className={clsx("text-4xl font-extrabold mb-8 transition-colors duration-500", isDarkMode ? 'text-blue-600' : 'text-indigo-800')}>
                    Medicine Inventory
                </h1>
                
                {/* Search Bar and Add Button */}
                <div className="mb-6 flex justify-between items-center space-x-4">
                    {/* Search Bar */}
                    <div className="relative flex-grow">
                        <Icons.SearchIcon className={clsx("absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5", isDarkMode ? 'text-gray-400' : 'text-gray-500')}/>
                        <input
                            type="text"
                            placeholder="Search by name, manufacturer, or batch number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={clsx("w-full py-3 pl-10 pr-4 border rounded-xl shadow-inner transition duration-300",
                                isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                            )}
                        />
                    </div>

                    {/* Add Medicine Button */}
                    {userCanModify && (
                        <button 
                            onClick={toggleAdding}
                            className={clsx("py-3 px-6 rounded-xl font-bold transition duration-300 shadow-md whitespace-nowrap",
                                isAdding 
                                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                            )}
                        >
                            {isAdding ? "Cancel" : "➕ Add Medicine"}
                        </button>
                    )}
                </div>
                
                {/* Medicine Form (Only visible to modifying roles and when adding/editing) */}
                {userCanModify && isAdding && (
                    <div className="mb-10">
                        <MedicineForm 
                            formData={formData} 
                            handleChange={handleChange} 
                            handleSubmit={handleFormSubmit}
                            dropdownOptions={mockDropdowns}
                            isEdit={isEditing}
                            isDarkMode={isDarkMode}
                        />
                    </div>
                )}

                {/* Medicine Table View Section */}
                <div 
                    className={clsx("mt-4 p-6 rounded-2xl shadow-2xl", 
                        isDarkMode ? "bg-slate-800" : "bg-blue-50/70" // Keeps the integrated light background color
                    )}
                >
                    <h2 className={clsx("text-xl font-bold mb-4", isDarkMode ? 'text-blue-300' : 'text-slate-800')}>
                        Medicine List ({filteredMedicines.length} entries)
                    </h2>
                    
                    <MedicineListTable
                        medicines={filteredMedicines}
                        isDarkMode={isDarkMode}
                        userCanModify={userCanModify}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onCopy={handleCopy}
                    />
                </div>
                
                {/* Mock Role Switcher (Hidden but useful for testing permissions) */}
                {/* <div className="mt-6">
                    <label className={clsx("text-sm font-medium", isDarkMode ? 'text-slate-300' : 'text-slate-700')}>Switch Role:</label>
                    <select 
                        value={userRole} 
                        onChange={(e) => setUserRole(e.target.value as UserRole)}
                        className={clsx("ml-2 py-1 px-3 rounded-lg text-sm", isDarkMode ? "bg-slate-700 text-white border-slate-600" : "bg-white border")}
                    >
                        {['Super Admin', 'Admin', 'Store Keeper', 'Sales', 'Cashier'].map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div> */}
            </div>
        </div>
    );
};

export default MedicinePage;