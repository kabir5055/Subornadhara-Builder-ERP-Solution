import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PencilIcon, ArrowLeftIcon, PrinterIcon, ShareIcon } from '@heroicons/react/24/outline';

export default function Show({ transaction, auth }) {
    // Mock transaction data if not provided
    const mockTransaction = transaction || {
        id: 1,
        type: 'income',
        category: 'Sales',
        description: 'Property Sale - Subornadhara Heights Unit A-15',
        amount: 22500000.00,
        transaction_date: '2024-07-15',
        payment_method: 'bank_transfer',
        reference: 'TXN-001-2024',
        status: 'completed',
        notes: 'Full payment received for luxury apartment. Client opted for bank transfer method.',
        client: {
            id: 1,
            name: 'Dr. Ahmed Hassan',
            email: 'ahmed.hassan@gmail.com',
            phone: '01711-123456',
            address: 'House 15, Road 8, Dhanmondi, Dhaka'
        },
        project: {
            id: 1,
            name: 'Subornadhara Heights',
            location: 'Dhanmondi, Dhaka',
            status: 'ongoing'
        },
        supplier: null,
        created_at: '2024-07-15T10:30:00',
        updated_at: '2024-07-15T10:30:00',
        created_by: {
            name: 'Admin User',
            email: 'admin@subornadhara.com'
        }
    };

    const [activeTab, setActiveTab] = useState('details');

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'income': return 'text-green-800 bg-green-100 border-green-200';
            case 'expense': return 'text-red-800 bg-red-100 border-red-200';
            default: return 'text-gray-800 bg-gray-100 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-800 bg-green-100 border-green-200';
            case 'pending': return 'text-yellow-800 bg-yellow-100 border-yellow-200';
            case 'cancelled': return 'text-red-800 bg-red-100 border-red-200';
            default: return 'text-gray-800 bg-gray-100 border-gray-200';
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Transaction ${mockTransaction.reference}`,
                text: `${mockTransaction.description} - ${formatCurrency(mockTransaction.amount)}`,
                url: window.location.href,
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Transaction link copied to clipboard!');
        }
    };

    return (
        <AppLayout
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={window.route('finance.index')}
                            className="inline-flex items-center text-gray-600 hover:text-gray-800"
                        >
                            <ArrowLeftIcon className="w-5 h-5 mr-2" />
                            Back to Finance
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Transaction Details - #{String(mockTransaction.id).padStart(4, '0')}
                        </h2>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 transition-colors"
                        >
                            <PrinterIcon className="w-4 h-4 mr-2" />
                            Print
                        </button>
                        <button
                            onClick={handleShare}
                            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors"
                        >
                            <ShareIcon className="w-4 h-4 mr-2" />
                            Share
                        </button>
                        <Link
                            href={window.route('finance.edit', { finance: mockTransaction.id })}
                            className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:ring-4 focus:ring-amber-300 transition-colors"
                        >
                            <PencilIcon className="w-5 h-5 mr-2" />
                            Edit Transaction
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Transaction ${mockTransaction.reference}`} />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    {/* Transaction Header Card */}
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(mockTransaction.type)}`}>
                                            {mockTransaction.type.charAt(0).toUpperCase() + mockTransaction.type.slice(1)}
                                        </span>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(mockTransaction.status)}`}>
                                            {mockTransaction.status.charAt(0).toUpperCase() + mockTransaction.status.slice(1)}
                                        </span>
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{mockTransaction.description}</h1>
                                    <p className="text-gray-600">Reference: {mockTransaction.reference}</p>
                                </div>
                                <div className="mt-4 lg:mt-0 text-right">
                                    <div className={`text-3xl font-bold mb-2 ${mockTransaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {mockTransaction.type === 'income' ? '+' : '-'}{formatCurrency(mockTransaction.amount)}
                                    </div>
                                    <p className="text-gray-600">
                                        {new Date(mockTransaction.transaction_date).toLocaleDateString('en-GB', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveTab('details')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                        activeTab === 'details'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Transaction Details
                                </button>
                                <button
                                    onClick={() => setActiveTab('related')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                        activeTab === 'related'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Related Information
                                </button>
                                <button
                                    onClick={() => setActiveTab('history')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                        activeTab === 'history'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Transaction History
                                </button>
                            </nav>
                        </div>

                        <div className="p-6">
                            {/* Transaction Details Tab */}
                            {activeTab === 'details' && (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Transaction Type</div>
                                                <div className={`font-medium ${mockTransaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {mockTransaction.type.charAt(0).toUpperCase() + mockTransaction.type.slice(1)}
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Category</div>
                                                <div className="font-medium">{mockTransaction.category}</div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Amount</div>
                                                <div className={`font-bold text-lg ${mockTransaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {formatCurrency(mockTransaction.amount)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Payment Method</div>
                                                <div className="font-medium capitalize">
                                                    {mockTransaction.payment_method.replace('_', ' ')}
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Reference Number</div>
                                                <div className="font-medium font-mono">{mockTransaction.reference}</div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Transaction Date</div>
                                                <div className="font-medium">
                                                    {new Date(mockTransaction.transaction_date).toLocaleDateString('en-GB')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {mockTransaction.notes && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                                <p className="text-gray-700">{mockTransaction.notes}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Full Description</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-gray-700">{mockTransaction.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Related Information Tab */}
                            {activeTab === 'related' && (
                                <div className="space-y-8">
                                    {mockTransaction.client && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
                                            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="text-sm text-green-600 mb-1">Client Name</div>
                                                        <div className="font-medium text-green-900">{mockTransaction.client.name}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-green-600 mb-1">Email</div>
                                                        <div className="font-medium text-green-900">{mockTransaction.client.email}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-green-600 mb-1">Phone</div>
                                                        <div className="font-medium text-green-900">{mockTransaction.client.phone}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-green-600 mb-1">Address</div>
                                                        <div className="font-medium text-green-900">{mockTransaction.client.address}</div>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <Link
                                                        href={`/clients/${mockTransaction.client.id}`}
                                                        className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                                    >
                                                        View Client Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {mockTransaction.project && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
                                            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <div className="text-sm text-blue-600 mb-1">Project Name</div>
                                                        <div className="font-medium text-blue-900">{mockTransaction.project.name}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-blue-600 mb-1">Location</div>
                                                        <div className="font-medium text-blue-900">{mockTransaction.project.location}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-blue-600 mb-1">Status</div>
                                                        <div className="font-medium text-blue-900 capitalize">{mockTransaction.project.status}</div>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <Link
                                                        href={`/projects/${mockTransaction.project.id}`}
                                                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                                    >
                                                        View Project Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {mockTransaction.supplier && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Supplier Information</h3>
                                            <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="text-sm text-purple-600 mb-1">Supplier Name</div>
                                                        <div className="font-medium text-purple-900">{mockTransaction.supplier.name}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-purple-600 mb-1">Contact</div>
                                                        <div className="font-medium text-purple-900">{mockTransaction.supplier.contact}</div>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <Link
                                                        href={`/suppliers/${mockTransaction.supplier.id}`}
                                                        className="inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                                                    >
                                                        View Supplier Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {!mockTransaction.client && !mockTransaction.project && !mockTransaction.supplier && (
                                        <div className="text-center py-8">
                                            <div className="text-gray-400 text-lg mb-2">No related information</div>
                                            <div className="text-gray-500">This transaction is not linked to any client, project, or supplier</div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Transaction History Tab */}
                            {activeTab === 'history' && (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Creation & Updates</h3>
                                        <div className="bg-gray-50 p-6 rounded-lg">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <div className="text-sm text-gray-600 mb-1">Created On</div>
                                                    <div className="font-medium">
                                                        {new Date(mockTransaction.created_at).toLocaleString('en-GB')}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-600 mb-1">Last Updated</div>
                                                    <div className="font-medium">
                                                        {new Date(mockTransaction.updated_at).toLocaleString('en-GB')}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-600 mb-1">Created By</div>
                                                    <div className="font-medium">{mockTransaction.created_by.name}</div>
                                                    <div className="text-sm text-gray-500">{mockTransaction.created_by.email}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-600 mb-1">Transaction ID</div>
                                                    <div className="font-medium font-mono">#{String(mockTransaction.id).padStart(6, '0')}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        Transaction created
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(mockTransaction.created_at).toLocaleString('en-GB')} by {mockTransaction.created_by.name}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        Status updated to {mockTransaction.status}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(mockTransaction.updated_at).toLocaleString('en-GB')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
