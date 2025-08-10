import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Edit({ transaction, projects = [], clients = [], suppliers = [] }) {
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
        client_id: 1,
        project_id: 1,
        supplier_id: null,
        notes: 'Full payment received for luxury apartment. Client opted for bank transfer method.',
    };

    const { data, setData, put, processing, errors } = useForm({
        type: mockTransaction.type || 'income',
        category: mockTransaction.category || '',
        description: mockTransaction.description || '',
        amount: mockTransaction.amount || '',
        transaction_date: mockTransaction.transaction_date || '',
        payment_method: mockTransaction.payment_method || 'bank_transfer',
        reference: mockTransaction.reference || '',
        status: mockTransaction.status || 'completed',
        client_id: mockTransaction.client_id || '',
        project_id: mockTransaction.project_id || '',
        supplier_id: mockTransaction.supplier_id || '',
        notes: mockTransaction.notes || '',
    });

    // Mock data if not provided
    const mockProjects = projects.length > 0 ? projects : [
        { id: 1, name: 'Subornadhara Heights', location: 'Dhanmondi, Dhaka' },
        { id: 2, name: 'Golden Garden Residency', location: 'Gulshan-2, Dhaka' },
        { id: 3, name: 'Metro Plaza Complex', location: 'Motijheel, Dhaka' },
    ];

    const mockClients = clients.length > 0 ? clients : [
        { id: 1, name: 'Dr. Ahmed Hassan', email: 'ahmed.hassan@gmail.com' },
        { id: 2, name: 'Mrs. Fatima Rahman', email: 'fatima.rahman@yahoo.com' },
        { id: 3, name: 'Bangladesh Export Ltd.', email: 'info@bdexport.com' },
    ];

    const mockSuppliers = suppliers.length > 0 ? suppliers : [
        { id: 1, name: 'Bangladesh Steel Mills', contact: '01711-123456' },
        { id: 2, name: 'Cement Industries Ltd.', contact: '01911-789012' },
        { id: 3, name: 'Prime Construction Materials', contact: '01611-345678' },
    ];

    const incomeCategories = [
        'Sales',
        'Booking',
        'Installment',
        'Commission',
        'Rent',
        'Interest',
        'Other Income'
    ];

    const expenseCategories = [
        'Material',
        'Labor',
        'Equipment',
        'Salary',
        'Utilities',
        'Marketing',
        'Office Expenses',
        'Transportation',
        'Legal & Professional',
        'Maintenance',
        'Insurance',
        'Tax',
        'Other Expenses'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('finance.update', mockTransaction.id));
    };

    const generateReference = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const reference = `TXN-${year}${month}${day}-${random}`;
        setData('reference', reference);
    };

    const categories = data.type === 'income' ? incomeCategories : expenseCategories;

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
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Transaction - #{String(mockTransaction.id).padStart(4, '0')}
                    </h2>
                </div>
            }
        >
            <Head title={`Edit Transaction - ${mockTransaction.id}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Transaction Type and Category */}
                                <div className="md:col-span-2">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Information</h3>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Transaction Type *
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => {
                                            setData('type', e.target.value);
                                            setData('category', ''); // Reset category when type changes
                                            // Clear related fields based on type
                                            if (e.target.value === 'income') {
                                                setData('supplier_id', '');
                                            } else {
                                                setData('client_id', '');
                                                setData('project_id', '');
                                            }
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="income">Income</option>
                                        <option value="expense">Expense</option>
                                    </select>
                                    {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                    {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Brief description of the transaction"
                                        required
                                    />
                                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                </div>

                                {/* Amount and Payment Details */}
                                <div className="md:col-span-2 mt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Amount (BDT) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Transaction amount"
                                        required
                                    />
                                    {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
                                    {data.amount && (
                                        <p className="mt-1 text-sm text-gray-500">
                                            Preview: {formatCurrency(parseFloat(data.amount || 0))}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Transaction Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.transaction_date}
                                        onChange={(e) => setData('transaction_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                    {errors.transaction_date && <p className="mt-1 text-sm text-red-600">{errors.transaction_date}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Payment Method *
                                    </label>
                                    <select
                                        value={data.payment_method}
                                        onChange={(e) => setData('payment_method', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="check">Check</option>
                                        <option value="card">Card Payment</option>
                                        <option value="mobile_banking">Mobile Banking</option>
                                        <option value="online">Online Payment</option>
                                    </select>
                                    {errors.payment_method && <p className="mt-1 text-sm text-red-600">{errors.payment_method}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reference Number
                                    </label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={data.reference}
                                            onChange={(e) => setData('reference', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Transaction reference"
                                        />
                                        <button
                                            type="button"
                                            onClick={generateReference}
                                            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                                        >
                                            Generate
                                        </button>
                                    </div>
                                    {errors.reference && <p className="mt-1 text-sm text-red-600">{errors.reference}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status *
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                                </div>

                                {/* Related Information */}
                                <div className="md:col-span-2 mt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Information (Optional)</h3>
                                </div>

                                {data.type === 'income' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Client
                                            </label>
                                            <select
                                                value={data.client_id}
                                                onChange={(e) => setData('client_id', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Select Client</option>
                                                {mockClients.map(client => (
                                                    <option key={client.id} value={client.id}>
                                                        {client.name} ({client.email})
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.client_id && <p className="mt-1 text-sm text-red-600">{errors.client_id}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Project
                                            </label>
                                            <select
                                                value={data.project_id}
                                                onChange={(e) => setData('project_id', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Select Project</option>
                                                {mockProjects.map(project => (
                                                    <option key={project.id} value={project.id}>
                                                        {project.name} - {project.location}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.project_id && <p className="mt-1 text-sm text-red-600">{errors.project_id}</p>}
                                        </div>
                                    </>
                                )}

                                {data.type === 'expense' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Supplier
                                        </label>
                                        <select
                                            value={data.supplier_id}
                                            onChange={(e) => setData('supplier_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select Supplier</option>
                                            {mockSuppliers.map(supplier => (
                                                <option key={supplier.id} value={supplier.id}>
                                                    {supplier.name} ({supplier.contact})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.supplier_id && <p className="mt-1 text-sm text-red-600">{errors.supplier_id}</p>}
                                    </div>
                                )}

                                <div className={`${data.type === 'income' ? '' : 'md:col-span-2'}`}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notes
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Additional notes about the transaction..."
                                    />
                                    {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                                </div>

                                {/* Transaction Preview */}
                                {data.amount && data.description && (
                                    <div className="md:col-span-2 mt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Updated Transaction Preview</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-600">Type</p>
                                                    <p className={`font-medium ${data.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {data.type === 'income' ? '+' : '-'} {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Amount</p>
                                                    <p className={`font-medium ${data.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {formatCurrency(parseFloat(data.amount || 0))}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Category</p>
                                                    <p className="font-medium">{data.category || 'Not selected'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Status</p>
                                                    <p className={`font-medium ${
                                                        data.status === 'completed' ? 'text-green-600' :
                                                        data.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                                                    }`}>
                                                        {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Payment Method</p>
                                                    <p className="font-medium capitalize">{data.payment_method.replace('_', ' ')}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Reference</p>
                                                    <p className="font-medium font-mono">{data.reference || 'Not provided'}</p>
                                                </div>
                                                <div className="md:col-span-3">
                                                    <p className="text-sm text-gray-600">Description</p>
                                                    <p className="font-medium">{data.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Edit History */}
                                <div className="md:col-span-2 mt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit History</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Original Created</p>
                                                <p className="font-medium">{new Date(mockTransaction.created_at || Date.now()).toLocaleDateString('en-GB')}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Last Modified</p>
                                                <p className="font-medium">{new Date().toLocaleDateString('en-GB')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 mt-8">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {processing ? 'Updating Transaction...' : 'Update Transaction'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
