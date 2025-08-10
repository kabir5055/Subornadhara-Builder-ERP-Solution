import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ client, bookings = [], transactions = [] }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-yellow-100 text-yellow-800';
            case 'blacklisted':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeIcon = (type) => {
        return type === 'corporate' ? '🏢' : '👤';
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
                        Client Details: {client.name}
                    </h2>
                    <div className="flex space-x-2">
                        <Link
                            href={route('clients.edit', client.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                            Edit Client
                        </Link>
                        <Link
                            href={route('clients.index')}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                            Back to List
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Client - ${client.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Client Overview */}
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                                        {getTypeIcon(client.type)}
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
                                        <p className="text-gray-600 capitalize">{client.type} Client</p>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
                                            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Client ID</p>
                                    <p className="font-mono text-lg">#CLT{String(client.id).padStart(4, '0')}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-600 mb-2">Contact Information</h3>
                                    <div className="space-y-1">
                                        <p className="text-sm"><span className="font-medium">Email:</span> {client.email}</p>
                                        <p className="text-sm"><span className="font-medium">Phone:</span> {client.phone}</p>
                                        {client.emergency_contact && (
                                            <p className="text-sm"><span className="font-medium">Emergency:</span> {client.emergency_contact}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-600 mb-2">Address</h3>
                                    <p className="text-sm">{client.address}</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-600 mb-2">Financial Information</h3>
                                    <div className="space-y-1">
                                        {client.occupation && (
                                            <p className="text-sm"><span className="font-medium">Occupation:</span> {client.occupation}</p>
                                        )}
                                        {client.annual_income && (
                                            <p className="text-sm"><span className="font-medium">Annual Income:</span> {formatCurrency(client.annual_income)}</p>
                                        )}
                                    </div>
                                </div>

                                {client.nid_number && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-600 mb-2">Identification</h3>
                                        <p className="text-sm"><span className="font-medium">NID Number:</span> {client.nid_number}</p>
                                    </div>
                                )}

                                {client.reference_by && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-600 mb-2">Reference</h3>
                                        <p className="text-sm"><span className="font-medium">Referenced by:</span> {client.reference_by}</p>
                                    </div>
                                )}

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-600 mb-2">Registration</h3>
                                    <p className="text-sm"><span className="font-medium">Joined:</span> {new Date(client.created_at).toLocaleDateString('en-GB')}</p>
                                </div>
                            </div>

                            {client.notes && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-medium text-gray-600 mb-2">Notes</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-700">{client.notes}</p>
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
                                    Bookings & Properties
                                </button>
                                <button className="border-transparent border-b-2 py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                                    Payment History
                                </button>
                                <button className="border-transparent border-b-2 py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                                    Communication Log
                                </button>
                            </nav>
                        </div>

                        <div className="p-6">
                            {/* Bookings Tab Content */}
                            <div className="space-y-4">
                                {bookings && bookings.length > 0 ? (
                                    bookings.map((booking, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{booking.project_name || 'Property Booking'}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{booking.unit_details || 'Unit details not available'}</p>
                                                    <p className="text-sm text-gray-600">Booking Date: {booking.booking_date || 'N/A'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-semibold">{formatCurrency(booking.amount || 0)}</p>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {booking.status || 'Unknown'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-gray-400 text-4xl mb-4">🏠</div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings Yet</h3>
                                        <p className="text-gray-600">This client hasn't made any property bookings.</p>
                                        <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                            Create New Booking
                                        </button>
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
