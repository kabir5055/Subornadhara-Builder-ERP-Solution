import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ArrowLeftIcon, PencilIcon, TrashIcon, ExclamationTriangleIcon, PrinterIcon, QrCodeIcon, ClockIcon, BuildingStorefrontIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function Show({ item = null, stockHistory = [], auth }) {
    // Mock item data if not provided
    const mockItem = item || {
        id: 1,
        name: 'Premium Steel Rods (16mm)',
        sku: 'STL-RD-16MM-001',
        category: 'Construction Materials',
        supplier: {
            id: 1,
            name: 'Bangladesh Steel Mills',
            contact_person: 'Mr. Rahman',
            phone: '01711111111',
            email: 'info@bdsteelmills.com',
            address: 'Chittagong, Bangladesh'
        },
        quantity: 150,
        unit: 'pieces',
        unit_price: 850.00,
        total_value: 127500.00,
        reorder_level: 50,
        status: 'in_stock',
        location: 'Warehouse A - Section 1',
        description: 'High-grade steel rods for construction, 16mm diameter. These rods meet international quality standards and are ideal for high-rise construction projects.',
        purchase_date: '2024-07-10',
        expiry_date: null,
        warranty_period: 12,
        barcode: '8801234567890',
        notes: 'Store in dry place to prevent rusting. Handle with care.',
        last_restocked: '2024-07-10',
        created_at: '2024-01-15T09:00:00',
        updated_at: '2024-07-10T14:30:00',
    };

    // Mock stock history
    const mockStockHistory = stockHistory.length > 0 ? stockHistory : [
        {
            id: 1,
            type: 'purchase',
            quantity: 100,
            unit_price: 850.00,
            total_amount: 85000.00,
            reference: 'PO-2024-001',
            notes: 'Initial stock purchase',
            created_at: '2024-01-15T09:00:00',
            created_by: 'Admin User'
        },
        {
            id: 2,
            type: 'adjustment',
            quantity: 50,
            unit_price: 850.00,
            total_amount: 42500.00,
            reference: 'ADJ-2024-001',
            notes: 'Stock restock from supplier',
            created_at: '2024-07-10T14:30:00',
            created_by: 'Warehouse Manager'
        },
        {
            id: 3,
            type: 'usage',
            quantity: -25,
            unit_price: 850.00,
            total_amount: -21250.00,
            reference: 'PRJ-PARK-VIEW-001',
            notes: 'Used for Park View Tower project',
            created_at: '2024-07-15T10:15:00',
            created_by: 'Project Manager'
        },
    ];

    const [activeTab, setActiveTab] = useState('overview');

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

    const getTypeColor = (type) => {
        switch (type) {
            case 'purchase': return 'text-green-800 bg-green-100';
            case 'adjustment': return 'text-blue-800 bg-blue-100';
            case 'usage': return 'text-red-800 bg-red-100';
            case 'return': return 'text-purple-800 bg-purple-100';
            default: return 'text-gray-800 bg-gray-100';
        }
    };

    const getStockAlert = () => {
        if (mockItem.status === 'out_of_stock') {
            return { level: 'danger', message: 'Item is out of stock', icon: ExclamationTriangleIcon };
        } else if (mockItem.status === 'low_stock' || mockItem.quantity <= mockItem.reorder_level) {
            return { level: 'warning', message: 'Stock is running low', icon: ExclamationTriangleIcon };
        }
        return null;
    };

    const stockAlert = getStockAlert();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this inventory item?')) {
            // router.delete(route('inventory.destroy', mockItem.id));
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // Calculate stock metrics
    const totalPurchased = mockStockHistory
        .filter(h => h.type === 'purchase' || h.type === 'adjustment')
        .reduce((sum, h) => sum + h.quantity, 0);

    const totalUsed = Math.abs(mockStockHistory
        .filter(h => h.type === 'usage')
        .reduce((sum, h) => sum + h.quantity, 0));

    const stockTurnover = totalUsed > 0 ? (totalPurchased / totalUsed).toFixed(2) : 'N/A';

    return (
        <AppLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={window.route('inventory.index')}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeftIcon className="w-5 h-5 mr-1" />
                            Back to Inventory
                        </Link>
                        <div>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                {mockItem.name}
                            </h2>
                            <p className="text-sm text-gray-600 font-mono">SKU: {mockItem.sku}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 transition-colors"
                        >
                            <PrinterIcon className="w-5 h-5 mr-2" />
                            Print
                        </button>
                        <Link
                            href={window.route('inventory.edit', { inventory: mockItem.id })}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors"
                        >
                            <PencilIcon className="w-5 h-5 mr-2" />
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-colors"
                        >
                            <TrashIcon className="w-5 h-5 mr-2" />
                            Delete
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`${mockItem.name} - Inventory Item`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Alert Section */}
                    {stockAlert && (
                        <div className={`mb-6 p-4 rounded-xl border ${stockAlert.level === 'danger' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
                            <div className="flex items-center">
                                <stockAlert.icon className={`w-6 h-6 mr-3 ${stockAlert.level === 'danger' ? 'text-red-600' : 'text-yellow-600'}`} />
                                <div>
                                    <h3 className={`text-lg font-semibold ${stockAlert.level === 'danger' ? 'text-red-800' : 'text-yellow-800'}`}>
                                        Stock Alert
                                    </h3>
                                    <p className={stockAlert.level === 'danger' ? 'text-red-700' : 'text-yellow-700'}>
                                        {stockAlert.message}. Current stock: {mockItem.quantity} {mockItem.unit}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden shadow-lg rounded-xl border border-blue-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600 truncate">Current Stock</p>
                                        <p className="text-3xl font-bold text-blue-900">{mockItem.quantity}</p>
                                        <p className="text-sm text-blue-700">{mockItem.unit}</p>
                                    </div>
                                    <div className="p-3 bg-blue-500 rounded-full">
                                        <BuildingStorefrontIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 overflow-hidden shadow-lg rounded-xl border border-green-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600 truncate">Total Value</p>
                                        <p className="text-2xl font-bold text-green-900">{formatCurrency(mockItem.total_value)}</p>
                                        <p className="text-sm text-green-700">Unit: {formatCurrency(mockItem.unit_price)}</p>
                                    </div>
                                    <div className="p-3 bg-green-500 rounded-full">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 overflow-hidden shadow-lg rounded-xl border border-purple-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-purple-600 truncate">Total Purchased</p>
                                        <p className="text-3xl font-bold text-purple-900">{totalPurchased}</p>
                                        <p className="text-sm text-purple-700">Total Used: {totalUsed}</p>
                                    </div>
                                    <div className="p-3 bg-purple-500 rounded-full">
                                        <ChartBarIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden shadow-lg rounded-xl border border-orange-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-orange-600 truncate">Stock Turnover</p>
                                        <p className="text-3xl font-bold text-orange-900">{stockTurnover}</p>
                                        <p className="text-sm text-orange-700">Reorder: {mockItem.reorder_level}</p>
                                    </div>
                                    <div className="p-3 bg-orange-500 rounded-full">
                                        <ClockIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                {[
                                    { id: 'overview', name: 'Overview', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                                    { id: 'history', name: 'Stock History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                                    { id: 'details', name: 'Details', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                                        </svg>
                                        {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    {/* Basic Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Information</h3>
                                            <dl className="space-y-3">
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-gray-600">Name:</dt>
                                                    <dd className="text-sm text-gray-900">{mockItem.name}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-gray-600">SKU:</dt>
                                                    <dd className="text-sm text-gray-900 font-mono">{mockItem.sku}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-gray-600">Category:</dt>
                                                    <dd className="text-sm text-gray-900">{mockItem.category}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-gray-600">Status:</dt>
                                                    <dd>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(mockItem.status)}`}>
                                                            {mockItem.status.replace('_', ' ').charAt(0).toUpperCase() + mockItem.status.replace('_', ' ').slice(1)}
                                                        </span>
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-gray-600">Location:</dt>
                                                    <dd className="text-sm text-gray-900">{mockItem.location}</dd>
                                                </div>
                                            </dl>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Supplier Information</h3>
                                            <dl className="space-y-3">
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-gray-600">Company:</dt>
                                                    <dd className="text-sm text-gray-900">{mockItem.supplier.name}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-gray-600">Contact Person:</dt>
                                                    <dd className="text-sm text-gray-900">{mockItem.supplier.contact_person}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-gray-600">Phone:</dt>
                                                    <dd className="text-sm text-gray-900">{mockItem.supplier.phone}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-gray-600">Email:</dt>
                                                    <dd className="text-sm text-gray-900">{mockItem.supplier.email}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-gray-600">Address:</dt>
                                                    <dd className="text-sm text-gray-900">{mockItem.supplier.address}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {mockItem.description && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                            <p className="text-gray-700">{mockItem.description}</p>
                                        </div>
                                    )}

                                    {/* Quick Actions */}
                                    <div className="flex flex-wrap gap-3">
                                        <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-colors">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Adjust Stock
                                        </button>
                                        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            Create Purchase Order
                                        </button>
                                        <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 transition-colors">
                                            <QrCodeIcon className="w-5 h-5 mr-2" />
                                            Print Barcode
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'history' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-gray-900">Stock Movement History</h3>
                                        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                            </svg>
                                            Export History
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {mockStockHistory.map((history) => (
                                            <div key={history.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(history.type)}`}>
                                                                {history.type.charAt(0).toUpperCase() + history.type.slice(1)}
                                                            </span>
                                                            <span className="text-sm text-gray-600">
                                                                {new Date(history.created_at).toLocaleDateString('en-GB')} at{' '}
                                                                {new Date(history.created_at).toLocaleTimeString('en-GB', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-sm text-gray-600">Quantity Change</p>
                                                                <p className={`text-lg font-bold ${history.quantity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                    {history.quantity >= 0 ? '+' : ''}{history.quantity} {mockItem.unit}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-600">Value Impact</p>
                                                                <p className={`text-lg font-bold ${history.total_amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                    {history.total_amount >= 0 ? '+' : ''}{formatCurrency(history.total_amount)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {history.reference && (
                                                            <p className="text-sm text-gray-600 mt-2">
                                                                <span className="font-medium">Reference:</span> {history.reference}
                                                            </p>
                                                        )}
                                                        {history.notes && (
                                                            <p className="text-sm text-gray-700 mt-1">{history.notes}</p>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500">By</p>
                                                        <p className="text-sm font-medium text-gray-900">{history.created_by}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'details' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase Information</h3>
                                            <dl className="space-y-3">
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-gray-600">Purchase Date:</dt>
                                                    <dd className="text-sm text-gray-900">
                                                        {mockItem.purchase_date ? new Date(mockItem.purchase_date).toLocaleDateString('en-GB') : 'N/A'}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-gray-600">Last Restocked:</dt>
                                                    <dd className="text-sm text-gray-900">
                                                        {new Date(mockItem.last_restocked).toLocaleDateString('en-GB')}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-gray-600">Warranty Period:</dt>
                                                    <dd className="text-sm text-gray-900">
                                                        {mockItem.warranty_period ? `${mockItem.warranty_period} months` : 'N/A'}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-gray-600">Expiry Date:</dt>
                                                    <dd className="text-sm text-gray-900">
                                                        {mockItem.expiry_date ? new Date(mockItem.expiry_date).toLocaleDateString('en-GB') : 'No expiry'}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Information</h3>
                                            <dl className="space-y-3">
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-gray-600">Barcode:</dt>
                                                    <dd className="text-sm text-gray-900 font-mono">
                                                        {mockItem.barcode || 'N/A'}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-gray-600">Created:</dt>
                                                    <dd className="text-sm text-gray-900">
                                                        {new Date(mockItem.created_at).toLocaleDateString('en-GB')}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-gray-600">Last Updated:</dt>
                                                    <dd className="text-sm text-gray-900">
                                                        {new Date(mockItem.updated_at).toLocaleDateString('en-GB')}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>

                                    {/* Additional Notes */}
                                    {mockItem.notes && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Notes</h3>
                                            <p className="text-gray-700">{mockItem.notes}</p>
                                        </div>
                                    )}

                                    {/* Barcode Display */}
                                    {mockItem.barcode && (
                                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Barcode</h3>
                                            <div className="inline-block bg-white p-4 rounded-lg border border-gray-300">
                                                <div className="font-mono text-sm mb-2">{mockItem.barcode}</div>
                                                <div className="flex justify-center">
                                                    {/* Simple barcode representation */}
                                                    <div className="flex space-x-1">
                                                        {[...Array(20)].map((_, i) => (
                                                            <div key={i} className={`w-1 h-10 ${i % 3 === 0 ? 'bg-black' : 'bg-white'} border-r border-gray-400`}></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="mt-3 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors">
                                                <PrinterIcon className="w-5 h-5 mr-2" />
                                                Print Barcode Label
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
