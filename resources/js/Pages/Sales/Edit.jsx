import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Edit({ sale, projects = [], clients = [], employees = [] }) {
    // Mock sale data if not provided
    const mockSale = sale || {
        id: 1,
        client_id: 1,
        project_id: 1,
        unit_details: 'Unit A-15, 15th Floor, 1800 sqft, 3 bed + 3 bath',
        sale_amount: 22500000,
        commission_rate: 2.0,
        commission_amount: 450000,
        sales_person_id: 1,
        sale_date: '2024-07-15',
        booking_date: '2024-07-01',
        payment_method: 'bank_transfer',
        down_payment: 5000000,
        installment_plan: 'yes',
        installment_months: 36,
        monthly_amount: 486111.11,
        status: 'completed',
        notes: 'Full payment received for luxury apartment.',
    };

    const { data, setData, put, processing, errors } = useForm({
        client_id: mockSale.client_id || '',
        project_id: mockSale.project_id || '',
        unit_details: mockSale.unit_details || '',
        sale_amount: mockSale.sale_amount || '',
        commission_rate: mockSale.commission_rate || '2',
        commission_amount: mockSale.commission_amount || '',
        sales_person_id: mockSale.sales_person_id || '',
        sale_date: mockSale.sale_date || '',
        booking_date: mockSale.booking_date || '',
        payment_method: mockSale.payment_method || 'bank_transfer',
        down_payment: mockSale.down_payment || '',
        installment_plan: mockSale.installment_plan || 'no',
        installment_months: mockSale.installment_months || '',
        monthly_amount: mockSale.monthly_amount || '',
        status: mockSale.status || 'pending',
        notes: mockSale.notes || '',
    });

    // Calculate commission when sale amount or rate changes
    const handleAmountChange = (field, value) => {
        setData(field, value);

        if (field === 'sale_amount' || field === 'commission_rate') {
            const amount = field === 'sale_amount' ? parseFloat(value) : parseFloat(data.sale_amount);
            const rate = field === 'commission_rate' ? parseFloat(value) : parseFloat(data.commission_rate);

            if (amount && rate) {
                const commission = (amount * rate) / 100;
                setData('commission_amount', commission.toFixed(2));
            }
        }

        if (field === 'installment_months' || field === 'down_payment' || field === 'sale_amount') {
            const saleAmount = field === 'sale_amount' ? parseFloat(value) : parseFloat(data.sale_amount);
            const downPayment = field === 'down_payment' ? parseFloat(value) : parseFloat(data.down_payment);
            const months = field === 'installment_months' ? parseInt(value) : parseInt(data.installment_months);

            if (saleAmount && downPayment && months) {
                const remainingAmount = saleAmount - downPayment;
                const monthlyAmount = remainingAmount / months;
                setData('monthly_amount', monthlyAmount.toFixed(2));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('sales.update', mockSale.id));
    };

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

    const mockEmployees = employees.length > 0 ? employees : [
        { id: 1, name: 'Fatima Rahman', designation: 'Sales Manager' },
        { id: 2, name: 'Ahmed Hassan', designation: 'Sales Executive' },
        { id: 3, name: 'Nasir Uddin', designation: 'Sales Executive' },
    ];

    return (
        <AppLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Sale - #{String(mockSale.id).padStart(4, '0')}
                    </h2>
                </div>
            }
        >
            <Head title={`Edit Sale - ${mockSale.id}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Sale Information */}
                                <div className="md:col-span-2">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sale Information</h3>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Client *
                                    </label>
                                    <select
                                        value={data.client_id}
                                        onChange={(e) => setData('client_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
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
                                        Project *
                                    </label>
                                    <select
                                        value={data.project_id}
                                        onChange={(e) => setData('project_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
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

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Unit Details *
                                    </label>
                                    <textarea
                                        value={data.unit_details}
                                        onChange={(e) => setData('unit_details', e.target.value)}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., Unit A-15, 15th Floor, 1800 sqft, 3 bed + 3 bath"
                                        required
                                    />
                                    {errors.unit_details && <p className="mt-1 text-sm text-red-600">{errors.unit_details}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sale Amount (BDT) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.sale_amount}
                                        onChange={(e) => handleAmountChange('sale_amount', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Total sale amount"
                                        required
                                    />
                                    {errors.sale_amount && <p className="mt-1 text-sm text-red-600">{errors.sale_amount}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sales Person *
                                    </label>
                                    <select
                                        value={data.sales_person_id}
                                        onChange={(e) => setData('sales_person_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select Sales Person</option>
                                        {mockEmployees.map(employee => (
                                            <option key={employee.id} value={employee.id}>
                                                {employee.name} - {employee.designation}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.sales_person_id && <p className="mt-1 text-sm text-red-600">{errors.sales_person_id}</p>}
                                </div>

                                {/* Commission Information */}
                                <div className="md:col-span-2 mt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Information</h3>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Commission Rate (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.commission_rate}
                                        onChange={(e) => handleAmountChange('commission_rate', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Commission percentage"
                                    />
                                    {errors.commission_rate && <p className="mt-1 text-sm text-red-600">{errors.commission_rate}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Commission Amount (BDT)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.commission_amount}
                                        onChange={(e) => setData('commission_amount', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                                        placeholder="Auto calculated"
                                        readOnly
                                    />
                                    {errors.commission_amount && <p className="mt-1 text-sm text-red-600">{errors.commission_amount}</p>}
                                </div>

                                {/* Payment & Dates */}
                                <div className="md:col-span-2 mt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sale Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.sale_date}
                                        onChange={(e) => setData('sale_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                    {errors.sale_date && <p className="mt-1 text-sm text-red-600">{errors.sale_date}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Booking Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.booking_date}
                                        onChange={(e) => setData('booking_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.booking_date && <p className="mt-1 text-sm text-red-600">{errors.booking_date}</p>}
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
                                        <option value="installment">Installment</option>
                                    </select>
                                    {errors.payment_method && <p className="mt-1 text-sm text-red-600">{errors.payment_method}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Down Payment (BDT)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.down_payment}
                                        onChange={(e) => handleAmountChange('down_payment', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Initial payment amount"
                                    />
                                    {errors.down_payment && <p className="mt-1 text-sm text-red-600">{errors.down_payment}</p>}
                                </div>

                                {/* Installment Plan */}
                                <div className="md:col-span-2 mt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Installment Plan</h3>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Installment Plan
                                    </label>
                                    <select
                                        value={data.installment_plan}
                                        onChange={(e) => setData('installment_plan', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="no">No Installment</option>
                                        <option value="yes">Yes, Installment Plan</option>
                                    </select>
                                    {errors.installment_plan && <p className="mt-1 text-sm text-red-600">{errors.installment_plan}</p>}
                                </div>

                                {data.installment_plan === 'yes' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Installment Months
                                            </label>
                                            <input
                                                type="number"
                                                value={data.installment_months}
                                                onChange={(e) => handleAmountChange('installment_months', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Number of months"
                                            />
                                            {errors.installment_months && <p className="mt-1 text-sm text-red-600">{errors.installment_months}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Monthly Amount (BDT)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.monthly_amount}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                                                placeholder="Auto calculated"
                                                readOnly
                                            />
                                            {errors.monthly_amount && <p className="mt-1 text-sm text-red-600">{errors.monthly_amount}</p>}
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sale Status *
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notes
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Additional notes about the sale..."
                                    />
                                    {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                                </div>

                                {/* Sale History */}
                                <div className="md:col-span-2 mt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sale History</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Created Date</p>
                                                <p className="font-medium">{new Date(mockSale.created_at || Date.now()).toLocaleDateString('en-GB')}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Last Updated</p>
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
                                    {processing ? 'Updating Sale...' : 'Update Sale'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
