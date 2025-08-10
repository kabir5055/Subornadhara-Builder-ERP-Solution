import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { MagnifyingGlassIcon, PlusIcon, EyeIcon, CheckIcon, BanknotesIcon, CalendarDaysIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function Index({ salaries, departments, stats, filters, currentMonth, auth }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [filterDepartment, setFilterDepartment] = useState(filters.department_id || 'all');
    const [selectedMonth, setSelectedMonth] = useState(filters.month || new Date().toISOString().slice(0, 7));

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (filterDepartment !== 'all') params.append('department_id', filterDepartment);
        if (selectedMonth) params.append('month', selectedMonth);

        router.get(route('salaries.index'), Object.fromEntries(params));
    };

    const handleCalculateSalary = () => {
        if (confirm('Calculate salary for all employees for this month?')) {
            router.post(route('salaries.bulk-calculate'), {
                month: selectedMonth,
            });
        }
    };

    const handleApproveSalary = (salaryId) => {
        if (confirm('Approve this salary for payment?')) {
            router.post(route('salaries.approve', salaryId));
        }
    };

    const handlePaySalary = (salaryId) => {
        const paymentMethod = prompt('Enter payment method (bank_transfer/cash/cheque):');
        const paymentReference = prompt('Enter payment reference (optional):');

        if (paymentMethod) {
            router.post(route('salaries.pay', salaryId), {
                payment_method: paymentMethod,
                payment_reference: paymentReference,
            });
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'calculated': return 'text-blue-800 bg-blue-100 border-blue-200';
            case 'approved': return 'text-yellow-800 bg-yellow-100 border-yellow-200';
            case 'paid': return 'text-green-800 bg-green-100 border-green-200';
            case 'cancelled': return 'text-red-800 bg-red-100 border-red-200';
            default: return 'text-gray-800 bg-gray-100 border-gray-200';
        }
    };

    return (
        <AppLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Salary Management - {currentMonth}
                    </h2>
                    <div className="flex space-x-3">
                        <button
                            onClick={handleCalculateSalary}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors"
                        >
                            <ClockIcon className="w-5 h-5 mr-2" />
                            Calculate Salaries
                        </button>
                        <Link
                            href="/attendance/report"
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-colors"
                        >
                            <CalendarDaysIcon className="w-5 h-5 mr-2" />
                            Attendance Report
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Salary Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden shadow-lg rounded-xl border border-blue-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600 truncate">Total Salaries</p>
                                        <p className="text-2xl font-bold text-blue-900">{formatCurrency(stats.totalSalaries)}</p>
                                        <p className="text-sm text-blue-700">This month</p>
                                    </div>
                                    <div className="p-3 bg-blue-500 rounded-full">
                                        <BanknotesIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 overflow-hidden shadow-lg rounded-xl border border-green-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600 truncate">Processed</p>
                                        <p className="text-3xl font-bold text-green-900">{stats.processedSalaries}</p>
                                        <p className="text-sm text-green-700">out of {stats.totalEmployees}</p>
                                    </div>
                                    <div className="p-3 bg-green-500 rounded-full">
                                        <CheckIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 overflow-hidden shadow-lg rounded-xl border border-yellow-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-yellow-600 truncate">Pending</p>
                                        <p className="text-3xl font-bold text-yellow-900">{stats.pendingSalaries}</p>
                                        <p className="text-sm text-yellow-700">employees</p>
                                    </div>
                                    <div className="p-3 bg-yellow-500 rounded-full">
                                        <ClockIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 overflow-hidden shadow-lg rounded-xl border border-purple-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-purple-600 truncate">Average</p>
                                        <p className="text-2xl font-bold text-purple-900">{formatCurrency(stats.averageSalary)}</p>
                                        <p className="text-sm text-purple-700">per employee</p>
                                    </div>
                                    <div className="p-3 bg-purple-500 rounded-full">
                                        <UserGroupIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
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
                                <input
                                    type="month"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />

                                <select
                                    value={filterDepartment}
                                    onChange={(e) => setFilterDepartment(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Departments</option>
                                    {departments.map(department => (
                                        <option key={department.id} value={department.id}>
                                            {department.name} ({department.employees_count})
                                        </option>
                                    ))}
                                </select>

                                <button
                                    onClick={handleFilter}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors"
                                >
                                    Filter
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Salary Table */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Employee
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Attendance
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Gross Salary
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Net Salary
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
                                    {salaries.data.map((salary) => (
                                        <tr key={salary.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                                            <span className="text-white font-medium">
                                                                {salary.employee.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {salary.employee.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {salary.employee.employee_id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {salary.employee.department?.name || 'N/A'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {salary.employee.designation}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    <div className="flex items-center">
                                                        <span className="text-green-600 font-medium">
                                                            {salary.present_days}
                                                        </span>
                                                        <span className="mx-1 text-gray-400">/</span>
                                                        <span className="text-gray-600">
                                                            {salary.working_days}
                                                        </span>
                                                        <span className="ml-2 text-blue-600">
                                                            ({salary.attendance_percentage}%)
                                                        </span>
                                                    </div>
                                                    {salary.late_days > 0 && (
                                                        <div className="text-xs text-yellow-600">
                                                            {salary.late_days} late days
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatCurrency(salary.gross_salary)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Basic: {formatCurrency(salary.basic_salary)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-green-600">
                                                    {formatCurrency(salary.net_salary)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Deductions: {formatCurrency(salary.total_deductions)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(salary.status)}`}>
                                                    {salary.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                                {salary.paid_at && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Paid: {new Date(salary.paid_at).toLocaleDateString('en-GB')}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <Link
                                                    href={`/salaries/${salary.id}/slip`}
                                                    className="inline-flex items-center p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                                                    title="View Salary Slip"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                </Link>

                                                {salary.status === 'calculated' && (
                                                    <button
                                                        onClick={() => handleApproveSalary(salary.id)}
                                                        className="inline-flex items-center p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded transition-colors"
                                                        title="Approve Salary"
                                                    >
                                                        <CheckIcon className="w-4 h-4" />
                                                    </button>
                                                )}

                                                {salary.status === 'approved' && (
                                                    <button
                                                        onClick={() => handlePaySalary(salary.id)}
                                                        className="inline-flex items-center p-1 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded transition-colors"
                                                        title="Process Payment"
                                                    >
                                                        <BanknotesIcon className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {salaries.data.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-lg mb-2">No salary records found</div>
                                <div className="text-gray-500">
                                    {stats.pendingSalaries > 0 ?
                                        'Click "Calculate Salaries" to process monthly salaries' :
                                        'Try adjusting your filters or select a different month'
                                    }
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {salaries.last_page > 1 && (
                        <div className="flex items-center justify-between bg-white px-6 py-3 border-t border-gray-200 mt-6 rounded-lg shadow-sm">
                            <div className="flex-1 flex justify-between sm:hidden">
                                {salaries.prev_page_url && (
                                    <Link
                                        href={salaries.prev_page_url}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Previous
                                    </Link>
                                )}
                                {salaries.next_page_url && (
                                    <Link
                                        href={salaries.next_page_url}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{salaries.from}</span> to{' '}
                                        <span className="font-medium">{salaries.to}</span> of{' '}
                                        <span className="font-medium">{salaries.total}</span> results
                                    </p>
                                </div>
                                <div className="flex space-x-1">
                                    {Array.from({ length: salaries.last_page }, (_, i) => i + 1).map((page) => (
                                        <Link
                                            key={page}
                                            href={`${salaries.path}?page=${page}`}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                page === salaries.current_page
                                                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            {page}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
