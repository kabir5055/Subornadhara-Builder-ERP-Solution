import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ActionBar from '@/Components/ActionBar';
import { MagnifyingGlassIcon, PlusIcon, EyeIcon, PencilIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Index({ inventory = [], auth }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    // Mock inventory data if not provided
    const mockInventory = inventory.length > 0 ? inventory : [
        {
            id: 1,
            name: 'Premium Steel Rods (16mm)',
            sku: 'STL-RD-16MM-001',
            category: 'Construction Materials',
            supplier: 'Bangladesh Steel Mills',
            quantity: 150,
            unit: 'pieces',
            unit_price: 850.00,
            total_value: 127500.00,
            reorder_level: 50,
            status: 'in_stock',
            location: 'Warehouse A - Section 1',
            description: 'High-grade steel rods for construction, 16mm diameter',
            last_restocked: '2024-07-10',
            created_at: '2024-01-15T09:00:00',
        },
        {
            id: 2,
            name: 'Portland Cement (50kg bag)',
            sku: 'CMT-PTL-50KG-002',
            category: 'Construction Materials',
            supplier: 'Cement Industries Ltd.',
            quantity: 25,
            unit: 'bags',
            unit_price: 520.00,
            total_value: 13000.00,
            reorder_level: 100,
            status: 'low_stock',
            location: 'Warehouse B - Section 2',
            description: 'Premium quality Portland cement for construction',
            last_restocked: '2024-07-05',
            created_at: '2024-02-01T10:30:00',
        },
        {
            id: 3,
            name: 'Electrical Wiring Cable (2.5mm)',
            sku: 'ELC-WR-2.5MM-003',
            category: 'Electrical',
            supplier: 'Prime Electric Supply',
            quantity: 500,
            unit: 'meters',
            unit_price: 45.00,
            total_value: 22500.00,
            reorder_level: 200,
            status: 'in_stock',
            location: 'Warehouse A - Section 3',
            description: '2.5mm electrical wiring cable for residential use',
            last_restocked: '2024-07-12',
            created_at: '2024-03-15T14:20:00',
        },
        {
            id: 4,
            name: 'Ceramic Floor Tiles (60x60cm)',
            sku: 'TIL-CER-60X60-004',
            category: 'Finishing Materials',
            supplier: 'Star Ceramics Ltd.',
            quantity: 0,
            unit: 'boxes',
            unit_price: 1200.00,
            total_value: 0.00,
            reorder_level: 50,
            status: 'out_of_stock',
            location: 'Warehouse C - Section 1',
            description: 'Premium ceramic floor tiles, 60x60cm, glossy finish',
            last_restocked: '2024-06-20',
            created_at: '2024-04-10T11:45:00',
        },
        {
            id: 5,
            name: 'PVC Pipes (4 inch diameter)',
            sku: 'PVC-PP-4IN-005',
            category: 'Plumbing',
            supplier: 'Polymer Industries',
            quantity: 80,
            unit: 'pieces',
            unit_price: 320.00,
            total_value: 25600.00,
            reorder_level: 30,
            status: 'in_stock',
            location: 'Warehouse B - Section 1',
            description: '4 inch diameter PVC pipes for drainage and plumbing',
            last_restocked: '2024-07-08',
            created_at: '2024-05-05T16:15:00',
        },
    ];

    // Calculate statistics
    const totalItems = mockInventory.length;
    const totalValue = mockInventory.reduce((sum, item) => sum + parseFloat(item.total_value), 0);
    const inStockItems = mockInventory.filter(item => item.status === 'in_stock').length;
    const lowStockItems = mockInventory.filter(item => item.status === 'low_stock').length;
    const outOfStockItems = mockInventory.filter(item => item.status === 'out_of_stock').length;

    // Get category counts
    const categoryCounts = mockInventory.reduce((counts, item) => {
        counts[item.category] = (counts[item.category] || 0) + 1;
        return counts;
    }, {});

    // Filter inventory
    const filteredInventory = mockInventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'in_stock': return 'text-green-800 bg-green-100 border-green-200';
            case 'low_stock': return 'text-yellow-800 bg-yellow-100 border-yellow-200';
            case 'out_of_stock': return 'text-red-800 bg-red-100 border-red-200';
            default: return 'text-gray-800 bg-gray-100 border-gray-200';
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Construction Materials': 'text-blue-800 bg-blue-100',
            'Electrical': 'text-yellow-800 bg-yellow-100',
            'Plumbing': 'text-green-800 bg-green-100',
            'Finishing Materials': 'text-purple-800 bg-purple-100',
            'Hardware': 'text-gray-800 bg-gray-100',
            'Tools': 'text-red-800 bg-red-100',
        };
        return colors[category] || 'text-gray-800 bg-gray-100';
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this inventory item?')) {
            router.delete(window.route('inventory.destroy', { inventory: id }));
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStockAlert = (item) => {
        if (item.status === 'out_of_stock') {
            return { level: 'danger', message: 'Out of Stock' };
        } else if (item.status === 'low_stock' || item.quantity <= item.reorder_level) {
            return { level: 'warning', message: 'Low Stock Alert' };
        }
        return null;

    };

    return (
        <AppLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Inventory</h2>
                    <div className="flex items-center gap-3">
                        <ActionBar baseRouteName="inventory" moduleSlug="inventory" />
                        <Link
                            href={window.route('inventory.create')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Item
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Inventory Management" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden shadow-lg rounded-xl border border-blue-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600 truncate">Total Items</p>
                                        <p className="text-3xl font-bold text-blue-900">{totalItems}</p>
                                    </div>
                                    <div className="p-3 bg-blue-500 rounded-full">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 overflow-hidden shadow-lg rounded-xl border border-purple-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-purple-600 truncate">Total Value</p>
                                        <p className="text-2xl font-bold text-purple-900">{formatCurrency(totalValue)}</p>
                                    </div>
                                    <div className="p-3 bg-purple-500 rounded-full">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 overflow-hidden shadow-lg rounded-xl border border-green-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600 truncate">In Stock</p>
                                        <p className="text-3xl font-bold text-green-900">{inStockItems}</p>
                                    </div>
                                    <div className="p-3 bg-green-500 rounded-full">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 overflow-hidden shadow-lg rounded-xl border border-yellow-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-yellow-600 truncate">Low Stock</p>
                                        <p className="text-3xl font-bold text-yellow-900">{lowStockItems}</p>
                                    </div>
                                    <div className="p-3 bg-yellow-500 rounded-full">
                                        <ExclamationTriangleIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-red-50 to-red-100 overflow-hidden shadow-lg rounded-xl border border-red-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-red-600 truncate">Out of Stock</p>
                                        <p className="text-3xl font-bold text-red-900">{outOfStockItems}</p>
                                    </div>
                                    <div className="p-3 bg-red-500 rounded-full">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Distribution */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {Object.entries(categoryCounts).map(([category, count]) => (
                                <div key={category} className="text-center">
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(category)}`}>
                                        {category}
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{count}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Alert Section */}
                    {(lowStockItems > 0 || outOfStockItems > 0) && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                            <div className="flex items-center">
                                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mr-3" />
                                <div>
                                    <h3 className="text-lg font-semibold text-yellow-800">Inventory Alerts</h3>
                                    <p className="text-yellow-700">
                                        {outOfStockItems > 0 && `${outOfStockItems} items are out of stock. `}
                                        {lowStockItems > 0 && `${lowStockItems} items are running low.`}
                                        {' '}Consider restocking soon.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

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
                                        placeholder="Search inventory..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Categories</option>
                                    {Object.keys(categoryCounts).map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>

                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="in_stock">In Stock</option>
                                    <option value="low_stock">Low Stock</option>
                                    <option value="out_of_stock">Out of Stock</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Inventory Table */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Item Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category & Supplier
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Stock Info
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Value
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
                                    {filteredInventory.map((item) => {
                                        const alert = getStockAlert(item);
                                        return (
                                            <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${alert && alert.level === 'danger' ? 'bg-red-50' : alert && alert.level === 'warning' ? 'bg-yellow-50' : ''}`}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {item.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 font-mono">
                                                            SKU: {item.sku}
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-1">
                                                            Location: {item.location}
                                                        </div>
                                                        {alert && (
                                                            <div className={`text-xs font-medium mt-1 ${alert.level === 'danger' ? 'text-red-600' : 'text-yellow-600'}`}>
                                                                <ExclamationTriangleIcon className="w-3 h-3 inline mr-1" />
                                                                {alert.message}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col space-y-1">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                                                            {item.category}
                                                        </span>
                                                        <span className="text-sm text-gray-600">
                                                            {item.supplier}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        <div className="font-bold text-lg">
                                                            {item.quantity} {item.unit}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Reorder at: {item.reorder_level} {item.unit}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Last restocked: {new Date(item.last_restocked).toLocaleDateString('en-GB')}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        <div className="font-bold text-green-600">
                                                            {formatCurrency(item.total_value)}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Unit: {formatCurrency(item.unit_price)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                                                        {item.status.replace('_', ' ').charAt(0).toUpperCase() + item.status.replace('_', ' ').slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <Link
                                                        href={`/inventory/${item.id}`}
                                                        className="inline-flex items-center p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                                                        title="View"
                                                    >
                                                        <EyeIcon className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/inventory/${item.id}/edit`}
                                                        className="inline-flex items-center p-1 text-amber-600 hover:text-amber-900 hover:bg-amber-50 rounded transition-colors"
                                                        title="Edit"
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="inline-flex items-center p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {filteredInventory.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-lg mb-2">No inventory items found</div>
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
                                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredInventory.length}</span> of{' '}
                                    <span className="font-medium">{filteredInventory.length}</span> results
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
