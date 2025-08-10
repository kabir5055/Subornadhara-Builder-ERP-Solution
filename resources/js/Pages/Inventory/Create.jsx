import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ArrowLeftIcon, PlusIcon, QrCodeIcon, CameraIcon } from '@heroicons/react/24/outline';

export default function Create({ suppliers = [], categories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        sku: '',
        category: '',
        supplier_id: '',
        description: '',
        quantity: '',
        unit: 'pieces',
        unit_price: '',
        reorder_level: '',
        location: '',
        purchase_date: new Date().toISOString().split('T')[0],
        expiry_date: '',
        warranty_period: '',
        barcode: '',
        image: '',
        status: 'in_stock',
        notes: '',
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

    // Auto-generate SKU based on category and name
    const generateSKU = () => {
        if (data.category && data.name) {
            const categoryCode = data.category.split(' ').map(word => word.substring(0, 3).toUpperCase()).join('-');
            const nameCode = data.name.split(' ').map(word => word.substring(0, 3).toUpperCase()).join('-');
            const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const generatedSKU = `${categoryCode}-${nameCode}-${randomNum}`;
            setData('sku', generatedSKU);
        }
    };

    // Auto-generate barcode
    const generateBarcode = () => {
        const barcode = '880' + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
        setData('barcode', barcode);
    };

    // Calculate total value
    const totalValue = data.quantity && data.unit_price ?
        (parseFloat(data.quantity) * parseFloat(data.unit_price)).toFixed(2) : '0.00';

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('inventory.store'));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(amount);
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
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Add New Inventory Item
                    </h2>
                </div>
            }
        >
            <Head title="Add Inventory Item" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information Card */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                                <h3 className="text-lg font-semibold text-white flex items-center">
                                    <PlusIcon className="w-5 h-5 mr-2" />
                                    Basic Information
                                </h3>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Item Name *
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
                                        </label>
                                        <div className="flex">
                                            <input
                                                type="text"
                                                value={data.sku}
                                                onChange={(e) => setData('sku', e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter or generate SKU"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={generateSKU}
                                                className="px-3 py-2 bg-blue-600 text-white border border-blue-600 rounded-r-lg hover:bg-blue-700 transition-colors"
                                                title="Generate SKU"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                            </button>
                                        </div>
                                        {errors.sku && (
                                            <p className="text-red-500 text-xs mt-1">{errors.sku}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category *
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

                                {/* Total Value Display */}
                                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-green-800">
                                            Total Value:
                                        </span>
                                        <span className="text-2xl font-bold text-green-900">
                                            {formatCurrency(totalValue)}
                                        </span>
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
                                        Advanced Information (Optional)
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
                                            </label>
                                            <div className="flex">
                                                <input
                                                    type="text"
                                                    value={data.barcode}
                                                    onChange={(e) => setData('barcode', e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Enter or generate barcode"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={generateBarcode}
                                                    className="px-3 py-2 bg-purple-600 text-white border border-purple-600 rounded-r-lg hover:bg-purple-700 transition-colors"
                                                    title="Generate Barcode"
                                                >
                                                    <QrCodeIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                            {errors.barcode && (
                                                <p className="text-red-500 text-xs mt-1">{errors.barcode}</p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Additional Notes
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
                                disabled={processing}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {processing ? 'Creating...' : 'Create Item'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
