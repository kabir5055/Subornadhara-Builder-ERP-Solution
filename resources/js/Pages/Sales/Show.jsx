import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ sale, payments = [], documents = [] }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Mock sale data if not provided
    const mockSale = sale || {
        id: 1,
        client_name: 'Dr. Ahmed Hassan',
        client_email: 'ahmed.hassan@gmail.com',
        client_phone: '+8801712345678',
        project_name: 'Subornadhara Heights',
        project_location: 'Dhanmondi, Dhaka',
        unit_details: 'Unit A-15, 15th Floor, 1800 sqft, 3 bed + 3 bath, South-facing with city view',
        sale_amount: 22500000,
        commission_rate: 2.0,
        commission_amount: 450000,
        sales_person: 'Fatima Rahman',
        sales_person_designation: 'Sales Manager',
        sale_date: '2024-07-15',
        booking_date: '2024-07-01',
        payment_method: 'bank_transfer',
        down_payment: 5000000,
        installment_plan: 'yes',
        installment_months: 36,
        monthly_amount: 486111.11,
        status: 'completed',
        notes: 'Full payment received for luxury apartment. Client satisfied with the unit and location.',
        created_at: '2024-07-01T10:00:00.000000Z',
    };

    const mockPayments = payments.length > 0 ? payments : [
        {
            id: 1,
            amount: 5000000,
            payment_date: '2024-07-01',
            payment_method: 'bank_transfer',
            reference: 'BT-2024-001',
            status: 'completed',
            description: 'Down payment for Unit A-15'
        },
        {
            id: 2,
            amount: 486111.11,
            payment_date: '2024-08-01',
            payment_method: 'bank_transfer',
            reference: 'BT-2024-002',
            status: 'completed',
            description: '1st installment payment'
        },
        {
            id: 3,
            amount: 486111.11,
            payment_date: '2024-09-01',
            payment_method: 'bank_transfer',
            reference: 'BT-2024-003',
            status: 'pending',
            description: '2nd installment payment'
        },
    ];

    const totalPaid = mockPayments.filter(p => p.status === 'completed').reduce((sum, payment) => sum + payment.amount, 0);
    const remainingAmount = mockSale.sale_amount - totalPaid;
    const paymentProgress = (totalPaid / mockSale.sale_amount) * 100;

    return (
        <AppLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Sale Details - {mockSale.client_name}
                    </h2>
                    <div className="flex space-x-2">
                        <Link
                            href={route('sales.edit', mockSale.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                            Edit Sale
                        </Link>
                        <Link
                            href={route('sales.index')}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                            Back to Sales
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Sale - ${mockSale.client_name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Sale Overview */}
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                                        💰
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">{formatCurrency(mockSale.sale_amount)}</h1>
                                        <p className="text-gray-600">{mockSale.project_name} - {mockSale.unit_details?.split(',')[0]}</p>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(mockSale.status)}`}>
                                            {mockSale.status?.charAt(0).toUpperCase() + mockSale.status?.slice(1)}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Sale ID</p>
                                    <p className="font-mono text-lg">#SAL{String(mockSale.id).padStart(4, '0')}</p>
                                    <p className="text-sm text-gray-600 mt-1">Sale Date: {formatDate(mockSale.sale_date)}</p>
                                </div>
                            </div>

                            {/* Payment Progress */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm font-medium text-gray-600">Payment Progress</h3>
                                    <span className="text-sm text-gray-600">{paymentProgress.toFixed(1)}% Complete</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-green-600 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${paymentProgress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between mt-2 text-sm">
                                    <span className="text-green-600 font-medium">Paid: {formatCurrency(totalPaid)}</span>
                                    <span className="text-gray-600">Remaining: {formatCurrency(remainingAmount)}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-600 mb-2">Client Information</h3>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">{mockSale.client_name}</p>
                                        <p className="text-sm text-gray-600">{mockSale.client_email}</p>
                                        <p className="text-sm text-gray-600">{mockSale.client_phone}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-600 mb-2">Property Details</h3>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">{mockSale.project_name}</p>
                                        <p className="text-sm text-gray-600">{mockSale.project_location}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-600 mb-2">Sales Person</h3>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">{mockSale.sales_person}</p>
                                        <p className="text-sm text-gray-600">{mockSale.sales_person_designation}</p>
                                        <p className="text-sm text-gray-600">Commission: {formatCurrency(mockSale.commission_amount)}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-600 mb-2">Payment Method</h3>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium capitalize">{mockSale.payment_method?.replace('_', ' ')}</p>
                                        <p className="text-sm text-gray-600">Down Payment: {formatCurrency(mockSale.down_payment)}</p>
                                        {mockSale.installment_plan === 'yes' && (
                                            <p className="text-sm text-gray-600">{mockSale.installment_months} months plan</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {mockSale.unit_details && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-medium text-gray-600 mb-2">Unit Details</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-700">{mockSale.unit_details}</p>
                                    </div>
                                </div>
                            )}

                            {mockSale.notes && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-medium text-gray-600 mb-2">Notes</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-700">{mockSale.notes}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                                <button className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
                                    Payment History
                                </button>
                                <button className="border-transparent border-b-2 py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                                    Documents
                                </button>
                                <button className="border-transparent border-b-2 py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                                    Communication Log
                                </button>
                            </nav>
                        </div>

                        <div className="p-6">
                            {/* Payment History Tab */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
                                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                        + Add Payment
                                    </button>
                                </div>

                                {mockPayments.map((payment) => (
                                    <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{payment.description}</h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Payment Date: {formatDate(payment.payment_date)}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Method: {payment.payment_method?.replace('_', ' ')}
                                                    {payment.reference && ` (${payment.reference})`}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {formatCurrency(payment.amount)}
                                                </p>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {mockSale.installment_plan === 'yes' && mockSale.installment_months && (
                                    <div className="mt-6 border-t pt-6">
                                        <h4 className="font-medium text-gray-900 mb-4">Installment Schedule</h4>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-600">Monthly Amount:</span>
                                                    <p className="font-semibold">{formatCurrency(mockSale.monthly_amount)}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600">Total Installments:</span>
                                                    <p className="font-semibold">{mockSale.installment_months} months</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600">Next Due Date:</span>
                                                    <p className="font-semibold">October 1, 2024</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
