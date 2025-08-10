import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PencilIcon, ArrowLeftIcon, PrinterIcon, ShareIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Show({ employee, auth }) {
    // Mock employee data if not provided
    const mockEmployee = employee || {
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
        education: 'MBA in Marketing, University of Dhaka\nBBA in Business Administration, North South University',
        experience: '5+ years in real estate sales and customer relationship management. Previously worked at Square Habitat and Sheltech Properties.',
        skills: 'Client Relationship Management, Sales Strategy, Property Valuation, Team Leadership, Market Analysis',
        notes: 'Top performer in sales team. Excellent communication skills and client relationship management.',
        photo: null,
        created_at: '2023-01-15T09:00:00',
        updated_at: '2024-07-15T14:30:00',
        attendance_records: [
            { date: '2024-07-15', status: 'present', in_time: '09:00', out_time: '18:00' },
            { date: '2024-07-14', status: 'present', in_time: '09:15', out_time: '18:30' },
            { date: '2024-07-13', status: 'present', in_time: '08:45', out_time: '17:45' },
        ],
        salary_records: [
            { month: 'June 2024', amount: 85000, status: 'paid', date: '2024-06-30' },
            { month: 'May 2024', amount: 85000, status: 'paid', date: '2024-05-31' },
            { month: 'April 2024', amount: 80000, status: 'paid', date: '2024-04-30' },
        ]
    };

    const [activeTab, setActiveTab] = useState('profile');

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'text-green-800 bg-green-100 border-green-200';
            case 'inactive': return 'text-red-800 bg-red-100 border-red-200';
            case 'on_leave': return 'text-yellow-800 bg-yellow-100 border-yellow-200';
            case 'probation': return 'text-blue-800 bg-blue-100 border-blue-200';
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

    const getAttendanceColor = (status) => {
        switch (status) {
            case 'present': return 'text-green-800 bg-green-100';
            case 'absent': return 'text-red-800 bg-red-100';
            case 'late': return 'text-yellow-800 bg-yellow-100';
            case 'half_day': return 'text-blue-800 bg-blue-100';
            default: return 'text-gray-800 bg-gray-100';
        }
    };

    const calculateTenure = (hireDate) => {
        const hire = new Date(hireDate);
        const now = new Date();
        const diffTime = Math.abs(now - hire);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);

        if (years > 0) {
            return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
        } else {
            return `${months} month${months > 1 ? 's' : ''}`;
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Employee Profile - ${mockEmployee.name}`,
                text: `${mockEmployee.designation} at ${mockEmployee.department} Department`,
                url: window.location.href,
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Employee profile link copied to clipboard!');
        }
    };

    return (
        <AppLayout
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={window.route('employees.index')}
                            className="inline-flex items-center text-gray-600 hover:text-gray-800"
                        >
                            <ArrowLeftIcon className="w-5 h-5 mr-2" />
                            Back to Employees
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Employee Profile - {mockEmployee.name}
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
                            href={window.route('employees.edit', { employee: mockEmployee.id })}
                            className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:ring-4 focus:ring-amber-300 transition-colors"
                        >
                            <PencilIcon className="w-5 h-5 mr-2" />
                            Edit Employee
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Employee - ${mockEmployee.name}`} />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    {/* Employee Header Card */}
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex items-center space-x-6">
                                    <div className="flex-shrink-0">
                                        {mockEmployee.photo ? (
                                            <img className="h-24 w-24 rounded-full object-cover" src={mockEmployee.photo} alt={mockEmployee.name} />
                                        ) : (
                                            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                                                {mockEmployee.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockEmployee.name}</h1>
                                        <p className="text-xl text-gray-600 mb-3">{mockEmployee.designation}</p>
                                        <div className="flex items-center space-x-3">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(mockEmployee.status)}`}>
                                                {mockEmployee.status.charAt(0).toUpperCase() + mockEmployee.status.slice(1)}
                                            </span>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDepartmentColor(mockEmployee.department)}`}>
                                                {mockEmployee.department}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 lg:mt-0 text-right">
                                    <div className="text-3xl font-bold text-green-600 mb-2">
                                        {formatCurrency(mockEmployee.salary)}
                                    </div>
                                    <p className="text-gray-600 mb-1">Monthly Salary</p>
                                    <p className="text-sm text-gray-500">
                                        Employee ID: {mockEmployee.employee_id}
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
                                    onClick={() => setActiveTab('profile')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                        activeTab === 'profile'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Personal Profile
                                </button>
                                <button
                                    onClick={() => setActiveTab('professional')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                        activeTab === 'professional'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Professional Info
                                </button>
                                <button
                                    onClick={() => setActiveTab('attendance')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                        activeTab === 'attendance'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Attendance
                                </button>
                                <button
                                    onClick={() => setActiveTab('salary')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                        activeTab === 'salary'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Salary History
                                </button>
                            </nav>
                        </div>

                        <div className="p-6">
                            {/* Personal Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Full Name</div>
                                                <div className="font-medium">{mockEmployee.name}</div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Employee ID</div>
                                                <div className="font-medium font-mono">{mockEmployee.employee_id}</div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Email</div>
                                                <div className="font-medium">{mockEmployee.email}</div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Phone</div>
                                                <div className="font-medium">{mockEmployee.phone}</div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">National ID</div>
                                                <div className="font-medium">{mockEmployee.nid}</div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Emergency Contact</div>
                                                <div className="font-medium">{mockEmployee.emergency_contact}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                            <p className="text-gray-700">{mockEmployee.address}</p>
                                        </div>
                                    </div>

                                    {mockEmployee.notes && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                                <p className="text-gray-700">{mockEmployee.notes}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Professional Info Tab */}
                            {activeTab === 'professional' && (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Department</div>
                                                <div className="font-medium">{mockEmployee.department}</div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Designation</div>
                                                <div className="font-medium">{mockEmployee.designation}</div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Monthly Salary</div>
                                                <div className="font-bold text-green-600">{formatCurrency(mockEmployee.salary)}</div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Hire Date</div>
                                                <div className="font-medium">{new Date(mockEmployee.hire_date).toLocaleDateString('en-GB')}</div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Tenure</div>
                                                <div className="font-medium">{calculateTenure(mockEmployee.hire_date)}</div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Employment Status</div>
                                                <div className="font-medium capitalize">{mockEmployee.status.replace('_', ' ')}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {mockEmployee.education && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
                                            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                                <div className="whitespace-pre-line text-gray-700">{mockEmployee.education}</div>
                                            </div>
                                        </div>
                                    )}

                                    {mockEmployee.experience && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience</h3>
                                            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                                                <div className="whitespace-pre-line text-gray-700">{mockEmployee.experience}</div>
                                            </div>
                                        </div>
                                    )}

                                    {mockEmployee.skills && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Competencies</h3>
                                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                                <div className="text-gray-700">{mockEmployee.skills}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Attendance Tab */}
                            {activeTab === 'attendance' && (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance</h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Time</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Out Time</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {mockEmployee.attendance_records.map((record, index) => (
                                                        <tr key={index} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {new Date(record.date).toLocaleDateString('en-GB')}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAttendanceColor(record.status)}`}>
                                                                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.in_time}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.out_time}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {record.in_time && record.out_time ?
                                                                    Math.round(((new Date(`2024-01-01 ${record.out_time}`) - new Date(`2024-01-01 ${record.in_time}`)) / 3600000) * 100) / 100 + ' hrs'
                                                                    : '-'
                                                                }
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                                                <div className="text-2xl font-bold text-green-600">95%</div>
                                                <div className="text-sm text-green-800">Attendance Rate</div>
                                            </div>
                                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
                                                <div className="text-2xl font-bold text-blue-600">22</div>
                                                <div className="text-sm text-blue-800">Working Days</div>
                                            </div>
                                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center">
                                                <div className="text-2xl font-bold text-yellow-600">1</div>
                                                <div className="text-sm text-yellow-800">Late Days</div>
                                            </div>
                                            <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
                                                <div className="text-2xl font-bold text-red-600">1</div>
                                                <div className="text-sm text-red-800">Absent Days</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Salary History Tab */}
                            {activeTab === 'salary' && (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Salary History</h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {mockEmployee.salary_records.map((record, index) => (
                                                        <tr key={index} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {record.month}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                                                {formatCurrency(record.amount)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                    record.status === 'paid' ? 'text-green-800 bg-green-100' : 'text-yellow-800 bg-yellow-100'
                                                                }`}>
                                                                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {new Date(record.date).toLocaleDateString('en-GB')}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Overview</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center">
                                                <div className="text-3xl font-bold text-green-600 mb-2">{formatCurrency(mockEmployee.salary)}</div>
                                                <div className="text-sm text-green-800">Current Monthly Salary</div>
                                            </div>
                                            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-center">
                                                <div className="text-3xl font-bold text-blue-600 mb-2">{formatCurrency(mockEmployee.salary * 12)}</div>
                                                <div className="text-sm text-blue-800">Annual Salary</div>
                                            </div>
                                            <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg text-center">
                                                <div className="text-3xl font-bold text-purple-600 mb-2">
                                                    {formatCurrency(mockEmployee.salary_records.reduce((sum, record) => sum + record.amount, 0))}
                                                </div>
                                                <div className="text-sm text-purple-800">Total Paid (Last 3 months)</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="flex flex-wrap gap-4">
                            <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-colors">
                                <UserIcon className="w-5 h-5 mr-2" />
                                Mark Attendance
                            </button>
                            <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 transition-colors">
                                Process Salary
                            </button>
                            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors">
                                Generate Report
                            </button>
                            <Link
                                href={`/employees/${mockEmployee.id}/edit`}
                                className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:ring-4 focus:ring-amber-300 transition-colors"
                            >
                                <PencilIcon className="w-5 h-5 mr-2" />
                                Edit Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
