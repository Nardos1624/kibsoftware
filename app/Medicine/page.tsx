    'use client'
    import React, { useState, useMemo, useRef, useEffect } from 'react';

    // --- Global Constants ---
    const KIBRAN_COLOR = '#4338CA'; // Indigo-700
    const KIBRAN_COLOR_LIGHT = '#6366F1'; // Indigo-500
    const DARK_MODE_BACKGROUND_IMAGE = '/background2.jpg';
    const LIGHT_MODE_BACKGROUND_IMAGE = '/background1.jpg';
    const DARK_OVERLAY = 'rgba(15, 23, 42, 0.7)';
    const LIGHT_OVERLAY = 'rgba(255, 255, 255, 0.7)';

    // --- Utility ---
    const clsx = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

    // --- Auth Mock ---
    type UserRole = 'Admin' | 'StoreKeeper' | 'Guest';
    const canModifyMedicine = (role: UserRole) => role === 'Admin' || role === 'StoreKeeper';

    // --- Icon Definitions (Internalized) ---
 const createIcon = (svgContent: React.ReactNode) => ({ className }: { className: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none"           // Hard-coded to outline
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        {svgContent}
    </svg>
);

    const SearchIcon = createIcon(<>
        <path d="m21 21-3.6-3.6"/>
        <circle cx="11" cy="11" r="8"/>
    </>);
    const FilterIcon = createIcon(<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>);
    const SunIcon = createIcon(<>
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2"/>
        <path d="M12 20v2"/>
        <path d="m4.9 4.9 1.4 1.4"/>
        <path d="m17.7 17.7 1.4 1.4"/>
        <path d="M2 12h2"/>
        <path d="M20 12h2"/>
        <path d="m6.3 17.7-1.4 1.4"/>
        <path d="m19.1 4.9-1.4 1.4"/>
    </>);
    // FIXED: MoonIcon path is used with fill="none" and stroke="currentColor" for an outline crescent.
    const MoonIcon = createIcon(<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>);
    const EditIcon = createIcon(<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>);
    const DeleteIcon = createIcon(<>
        <path d="M10 11v6"/>
        <path d="M14 11v6"/>
        <path d="M4 7h16"/>
        <path d="m6 7 1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13"/>
        <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
    </>);
    const CopyIcon = createIcon(<>
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
        <path d="M4 16c-1.1-1.1-2-2.5-2-4 0-4.4 3.6-8 8-8h5"/>
    </>);

    const Icons = { SearchIcon, FilterIcon, SunIcon, MoonIcon, EditIcon, DeleteIcon, CopyIcon };

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

    // --- Mock Data and Initial Form Data ---
    const mockDropdowns = {
        categories: ['Analgesic', 'Antibiotic', 'Vitamin', 'Antihistamine'],
        types: ['Tablet', 'Capsule', 'Syrup', 'Injection'],
        units: ['Box', 'Strip', 'Bottle', 'Vial'],
        countries: ['Ethiopia', 'India', 'USA', 'Germany', 'China'],
    };

    const mockMedicineData: Medicine[] = [
        { id: 1, name: 'Paracetamol 500mg', category: 'Analgesic', type: 'Tablet', batchNumber: 'P12345', manufacturer: 'Highnoon', expiryDate: '2026-10-01', unit: 'Strip', buyingPrice: 5.50, sellingPrice: 7.00, country: 'India' },
        { id: 2, name: 'Amoxicillin 250mg', category: 'Antibiotic', type: 'Capsule', batchNumber: 'A98765', manufacturer: 'Bosch', expiryDate: '2025-05-15', unit: 'Box', buyingPrice: 120.00, sellingPrice: 150.00, country: 'USA' },
        { id: 3, name: 'Vitamin C Syrup', category: 'Vitamin', type: 'Syrup', batchNumber: 'V54321', manufacturer: 'Martin dow', expiryDate: '2027-01-20', unit: 'Bottle', buyingPrice: 45.00, sellingPrice: 60.00, country: 'Ethiopia' },
        { id: 4, name: 'Omeprazole 20mg', category: 'Analgesic', type: 'Capsule', batchNumber: 'O67890', manufacturer: 'Werwick', expiryDate: '2025-11-30', unit: 'Strip', buyingPrice: 8.25, sellingPrice: 10.50, country: 'India' },
        { id: 5, name: 'Cetirizine 10mg', category: 'Antihistamine', type: 'Tablet', batchNumber: 'C11223', manufacturer: 'PharmaCo', expiryDate: '2026-03-05', unit: 'Strip', buyingPrice: 3.00, sellingPrice: 5.00, country: 'Germany' },
    ];

    const initialFormData: Omit<Medicine, 'id'> & { buyingPrice: string | number, sellingPrice: string | number } = { 
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

    // --- Sub-Component: MedicineForm ---
    interface MedicineFormProps {
        formData: any;
        handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
        handleSubmit: (e: React.FormEvent) => void;
        dropdownOptions: typeof mockDropdowns;
        isEdit: boolean;
        isDarkMode: boolean;
    }

    const MedicineForm: React.FC<MedicineFormProps> = ({ 
        formData, 
        handleChange, 
        handleSubmit, 
        dropdownOptions, 
        isEdit, 
        isDarkMode 
    }) => {
        const inputClass = clsx("p-3 border rounded-xl shadow-inner transition duration-300 w-full text-sm",
            isDarkMode 
                ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' 
                : 'bg-white border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
        );
        const labelClass = clsx("block text-sm font-medium mb-1", isDarkMode ? 'text-gray-300' : 'text-gray-700');
        const requiredSymbol = <span className="text-red-500">*</span>;

        const renderInput = (name: keyof typeof initialFormData, label: string, type: string = 'text') => (
            <div>
                <label htmlFor={name} className={labelClass}>{label} {requiredSymbol}</label>
                <input
                    id={name}
                    type={type}
                    name={name}
                    value={formData[name] || ''}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    min={type === 'number' ? 0 : undefined}
                />
            </div>
        );

        const renderDropdown = (name: keyof typeof initialFormData, label: string, options: string[]) => (
            <div>
                <label htmlFor={name} className={labelClass}>{label} {requiredSymbol}</label>
                <select
                    id={name}
                    name={name}
                    value={formData[name] || options[0]}
                    onChange={handleChange}
                    required
                    className={inputClass}
                >
                    {options.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>
        );

        return (
            <form 
                onSubmit={handleSubmit} 
                className={clsx("p-6 rounded-2xl shadow-2xl transition-all duration-500", 
                    isDarkMode ? "bg-slate-800 border border-blue-600" : "bg-white border border-indigo-300"
                )}
            >
                <h2 className={clsx("text-2xl font-bold mb-6", isDarkMode ? 'text-blue-400' : 'text-indigo-800')}>
                    {isEdit ? "Edit Medicine Record" : "Add New Medicine"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {renderInput('name', 'Medicine Name')}
                    {renderInput('batchNumber', 'Batch Number')}
                    {renderInput('manufacturer', 'Manufacturer')}

                    {renderDropdown('category', 'Category', dropdownOptions.categories)}
                    {renderDropdown('type', 'Type', dropdownOptions.types)}
                    {renderDropdown('unit', 'Unit', dropdownOptions.units)}
                    
                    {renderInput('expiryDate', 'Expiry Date', 'date')}
                    {renderInput('buyingPrice', 'Buying Price', 'number')}
                    {renderInput('sellingPrice', 'Selling Price', 'number')}
                    
                    {renderDropdown('country', 'Country of Origin', dropdownOptions.countries)}
                </div>

                <div className="mt-8">
                    <button 
                        type="submit"
                        className={clsx("w-full py-3 px-6 rounded-xl font-bold transition duration-300 shadow-lg text-white",
                            isEdit 
                                ? 'bg-blue-600 hover:bg-blue-700' 
                                : 'bg-green-600 hover:bg-green-700'
                        )}
                    >
                        {isEdit ? "Update Medicine" : "Save Medicine"}
                    </button>
                </div>
            </form>
        );
    };


    // --- Filter Component Props Interface ---
    interface FilterProps {
        filterKey: string;
        label: string;
        value: string;
        isDarkMode: boolean;
        onChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
        options?: string[]; // Only for Dropdown
    }

    // --- Filter Dropdown Component ---
    const FilterDropdown: React.FC<FilterProps & { options: string[] }> = 
        ({ filterKey, label, value, isDarkMode, onChange, options }) => {
        
        const selectClass = clsx("py-2.5 px-3 border rounded-xl shadow-inner transition duration-300 text-sm w-full",
            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
        );

        return (
            <div className="flex-1 min-w-40">
                <label className={clsx("block text-xs font-semibold mb-1", isDarkMode ? 'text-gray-300' : 'text-gray-600')}>
                    {label}
                </label>
                <select
                    name={filterKey}
                    value={value}
                    onChange={onChange}
                    className={selectClass}
                >
                    <option value="">All {label}s</option>
                    {options.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>
        );
    };

    // --- Filter Text Input Component (Used only for search bar) ---
    const FilterTextInput: React.FC<FilterProps> = 
        ({ filterKey, label, value, isDarkMode, onChange }) => {
        
        const inputClass = clsx("py-2.5 px-3 border rounded-xl shadow-inner transition duration-300 text-sm w-full",
            isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
        );

        return (
            <div className="flex-1 min-w-40">
                <label className={clsx("block text-xs font-semibold mb-1", isDarkMode ? 'text-gray-300' : 'text-gray-600')}>
                    {label}
                </label>
                <input
                    type="text"
                    name={filterKey}
                    placeholder={`Type ${label} name...`}
                    value={value} // This is the controlled value
                    onChange={onChange}
                    className={inputClass}
                />
            </div>
        );
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

    // --- Sub-Component: Notification System (Replaces alert()) ---
    interface NotificationProps {
        message: string;
        type: 'success' | 'error';
        onClose: () => void;
    }

    const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
        const baseClass = "fixed bottom-4 right-4 z-[100] p-4 rounded-xl shadow-2xl text-white font-semibold flex items-center space-x-3 transition-transform duration-300 transform translate-x-0";
        const typeClass = type === 'success' ? 'bg-green-500' : 'bg-red-500';

        return (
            <div className={clsx(baseClass, typeClass)}>
                <span>{message}</span>
                <button onClick={onClose} className="text-sm font-bold opacity-80 hover:opacity-100 ml-2">
                    &times;
                </button>
            </div>
        );
    };

    // --- Sub-Component: Confirmation Modal (Replaces window.confirm()) ---
    interface ConfirmationModalProps {
        message: string;
        onConfirm: () => void;
        onCancel: () => void;
        isDarkMode: boolean;
    }

    const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel, isDarkMode }) => {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className={clsx("p-6 rounded-xl shadow-2xl max-w-sm w-full", isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-900')}>
                    <h3 className="text-xl font-bold mb-4">Confirm Action</h3>
                    <p className="mb-6">{message}</p>
                    <div className="flex justify-end space-x-3">
                        <button 
                            onClick={onCancel} 
                            className={clsx("py-2 px-4 rounded-lg font-semibold transition duration-200", isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={onConfirm} 
                            className="py-2 px-4 rounded-lg font-semibold transition duration-200 bg-red-600 hover:bg-red-700 text-white"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    };


    // --- Main Page Component: MedicinePage ---
    const MedicinePage = () => {
        // --- State setup ---
        const [userRole, setUserRole] = useState<UserRole>('Admin'); 
        const [isDarkMode, setIsDarkMode] = useState(false); 
        const [isAdding, setIsAdding] = useState(false);
        const [searchTerm, setSearchTerm] = useState('');
        const [medicineList, setMedicineList] = useState<Medicine[]>(mockMedicineData);
        const [isEditing, setIsEditing] = useState(false);
        const [formData, setFormData] = useState<any>(initialFormData);
        
        // UI Feedback/Action States
        const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
        const [confirmAction, setConfirmAction] = useState<{ id: number; name: string; action: 'delete' } | null>(null);


        // Filter state
        const [filters, setFilters] = useState<{ country: string; category: string; type: string; unit: string }>({ 
            country: '', 
            category: '',
            type: '', 
            unit: ''   
        });
        const [showFilters, setShowFilters] = useState(false); 

        const userCanModify = useMemo(() => canModifyMedicine(userRole), [userRole]);
        const filterContainerRef = useRef<HTMLDivElement>(null);
        
        // Notification utility function
        const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
            setNotification({ message, type });
            setTimeout(() => setNotification(null), 3500);
        };

        // --- Filter Logic ---
        const filterOptions = useMemo(() => {
            const uniqueCountries = new Set<string>();
            const uniqueCategories = new Set<string>();
            const uniqueTypes = new Set<string>(); 
            const uniqueUnits = new Set<string>();   

            medicineList.forEach(med => {
                uniqueCountries.add(med.country);
                uniqueCategories.add(med.category);
                uniqueTypes.add(med.type);    
                uniqueUnits.add(med.unit);    
            });

            return {
                countries: Array.from(uniqueCountries).sort(),
                categories: Array.from(uniqueCategories).sort(),
                types: Array.from(uniqueTypes).sort(),      
                units: Array.from(uniqueUnits).sort(),      
            };
        }, [medicineList]);

        const filteredMedicines = useMemo(() => {
            let list = medicineList;

            // 1. Filter by Search Term (Name, Manufacturer, Batch No.)
            if (searchTerm) {
                const lowerCaseSearch = searchTerm.toLowerCase();
                list = list.filter(med =>
                    med.name.toLowerCase().includes(lowerCaseSearch) ||
                    med.manufacturer.toLowerCase().includes(lowerCaseSearch) ||
                    med.batchNumber.toLowerCase().includes(lowerCaseSearch)
                );
            }

            // 2. Filter by Active Dropdown Filters
            if (filters.country) {
                list = list.filter(med => med.country === filters.country);
            }

            if (filters.category) {
                list = list.filter(med => med.category === filters.category);
            }
            
            if (filters.type) {
                list = list.filter(med => med.type === filters.type);
            }

            if (filters.unit) {
                list = list.filter(med => med.unit === filters.unit);
            }

            return list;
        }, [medicineList, searchTerm, filters]); 

        // HANDLER: To toggle the filter panel visibility on CLICK
        const toggleFilterPanel = () => setShowFilters(prev => !prev);


        // HOOK: To close the filter panel when clicking outside of the filter area
        useEffect(() => {
            function handleClickOutside(event: MouseEvent) {
                if (filterContainerRef.current && !filterContainerRef.current.contains(event.target as Node)) {
                    setShowFilters(false);
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [filterContainerRef]);
        
        
        // HANDLER: For updating the filter state from dropdowns/text inputs
        const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
            const { name, value } = e.target;
            setFilters(prev => ({ 
                ...prev, 
                [name]: value === 'All' ? '' : value 
            }));
        };
        
        // --- Other Handlers (form, edit, delete, etc.) ---
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value, type } = e.target;
            // Handle number input (allow empty string for controlled component)
            const processedValue = (type === 'number' && value === '') ? '' : value; 

            setFormData((prev: any) => ({ ...prev, [name]: processedValue }));
        };

        const handleFormSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (!userCanModify) {
                showNotification("Permission denied. Only Admins/Store Keepers can modify records.", 'error');
                return;
            }

            const newMedicine = {
                ...formData,
                buyingPrice: parseFloat(formData.buyingPrice) || 0,
                sellingPrice: parseFloat(formData.sellingPrice) || 0,
                // Ensure ID is maintained for edit or generated for new
                id: isEditing ? formData.id : Math.max(0, ...medicineList.map(m => m.id)) + 1,
            };
            
            if (isEditing) {
                setMedicineList(prev => prev.map(med => med.id === newMedicine.id ? newMedicine : med));
                showNotification(`Medicine '${newMedicine.name}' updated successfully.`);
                setIsEditing(false);
            } else {
                setMedicineList(prev => [newMedicine, ...prev]); 
                showNotification(`New medicine '${newMedicine.name}' added successfully.`);
            }

            setFormData(initialFormData);
            setIsAdding(false);
        };

        const handleEdit = (medicine: Medicine) => {
            if (!userCanModify) return showNotification("Permission denied.", 'error');
            setFormData({ 
                ...medicine, 
                buyingPrice: String(medicine.buyingPrice),
                sellingPrice: String(medicine.sellingPrice)
            });
            setIsEditing(true);
            setIsAdding(true); 
        };

        const handleCopy = async (medicine: Medicine) => {
            if (!userCanModify) return showNotification("Permission denied. Only Admins/Store Keepers can perform this action.", 'error');

            const detailsToCopy = 
                `Medicine Name: ${medicine.name}\n` +
                `Batch Number: ${medicine.batchNumber}\n` +
                `Manufacturer: ${medicine.manufacturer}\n` +
                `Category: ${medicine.category}\n` +
                `Selling Unit: ${medicine.unit}\n` +
                `Selling Price: $${medicine.sellingPrice.toFixed(2)}\n` +
                `Expiry Date: ${medicine.expiryDate}`;

            try {
                // Using navigator.clipboard.writeText is best practice, but providing a fallback
                await navigator.clipboard.writeText(detailsToCopy);
                showNotification(`Details for '${medicine.name}' copied to clipboard!`);
            } catch (err) {
                // Fallback for environments where clipboard API is restricted
                console.error('Failed to copy text: ', err);
                // Replaced prompt() with a non-blocking notification for consistency
                showNotification("Failed to copy automatically. Console shows details.", 'error');
            }
        };

        // Handler to initiate confirmation modal
        const handleDelete = (id: number) => {
            if (!userCanModify) return showNotification("Permission denied.", 'error');
            const med = medicineList.find(m => m.id === id);
            if (med) {
                setConfirmAction({ id, name: med.name, action: 'delete' });
            }
        };
        
        // Handler to execute the delete action
        const confirmDelete = () => {
            if (confirmAction && confirmAction.action === 'delete') {
                setMedicineList(prev => prev.filter(med => med.id !== confirmAction.id));
                showNotification(`Record for '${confirmAction.name}' deleted successfully.`);
            }
            setConfirmAction(null);
        };

        const cancelConfirm = () => setConfirmAction(null);

        const toggleTheme = () => setIsDarkMode(prev => !prev);
        
        const toggleAdding = () => {
            setIsAdding(prev => {
                const newState = !prev;
                if (!newState) { // If canceling, reset form
                    setIsEditing(false);
                    setFormData(initialFormData); 
                }
                return newState;
            });
        };


        return (
            <div 
                className={clsx("min-h-screen flex flex-col p-4 sm:p-8 transition-colors duration-700 relative z-0",
                    isDarkMode ? 'bg-slate-900' : 'bg-white')}
                style={{ 
                    // Using stable placeholder URLs
                    backgroundImage: `url(${isDarkMode ? DARK_MODE_BACKGROUND_IMAGE : LIGHT_MODE_BACKGROUND_IMAGE})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundBlendMode: 'multiply', 
                    backgroundColor: isDarkMode ? DARK_OVERLAY : LIGHT_OVERLAY
                }}
            >
                <div className="absolute inset-0 z-10"></div>
                
                {/* Confirmation Modal Component */}
                {confirmAction && (
                    <ConfirmationModal
                        message={`Are you sure you want to delete the record for '${confirmAction.name}'? This action cannot be undone.`}
                        onConfirm={confirmDelete}
                        onCancel={cancelConfirm}
                        isDarkMode={isDarkMode}
                    />
                )}

                {/* Notification Component */}
                {notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}

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
                    {/* The MoonIcon now renders as an outline crescent */}
                    {isDarkMode ? <Icons.SunIcon className="w-6 h-6"/> : <Icons.MoonIcon className="w-6 h-6"/>}
                </button>


                <div className="relative z-20 max-w-7xl mx-auto w-full">
                    <h1 className={clsx("text-4xl font-extrabold mb-8 transition-colors duration-500", isDarkMode ? 'text-blue-400' : 'text-indigo-800')}>
                        Medicine Inventory
                    </h1>
                    
                    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        
                        <div className="flex flex-grow w-full sm:w-auto items-center space-x-3 relative" ref={filterContainerRef}>
                            
                            {/* Filter Icon Button */}
                            <button
                                onClick={toggleFilterPanel}
                                className={clsx("p-3 rounded-xl shadow-md transition duration-300 hover:scale-105 active:scale-95",
                                    isDarkMode 
                                        ? 'bg-slate-700 text-blue-400 hover:bg-slate-600' 
                                        : 'bg-white text-indigo-800 hover:bg-gray-100',
                                    showFilters && (isDarkMode ? 'bg-slate-600 scale-105' : 'bg-gray-100 scale-105') 
                                )}
                                aria-label="Toggle Filters"
                                aria-expanded={showFilters}
                            >
                                <Icons.FilterIcon className="w-6 h-6" /> 
                            </button>

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
                            
                            {/* Filter Popover Panel (uses FilterDropdown component) */}
                            {showFilters && (
                                <div 
                                    className={clsx("absolute top-full left-0 mt-2 p-4 rounded-xl shadow-2xl transition-all duration-300 z-40 w-full sm:w-[400px]",
                                        isDarkMode 
                                            ? 'bg-slate-800 border border-slate-700' 
                                            : 'bg-white border border-gray-200'
                                    )}
                                >
                                    <h3 className={clsx("text-lg font-bold mb-3", isDarkMode ? 'text-white' : 'text-gray-900')}>Advanced Filters</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FilterDropdown 
                                            filterKey="country" 
                                            label="Country" 
                                            value={filters.country}
                                            isDarkMode={isDarkMode}
                                            onChange={handleFilterChange}
                                            options={filterOptions.countries} 
                                        />
                                        <FilterDropdown 
                                            filterKey="category" 
                                            label="Category" 
                                            value={filters.category}
                                            isDarkMode={isDarkMode}
                                            onChange={handleFilterChange}
                                            options={filterOptions.categories} 
                                        />
                                        <FilterDropdown 
                                            filterKey="type" 
                                            label="Type" 
                                            value={filters.type}
                                            isDarkMode={isDarkMode}
                                            onChange={handleFilterChange}
                                            options={filterOptions.types} 
                                        />
                                        <FilterDropdown 
                                            filterKey="unit" 
                                            label="Unit" 
                                            value={filters.unit}
                                            isDarkMode={isDarkMode}
                                            onChange={handleFilterChange}
                                            options={filterOptions.units} 
                                        />
                                    </div>
                                    <button 
                                        onClick={() => setShowFilters(false)} 
                                        className={clsx("mt-4 w-full py-2 rounded-lg font-semibold transition", 
                                            isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                        )}
                                    >
                                        Done
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Add Medicine Button */}
                        {userCanModify && (
                            <button 
                                onClick={toggleAdding}
                                className={clsx("py-3 px-6 rounded-xl font-bold transition duration-300 shadow-lg whitespace-nowrap w-full sm:w-auto",
                                    isAdding 
                                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                )}
                            >
                                {isAdding ? "Cancel" : "➕ Add Medicine"}
                            </button>
                        )}
                    </div>
                    
                    {/* Medicine Form Component */}
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

                    {/* Medicine Table View Section (uses MedicineListTable component) */}
                    <div 
                        className={clsx("mt-4 p-4 sm:p-6 rounded-2xl shadow-2xl", 
                            isDarkMode ? "bg-slate-800" : "bg-blue-50/70"
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
                </div>
            </div>
        );
    };

    export default MedicinePage;
