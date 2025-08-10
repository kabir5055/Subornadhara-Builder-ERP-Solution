import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ActionBar from '@/Components/ActionBar';
import { MagnifyingGlassIcon, PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Index({ transactions = [], auth }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    // Mock transactions data if not provided
    const mockTransactions = transactions.length > 0 ? transactions : [
        {
            id: 1,
            type: 'income',
            category: 'Sales',
            description: 'Property Sale - Subornadhara Heights Unit A-15',
            amount: 22500000.00,
            transaction_date: '2024-07-15',
            payment_method: 'bank_transfer',
            reference: 'TXN-001-2024',
            status: 'completed',
            client_name: 'Dr. Ahmed Hassan',
            project_name: 'Subornadhara Heights',
            created_at: '2024-07-15T10:30:00',
        },
        {
            id: 2,
            type: 'expense',
            category: 'Material',
            description: 'Steel Rods and Cement Purchase',
            amount: 580000.00,
            transaction_date: '2024-07-14',
            payment_method: 'bank_transfer',
            reference: 'TXN-002-2024',
            status: 'completed',
            supplier_name: 'Bangladesh Steel Mills',
            created_at: '2024-07-14T14:20:00',
        },
        {
            id: 3,
            type: 'income',
            category: 'Installment',
            description: 'Monthly Installment Payment',
            amount: 486111.11,
            transaction_date: '2024-07-13',
            payment_method: 'bank_transfer',
            reference: 'TXN-003-2024',
            status: 'completed',
            client_name: 'Mrs. Fatima Rahman',
            project_name: 'Golden Garden Residency',
            created_at: '2024-07-13T09:15:00',
        },
        {
            id: 4,
            type: 'expense',
            category: 'Salary',
            description: 'Monthly Employee Salaries - July 2024',
            amount: 850000.00,
            transaction_date: '2024-07-12',
            payment_method: 'bank_transfer',
            reference: 'TXN-004-2024',
            status: 'completed',
            created_at: '2024-07-12T16:45:00',
        },
        {
            id: 5,
            type: 'income',
            category: 'Booking',
            description: 'Booking Money - Metro Plaza Complex',
            amount: 2500000.00,
            transaction_date: '2024-07-11',
            payment_method: 'check',
            reference: 'TXN-005-2024',
            status: 'pending',
            client_name: 'Bangladesh Export Ltd.',
            project_name: 'Metro Plaza Complex',
            created_at: '2024-07-11T11:30:00',
        },
    ];

    // Calculate statistics
    const totalIncome = mockTransactions
        .filter(t => t.type === 'income' && t.status === 'completed')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpense = mockTransactions
        .filter(t => t.type === 'expense' && t.status === 'completed')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const pendingAmount = mockTransactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const netProfit = totalIncome - totalExpense;

    // Filter transactions
    const filteredTransactions = mockTransactions.filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (transaction.client_name && transaction.client_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (transaction.supplier_name && transaction.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesType = filterType === 'all' || transaction.type === filterType;
        const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    const getTypeColor = (type) => {
        switch (type) {
            case 'income': return 'text-green-800 bg-green-100';
            case 'expense': return 'text-red-800 bg-red-100';
            default: return 'text-gray-800 bg-gray-100';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-800 bg-green-100';
            case 'pending': return 'text-yellow-800 bg-yellow-100';
            case 'cancelled': return 'text-red-800 bg-red-100';
            default: return 'text-gray-800 bg-gray-100';
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            router.delete(window.route('finance.destroy', { finance: id }));
        }
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
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Finance Management
                    </h2>
                    <div className="flex items-center gap-3">
                        <ActionBar baseRouteName="finance" moduleSlug="finance" />
                        <Link
                            href={window.route('finance.create')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Transaction
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Finance Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 overflow-hidden shadow-lg rounded-xl border border-green-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600 truncate">Total Income</p>
                                        <p className="text-2xl font-bold text-green-900">{formatCurrency(totalIncome)}</p>
                                    </div>
                                    <div className="p-3 bg-green-500 rounded-full">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-red-50 to-red-100 overflow-hidden shadow-lg rounded-xl border border-red-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-red-600 truncate">Total Expense</p>
                                        <p className="text-2xl font-bold text-red-900">{formatCurrency(totalExpense)}</p>
                                    </div>
                                    <div className="p-3 bg-red-500 rounded-full">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`bg-gradient-to-br ${netProfit >= 0 ? 'from-blue-50 to-blue-100 border-blue-200' : 'from-orange-50 to-orange-100 border-orange-200'} overflow-hidden shadow-lg rounded-xl border`}>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-sm font-medium ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'} truncate`}>Net Profit</p>
                                        <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>{formatCurrency(netProfit)}</p>
                                    </div>
                                    <div className={`p-3 ${netProfit >= 0 ? 'bg-blue-500' : 'bg-orange-500'} rounded-full`}>
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 overflow-hidden shadow-lg rounded-xl border border-yellow-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-yellow-600 truncate">Pending Amount</p>
                                        <p className="text-2xl font-bold text-yellow-900">{formatCurrency(pendingAmount)}</p>
                                    </div>
                                    <div className="p-3 bg-yellow-500 rounded-full">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Search transactions..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Types</option>
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>

                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Transaction Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type & Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredTransactions.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {transaction.description}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Ref: {transaction.reference}
                                                    </div>
                                                    {transaction.client_name && (
                                                        <div className="text-xs text-blue-600 mt-1">
                                                            Client: {transaction.client_name}
                                                        </div>
                                                    )}
                                                    {transaction.supplier_name && (
                                                        <div className="text-xs text-purple-600 mt-1">
                                                            Supplier: {transaction.supplier_name}
                                                        </div>
                                                    )}
                                                    {transaction.project_name && (
                                                        <div className="text-xs text-green-600 mt-1">
                                                            Project: {transaction.project_name}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col space-y-1">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                                                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {transaction.category}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {transaction.payment_method.replace('_', ' ').toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(transaction.transaction_date).toLocaleDateString('en-GB')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <Link
                                                    href={`/finance/${transaction.id}`}
                                                    className="inline-flex items-center p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                                                    title="View"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/finance/${transaction.id}/edit`}
                                                    className="inline-flex items-center p-1 text-amber-600 hover:text-amber-900 hover:bg-amber-50 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(transaction.id)}
                                                    className="inline-flex items-center p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredTransactions.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-lg mb-2">No transactions found</div>
                                <div className="text-gray-500">Try adjusting your search or filters</div>
                            </div>
                        )}
                    </div>

                    {/* Pagination would go here */}
                    <div className="flex items-center justify-between bg-white px-6 py-3 border-t border-gray-200 mt-6 rounded-lg shadow-sm">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                Previous
                            </button>
                            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTransactions.length}</span> of{' '}
                                    <span className="font-medium">{filteredTransactions.length}</span> results
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
