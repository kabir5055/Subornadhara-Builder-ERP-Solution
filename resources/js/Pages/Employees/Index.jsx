import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ActionBar from '@/Components/ActionBar';
import { MagnifyingGlassIcon, PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Index({ employees = [], auth }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    // Mock employees data if not provided
    const mockEmployees = employees.length > 0 ? employees : [
        {
            id: 1,
            employee_id: 'EMP-001',
            name: 'Fatima Rahman',
            email: 'fatima.rahman@subornadhara.com',
            phone: '01711-123456',
            department: 'Sales',
            designation: 'Sales Manager',
            salary: 85000.00,
            hire_date: '2023-01-15',
            status: 'active',
            address: 'House 25, Road 12, Dhanmondi, Dhaka',
            emergency_contact: '01911-654321',
            nid: '1234567890123',
            photo: null,
            created_at: '2023-01-15T09:00:00',
        },
        {
            id: 2,
            employee_id: 'EMP-002',
            name: 'Ahmed Hassan',
            email: 'ahmed.hassan@subornadhara.com',
            phone: '01811-789012',
            department: 'Sales',
            designation: 'Sales Executive',
            salary: 55000.00,
            hire_date: '2023-03-10',
            status: 'active',
            address: 'House 42, Road 7, Gulshan-2, Dhaka',
            emergency_contact: '01711-987654',
            nid: '9876543210987',
            photo: null,
            created_at: '2023-03-10T10:30:00',
        },
        {
            id: 3,
            employee_id: 'EMP-003',
            name: 'Nasir Uddin',
            email: 'nasir.uddin@subornadhara.com',
            phone: '01611-345678',
            department: 'Engineering',
            designation: 'Civil Engineer',
            salary: 75000.00,
            hire_date: '2023-02-20',
            status: 'active',
            address: 'House 18, Road 5, Banani, Dhaka',
            emergency_contact: '01911-876543',
            nid: '5678901234567',
            photo: null,
            created_at: '2023-02-20T08:45:00',
        },
        {
            id: 4,
            employee_id: 'EMP-004',
            name: 'Rashida Begum',
            email: 'rashida.begum@subornadhara.com',
            phone: '01511-567890',
            department: 'Finance',
            designation: 'Accounts Manager',
            salary: 70000.00,
            hire_date: '2023-04-05',
            status: 'active',
            address: 'House 33, Road 9, Uttara, Dhaka',
            emergency_contact: '01711-234567',
            nid: '3456789012345',
            photo: null,
            created_at: '2023-04-05T11:15:00',
        },
        {
            id: 5,
            employee_id: 'EMP-005',
            name: 'Kamrul Islam',
            email: 'kamrul.islam@subornadhara.com',
            phone: '01711-901234',
            department: 'HR',
            designation: 'HR Officer',
            salary: 50000.00,
            hire_date: '2023-05-12',
            status: 'inactive',
            address: 'House 67, Road 3, Mirpur, Dhaka',
            emergency_contact: '01811-345678',
            nid: '7890123456789',
            photo: null,
            created_at: '2023-05-12T14:00:00',
        },
    ];

    // Calculate statistics
    const totalEmployees = mockEmployees.length;
    const activeEmployees = mockEmployees.filter(emp => emp.status === 'active').length;
    const inactiveEmployees = mockEmployees.filter(emp => emp.status === 'inactive').length;
    const totalSalary = mockEmployees
        .filter(emp => emp.status === 'active')
        .reduce((sum, emp) => sum + parseFloat(emp.salary), 0);

    // Get department counts
    const departmentCounts = mockEmployees.reduce((counts, emp) => {
        counts[emp.department] = (counts[emp.department] || 0) + 1;
        return counts;
    }, {});

    // Filter employees
    const filteredEmployees = mockEmployees.filter(employee => {
        const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            employee.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            employee.phone.includes(searchTerm);

        const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
        const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;

        return matchesSearch && matchesDepartment && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'text-green-800 bg-green-100 border-green-200';
            case 'inactive': return 'text-red-800 bg-red-100 border-red-200';
            case 'on_leave': return 'text-yellow-800 bg-yellow-100 border-yellow-200';
            default: return 'text-gray-800 bg-gray-100 border-gray-200';
        }
    };

    const getDepartmentColor = (department) => {
        const colors = {
            'Sales': 'text-blue-800 bg-blue-100',
            'Engineering': 'text-green-800 bg-green-100',
            'Finance': 'text-purple-800 bg-purple-100',
            'HR': 'text-orange-800 bg-orange-100',
            'Admin': 'text-gray-800 bg-gray-100',
            'Marketing': 'text-pink-800 bg-pink-100',
        };
        return colors[department] || 'text-gray-800 bg-gray-100';
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this employee?')) {
            router.delete(window.route('employees.destroy', { employee: id }));
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
                        Employee Management
                    </h2>
                        <div className="flex items-center gap-3">
                            <ActionBar baseRouteName="employees" moduleSlug="employees" />
                            <Link
                                href={window.route('employees.create')}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Add Employee
                            </Link>
                        </div>
                </div>
            }
        >
            <Head title="Employee Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden shadow-lg rounded-xl border border-blue-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600 truncate">Total Employees</p>
                                        <p className="text-3xl font-bold text-blue-900">{totalEmployees}</p>
                                    </div>
                                    <div className="p-3 bg-blue-500 rounded-full">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 overflow-hidden shadow-lg rounded-xl border border-green-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600 truncate">Active Employees</p>
                                        <p className="text-3xl font-bold text-green-900">{activeEmployees}</p>
                                    </div>
                                    <div className="p-3 bg-green-500 rounded-full">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-red-50 to-red-100 overflow-hidden shadow-lg rounded-xl border border-red-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-red-600 truncate">Inactive</p>
                                        <p className="text-3xl font-bold text-red-900">{inactiveEmployees}</p>
                                    </div>
                                    <div className="p-3 bg-red-500 rounded-full">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 overflow-hidden shadow-lg rounded-xl border border-purple-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-purple-600 truncate">Total Salary</p>
                                        <p className="text-2xl font-bold text-purple-900">{formatCurrency(totalSalary)}</p>
                                    </div>
                                    <div className="p-3 bg-purple-500 rounded-full">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Department Distribution */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {Object.entries(departmentCounts).map(([department, count]) => (
                                <div key={department} className="text-center">
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDepartmentColor(department)}`}>
                                        {department}
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{count}</p>
                                </div>
                            ))}
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
                                        placeholder="Search employees..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <select
                                    value={filterDepartment}
                                    onChange={(e) => setFilterDepartment(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Departments</option>
                                    {Object.keys(departmentCounts).map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>

                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="on_leave">On Leave</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Employees Table */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Employee
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department & Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Salary
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
                                    {filteredEmployees.map((employee) => (
                                        <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-12 w-12">
                                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-lg">
                                                            {employee.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {employee.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {employee.employee_id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col space-y-1">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDepartmentColor(employee.department)}`}>
                                                        {employee.department}
                                                    </span>
                                                    <span className="text-sm text-gray-900 font-medium">
                                                        {employee.designation}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{employee.email}</div>
                                                <div className="text-sm text-gray-500">{employee.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">
                                                    {formatCurrency(employee.salary)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {(() => {
                                                        const rawDate = employee.hire_date || employee.join_date || employee.hired_at || employee.created_at;
                                                        try {
                                                            return rawDate ? `Hired: ${new Date(rawDate).toLocaleDateString('en-GB')}` : 'Hired: N/A';
                                                        } catch (e) {
                                                            return 'Hired: N/A';
                                                        }
                                                    })()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}>
                                                    {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <Link
                                                    href={window.route('employees.show', { employee: employee.id })}
                                                    className="inline-flex items-center p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                                                    title="View"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={window.route('employees.edit', { employee: employee.id })}
                                                    className="inline-flex items-center p-1 text-amber-600 hover:text-amber-900 hover:bg-amber-50 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(employee.id)}
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

                        {filteredEmployees.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-lg mb-2">No employees found</div>
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
                                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredEmployees.length}</span> of{' '}
                                    <span className="font-medium">{filteredEmployees.length}</span> results
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
