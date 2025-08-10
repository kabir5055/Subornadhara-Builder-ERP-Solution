import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    UserGroupIcon,
    ClockIcon,
    BanknotesIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    DocumentTextIcon,
    CogIcon,
    PlusIcon,
    EyeIcon,
    ArrowUpIcon,
    ArrowDownIcon
} from '@heroicons/react/24/outline';

export default function EmployeeDashboard({
    employees,
    todayAttendance,
    monthlyStats,
    recentSalaries,
    departments,
    auth
}) {
    const [selectedPeriod, setSelectedPeriod] = useState('today');

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const getAttendanceStatusColor = (status) => {
        switch (status) {
            case 'present': return 'text-green-800 bg-green-100';
            case 'late': return 'text-yellow-800 bg-yellow-100';
            case 'absent': return 'text-red-800 bg-red-100';
            default: return 'text-gray-800 bg-gray-100';
        }
    };

    return (
        <AppLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Employee Management Dashboard
                    </h2>
                    <div className="flex space-x-3">
                        <Link
                            href={window.route('employees.create')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Employee
                        </Link>
                        <Link
                            href={window.route('attendance.portal')}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-colors"
                        >
                            <ClockIcon className="w-5 h-5 mr-2" />
                            Attendance Portal
                        </Link>
                        <Link
                            href={window.route('salaries.index')}
                            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 transition-colors"
                        >
                            <BanknotesIcon className="w-5 h-5 mr-2" />
                            Salary Management
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Employee Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* Overview Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Employees */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden shadow-lg rounded-xl border border-blue-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600 truncate">Total Employees</p>
                                        <p className="text-3xl font-bold text-blue-900">{employees.total}</p>
                                        <p className="text-sm text-blue-700">
                                            Active: {employees.active} | Inactive: {employees.inactive}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-blue-500 rounded-full">
                                        <UserGroupIcon className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Today's Attendance */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 overflow-hidden shadow-lg rounded-xl border border-green-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600 truncate">Today's Attendance</p>
                                        <p className="text-3xl font-bold text-green-900">
                                            {todayAttendance.present}/{todayAttendance.total}
                                        </p>
                                        <p className="text-sm text-green-700">
                                            {todayAttendance.percentage}% Present
                                        </p>
                                    </div>
                                    <div className="p-3 bg-green-500 rounded-full">
                                        <ClockIcon className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Monthly Salary */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 overflow-hidden shadow-lg rounded-xl border border-purple-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-purple-600 truncate">Monthly Payroll</p>
                                        <p className="text-2xl font-bold text-purple-900">
                                            {formatCurrency(monthlyStats.totalPayroll)}
                                        </p>
                                        <p className="text-sm text-purple-700">
                                            Avg: {formatCurrency(monthlyStats.averageSalary)}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-purple-500 rounded-full">
                                        <BanknotesIcon className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Departments */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden shadow-lg rounded-xl border border-orange-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-orange-600 truncate">Departments</p>
                                        <p className="text-3xl font-bold text-orange-900">{departments.count}</p>
                                        <p className="text-sm text-orange-700">
                                            Largest: {departments.largest?.name} ({departments.largest?.employees_count})
                                        </p>
                                    </div>
                                    <div className="p-3 bg-orange-500 rounded-full">
                                        <ChartBarIcon className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Today's Attendance Details */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Today's Attendance</h3>
                                    <Link
                                        href={window.route('attendance.report')}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        View Full Report →
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {todayAttendance.details?.map((attendance) => (
                                        <div key={attendance.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                                        <span className="text-white font-medium">
                                                            {attendance.employee.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {attendance.employee.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {attendance.employee.department?.name} - {attendance.employee.designation}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="text-right">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {attendance.clock_in ?
                                                            new Date(attendance.clock_in).toLocaleTimeString('en-GB', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            }) : '--:--'
                                                        }
                                                    </div>
                                                    <div className="text-xs text-gray-500">Clock In</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {attendance.clock_out ?
                                                            new Date(attendance.clock_out).toLocaleTimeString('en-GB', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            }) : '--:--'
                                                        }
                                                    </div>
                                                    <div className="text-xs text-gray-500">Clock Out</div>
                                                </div>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAttendanceStatusColor(attendance.status)}`}>
                                                    {attendance.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {todayAttendance.details?.length === 0 && (
                                    <div className="text-center py-8">
                                        <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            No employees have marked attendance today.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions & Recent Salaries */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                                </div>
                                <div className="p-6 space-y-3">
                                    <Link
                                        href={window.route('attendance.bulk-import.form')}
                                        className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <DocumentTextIcon className="w-5 h-5 mr-3 text-blue-500" />
                                        <span className="text-sm font-medium">Import Attendance</span>
                                    </Link>

                                    <Link
                                        href={window.route('salaries.bulk-calculate')}
                                        className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <BanknotesIcon className="w-5 h-5 mr-3 text-green-500" />
                                        <span className="text-sm font-medium">Calculate Salaries</span>
                                    </Link>

                                    <Link
                                        href={window.route('employees.index')}
                                        className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <UserGroupIcon className="w-5 h-5 mr-3 text-purple-500" />
                                        <span className="text-sm font-medium">Manage Employees</span>
                                    </Link>

                                    <Link
                                        href={`${window.route('reports.index')}?type=hr`}
                                        className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <ChartBarIcon className="w-5 h-5 mr-3 text-orange-500" />
                                        <span className="text-sm font-medium">HR Reports</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Recent Salary Payments */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900">Recent Salaries</h3>
                                        <Link
                                            href={window.route('salaries.index')}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            View All →
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {recentSalaries?.map((salary) => (
                                            <div key={salary.id} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex-shrink-0 h-8 w-8">
                                                        <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                                                            <span className="text-white text-xs font-medium">
                                                                {salary.employee.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {salary.employee.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(salary.salary_month).toLocaleDateString('en-GB', {
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium text-green-600">
                                                        {formatCurrency(salary.net_salary)}
                                                    </div>
                                                    <div className={`text-xs px-2 py-1 rounded-full ${
                                                        salary.status === 'paid'
                                                            ? 'text-green-700 bg-green-100'
                                                            : 'text-yellow-700 bg-yellow-100'
                                                    }`}>
                                                        {salary.status}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {recentSalaries?.length === 0 && (
                                        <div className="text-center py-6">
                                            <BanknotesIcon className="mx-auto h-8 w-8 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-500">
                                                No recent salary records
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Department Overview */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Department Overview</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {departments.list?.map((department) => (
                                    <div key={department.id} className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{department.name}</h4>
                                                <p className="text-sm text-gray-600">{department.description}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-blue-600">
                                                    {department.employees_count}
                                                </div>
                                                <div className="text-xs text-gray-500">employees</div>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Attendance Today:</span>
                                            <span className="font-medium text-green-600">
                                                {department.today_present}/{department.employees_count}
                                                ({Math.round((department.today_present / department.employees_count) * 100) || 0}%)
                                            </span>
                                        </div>
                                        {department.avg_salary && (
                                            <div className="mt-2 flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Avg Salary:</span>
                                                <span className="font-medium text-purple-600">
                                                    {formatCurrency(department.avg_salary)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {departments.list?.length === 0 && (
                                <div className="text-center py-8">
                                    <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No departments found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Create departments to organize your employees.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
