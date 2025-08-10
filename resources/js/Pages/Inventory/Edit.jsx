import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ArrowLeftIcon, PencilIcon, ClockIcon, UserIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Edit({ item = null, suppliers = [], categories = [], auth }) {
    // Mock item data if not provided
    const mockItem = item || {
        id: 1,
        name: 'Premium Steel Rods (16mm)',
        sku: 'STL-RD-16MM-001',
        category: 'Construction Materials',
        supplier_id: 1,
        description: 'High-grade steel rods for construction, 16mm diameter',
        quantity: 150,
        unit: 'pieces',
        unit_price: 850.00,
        reorder_level: 50,
        status: 'in_stock',
        location: 'Warehouse A - Section 1',
        purchase_date: '2024-07-10',
        expiry_date: '',
        warranty_period: 12,
        barcode: '8801234567890',
        notes: 'Store in dry place to prevent rusting. Handle with care.',
        created_at: '2024-01-15T09:00:00',
        updated_at: '2024-07-10T14:30:00',
    };

    const { data, setData, put, processing, errors } = useForm({
        name: mockItem.name,
        sku: mockItem.sku,
        category: mockItem.category,
        supplier_id: mockItem.supplier_id,
        description: mockItem.description,
        quantity: mockItem.quantity,
        unit: mockItem.unit,
        unit_price: mockItem.unit_price,
        reorder_level: mockItem.reorder_level,
        status: mockItem.status,
        location: mockItem.location,
        purchase_date: mockItem.purchase_date,
        expiry_date: mockItem.expiry_date,
        warranty_period: mockItem.warranty_period,
        barcode: mockItem.barcode,
        notes: mockItem.notes,
    });

    // Mock data if not provided
    const mockSuppliers = suppliers.length > 0 ? suppliers : [
        { id: 1, name: 'Bangladesh Steel Mills', contact_person: 'Mr. Rahman', phone: '01711111111' },
        { id: 2, name: 'Cement Industries Ltd.', contact_person: 'Ms. Sultana', phone: '01722222222' },
        { id: 3, name: 'Prime Electric Supply', contact_person: 'Mr. Ahmed', phone: '01733333333' },
        { id: 4, name: 'Star Ceramics Ltd.', contact_person: 'Mrs. Khan', phone: '01744444444' },
        { id: 5, name: 'Polymer Industries', contact_person: 'Mr. Hasan', phone: '01755555555' },
    ];

    const mockCategories = categories.length > 0 ? categories : [
        'Construction Materials',
        'Electrical',
        'Plumbing',
        'Finishing Materials',
        'Hardware',
        'Tools',
        'Safety Equipment',
        'Adhesives & Chemicals',
    ];

    const unitOptions = [
        'pieces', 'kg', 'gm', 'liters', 'meters', 'feet', 'inches', 'boxes', 'bags', 'rolls', 'sets'
    ];

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [changeHistory, setChangeHistory] = useState([]);

    // Track changes from original values
    const hasChanges = Object.keys(data).some(key => {
        return data[key] !== mockItem[key];
    });

    // Get changed fields
    const getChangedFields = () => {
        return Object.keys(data).filter(key => {
            return data[key] !== mockItem[key];
        });
    };

    // Calculate total value
    const totalValue = data.quantity && data.unit_price ?
        (parseFloat(data.quantity) * parseFloat(data.unit_price)).toFixed(2) : '0.00';

    const originalTotalValue = (parseFloat(mockItem.quantity) * parseFloat(mockItem.unit_price)).toFixed(2);

    // Check if stock level needs attention
    const needsAttention = data.quantity <= data.reorder_level || data.status === 'out_of_stock';

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('inventory.update', mockItem.id));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'in_stock': return 'text-green-800 bg-green-100 border-green-200';
            case 'low_stock': return 'text-yellow-800 bg-yellow-100 border-yellow-200';
            case 'out_of_stock': return 'text-red-800 bg-red-100 border-red-200';
            default: return 'text-gray-800 bg-gray-100 border-gray-200';
        }
    };

    const getFieldChangeIndicator = (fieldName) => {
        const hasChanged = data[fieldName] !== mockItem[fieldName];
        if (hasChanged) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                    Modified
                </span>
            );
        }
        return null;
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-1" />
                        Back
                    </button>
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Edit Inventory Item
                        </h2>
                        <p className="text-sm text-gray-600">
                            {mockItem.name} <span className="font-mono">({mockItem.sku})</span>
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Edit ${mockItem.name} - Inventory`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Change Indicator */}
                    {hasChanges && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <div className="flex items-center">
                                <ExclamationTriangleIcon className="w-6 h-6 text-blue-600 mr-3" />
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-800">Unsaved Changes</h3>
                                    <p className="text-blue-700">
                                        You have modified: {getChangedFields().join(', ')}.
                                        Don't forget to save your changes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stock Alert */}
                    {needsAttention && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                            <div className="flex items-center">
                                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mr-3" />
                                <div>
                                    <h3 className="text-lg font-semibold text-yellow-800">Stock Attention Required</h3>
                                    <p className="text-yellow-700">
                                        Current stock ({data.quantity} {data.unit}) is at or below reorder level ({data.reorder_level} {data.unit}).
                                        Consider restocking soon.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Current vs Updated Comparison */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Value Comparison</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-600 mb-2">Original Value</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(originalTotalValue)}</p>
                                <p className="text-sm text-gray-600">{mockItem.quantity} {mockItem.unit} × {formatCurrency(mockItem.unit_price)}</p>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm font-medium text-blue-600 mb-2">Updated Value</p>
                                <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalValue)}</p>
                                <p className="text-sm text-blue-600">{data.quantity} {data.unit} × {formatCurrency(data.unit_price)}</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <p className="text-sm font-medium text-green-600 mb-2">Difference</p>
                                <p className={`text-2xl font-bold ${totalValue > originalTotalValue ? 'text-green-900' : totalValue < originalTotalValue ? 'text-red-900' : 'text-gray-900'}`}>
                                    {totalValue > originalTotalValue ? '+' : ''}{formatCurrency(totalValue - originalTotalValue)}
                                </p>
                                <p className="text-sm text-green-600">
                                    {totalValue === originalTotalValue ? 'No change' :
                                     totalValue > originalTotalValue ? 'Increase' : 'Decrease'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Item History Info */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Item History</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                            <div className="flex items-center">
                                <ClockIcon className="w-5 h-5 text-gray-400 mr-2" />
                                <div>
                                    <p className="text-gray-600">Created</p>
                                    <p className="font-medium text-gray-900">
                                        {new Date(mockItem.created_at).toLocaleDateString('en-GB')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <PencilIcon className="w-5 h-5 text-gray-400 mr-2" />
                                <div>
                                    <p className="text-gray-600">Last Updated</p>
                                    <p className="font-medium text-gray-900">
                                        {new Date(mockItem.updated_at).toLocaleDateString('en-GB')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <UserIcon className="w-5 h-5 text-gray-400 mr-2" />
                                <div>
                                    <p className="text-gray-600">Current Status</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(mockItem.status)}`}>
                                        {mockItem.status.replace('_', ' ').charAt(0).toUpperCase() + mockItem.status.replace('_', ' ').slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information Card */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                                <h3 className="text-lg font-semibold text-white flex items-center">
                                    <PencilIcon className="w-5 h-5 mr-2" />
                                    Basic Information
                                </h3>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Item Name *
                                            {getFieldChangeIndicator('name')}
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter item name"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            SKU (Stock Keeping Unit) *
                                            {getFieldChangeIndicator('sku')}
                                        </label>
                                        <input
                                            type="text"
                                            value={data.sku}
                                            onChange={(e) => setData('sku', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter SKU"
                                            required
                                        />
                                        {errors.sku && (
                                            <p className="text-red-500 text-xs mt-1">{errors.sku}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category *
                                            {getFieldChangeIndicator('category')}
                                        </label>
                                        <select
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            {mockCategories.map(category => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category && (
                                            <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Supplier *
                                            {getFieldChangeIndicator('supplier_id')}
                                        </label>
                                        <select
                                            value={data.supplier_id}
                                            onChange={(e) => setData('supplier_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="">Select a supplier</option>
                                            {mockSuppliers.map(supplier => (
                                                <option key={supplier.id} value={supplier.id}>
                                                    {supplier.name} - {supplier.contact_person}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.supplier_id && (
                                            <p className="text-red-500 text-xs mt-1">{errors.supplier_id}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                            {getFieldChangeIndicator('description')}
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter item description"
                                        />
                                        {errors.description && (
                                            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stock Information Card */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                                <h3 className="text-lg font-semibold text-white flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
                                    </svg>
                                    Stock Information
                                </h3>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quantity *
                                            {getFieldChangeIndicator('quantity')}
                                        </label>
                                        <input
                                            type="number"
                                            value={data.quantity}
                                            onChange={(e) => setData('quantity', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter quantity"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                        {errors.quantity && (
                                            <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Unit *
                                            {getFieldChangeIndicator('unit')}
                                        </label>
                                        <select
                                            value={data.unit}
                                            onChange={(e) => setData('unit', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            {unitOptions.map(unit => (
                                                <option key={unit} value={unit}>
                                                    {unit}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.unit && (
                                            <p className="text-red-500 text-xs mt-1">{errors.unit}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Unit Price (BDT) *
                                            {getFieldChangeIndicator('unit_price')}
                                        </label>
                                        <input
                                            type="number"
                                            value={data.unit_price}
                                            onChange={(e) => setData('unit_price', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter unit price"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                        {errors.unit_price && (
                                            <p className="text-red-500 text-xs mt-1">{errors.unit_price}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Reorder Level *
                                            {getFieldChangeIndicator('reorder_level')}
                                        </label>
                                        <input
                                            type="number"
                                            value={data.reorder_level}
                                            onChange={(e) => setData('reorder_level', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Minimum stock level"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                        {errors.reorder_level && (
                                            <p className="text-red-500 text-xs mt-1">{errors.reorder_level}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Location *
                                            {getFieldChangeIndicator('location')}
                                        </label>
                                        <input
                                            type="text"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Warehouse location"
                                            required
                                        />
                                        {errors.location && (
                                            <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status *
                                            {getFieldChangeIndicator('status')}
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="in_stock">In Stock</option>
                                            <option value="low_stock">Low Stock</option>
                                            <option value="out_of_stock">Out of Stock</option>
                                        </select>
                                        {errors.status && (
                                            <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Advanced Information (Collapsible) */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <h3 className="text-lg font-semibold text-white flex items-center justify-between">
                                    <span className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Advanced Information
                                    </span>
                                    <svg className={`w-5 h-5 transition-transform ${showAdvanced ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </h3>
                            </button>

                            {showAdvanced && (
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Purchase Date
                                                {getFieldChangeIndicator('purchase_date')}
                                            </label>
                                            <input
                                                type="date"
                                                value={data.purchase_date}
                                                onChange={(e) => setData('purchase_date', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            {errors.purchase_date && (
                                                <p className="text-red-500 text-xs mt-1">{errors.purchase_date}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Expiry Date
                                                {getFieldChangeIndicator('expiry_date')}
                                            </label>
                                            <input
                                                type="date"
                                                value={data.expiry_date}
                                                onChange={(e) => setData('expiry_date', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            {errors.expiry_date && (
                                                <p className="text-red-500 text-xs mt-1">{errors.expiry_date}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Warranty Period (months)
                                                {getFieldChangeIndicator('warranty_period')}
                                            </label>
                                            <input
                                                type="number"
                                                value={data.warranty_period}
                                                onChange={(e) => setData('warranty_period', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter warranty period"
                                                min="0"
                                            />
                                            {errors.warranty_period && (
                                                <p className="text-red-500 text-xs mt-1">{errors.warranty_period}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Barcode
                                                {getFieldChangeIndicator('barcode')}
                                            </label>
                                            <input
                                                type="text"
                                                value={data.barcode}
                                                onChange={(e) => setData('barcode', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter barcode"
                                            />
                                            {errors.barcode && (
                                                <p className="text-red-500 text-xs mt-1">{errors.barcode}</p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Additional Notes
                                                {getFieldChangeIndicator('notes')}
                                            </label>
                                            <textarea
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter any additional notes"
                                            />
                                            {errors.notes && (
                                                <p className="text-red-500 text-xs mt-1">{errors.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing || !hasChanges}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {processing ? 'Updating...' : hasChanges ? 'Update Item' : 'No Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
