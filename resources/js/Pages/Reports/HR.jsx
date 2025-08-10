import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    ChartBarIcon,
    DocumentTextIcon,
    CalendarDaysIcon,
    UserGroupIcon,
    BanknotesIcon,
    ClockIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

export default function HRReports({
    attendanceStats,
    salaryStats,
    departmentStats,
    monthlyTrends,
    employees,
    auth
}) {
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [reportType, setReportType] = useState('attendance');

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const handleExportReport = (type) => {
        const params = new URLSearchParams({
            type: type,
            period: selectedPeriod,
            department: selectedDepartment !== 'all' ? selectedDepartment : '',
        });

        router.get(`/reports/export/hr?${params.toString()}`);
    };

    const getTrendIcon = (trend) => {
        if (trend > 0) return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
        if (trend < 0) return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
        return <div className="w-4 h-4" />;
    };

    const getTrendColor = (trend) => {
        if (trend > 0) return 'text-green-600';
        if (trend < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    return (
        <AppLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        HR Analytics & Reports
                    </h2>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => handleExportReport('attendance')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors"
                        >
                            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                            Export Attendance
                        </button>
                        <button
                            onClick={() => handleExportReport('salary')}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-colors"
                        >
                            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                            Export Payroll
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="HR Reports & Analytics" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <select
                                    value={selectedPeriod}
                                    onChange={(e) => setSelectedPeriod(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="week">This Week</option>
                                    <option value="month">This Month</option>
                                    <option value="quarter">This Quarter</option>
                                    <option value="year">This Year</option>
                                </select>

                                <select
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Departments</option>
                                    {departmentStats?.map(dept => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name} ({dept.employees_count} employees)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setReportType('attendance')}
                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                        reportType === 'attendance'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Attendance
                                </button>
                                <button
                                    onClick={() => setReportType('payroll')}
                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                        reportType === 'payroll'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Payroll
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden shadow-lg rounded-xl border border-blue-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600 truncate">Average Attendance</p>
                                        <p className="text-3xl font-bold text-blue-900">
                                            {attendanceStats?.average_attendance || 0}%
                                        </p>
                                        <div className="flex items-center mt-1">
                                            {getTrendIcon(attendanceStats?.attendance_trend || 0)}
                                            <span className={`text-sm ml-1 ${getTrendColor(attendanceStats?.attendance_trend || 0)}`}>
                                                {Math.abs(attendanceStats?.attendance_trend || 0).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-blue-500 rounded-full">
                                        <ClockIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 overflow-hidden shadow-lg rounded-xl border border-green-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600 truncate">Total Payroll</p>
                                        <p className="text-2xl font-bold text-green-900">
                                            {formatCurrency(salaryStats?.total_payroll || 0)}
                                        </p>
                                        <div className="flex items-center mt-1">
                                            {getTrendIcon(salaryStats?.payroll_trend || 0)}
                                            <span className={`text-sm ml-1 ${getTrendColor(salaryStats?.payroll_trend || 0)}`}>
                                                {Math.abs(salaryStats?.payroll_trend || 0).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-green-500 rounded-full">
                                        <BanknotesIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 overflow-hidden shadow-lg rounded-xl border border-purple-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-purple-600 truncate">Overtime Hours</p>
                                        <p className="text-3xl font-bold text-purple-900">
                                            {attendanceStats?.total_overtime_hours || 0}
                                        </p>
                                        <p className="text-sm text-purple-700">
                                            Cost: {formatCurrency(attendanceStats?.overtime_cost || 0)}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-purple-500 rounded-full">
                                        <ChartBarIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden shadow-lg rounded-xl border border-orange-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-orange-600 truncate">Late Arrivals</p>
                                        <p className="text-3xl font-bold text-orange-900">
                                            {attendanceStats?.late_arrivals || 0}
                                        </p>
                                        <p className="text-sm text-orange-700">
                                            Impact: {formatCurrency(attendanceStats?.late_penalty || 0)}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-orange-500 rounded-full">
                                        <CalendarDaysIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Department Performance */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Department Performance</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {departmentStats?.map((dept) => (
                                        <div key={dept.id} className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                                                <span className="text-sm text-gray-600">
                                                    {dept.employees_count} employees
                                                </span>
                                            </div>

                                            {/* Attendance Progress */}
                                            <div className="mb-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Attendance</span>
                                                    <span className="font-medium">{dept.attendance_rate}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full"
                                                        style={{ width: `${dept.attendance_rate}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* Salary Info */}
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-600">Avg Salary:</span>
                                                    <div className="font-medium text-green-600">
                                                        {formatCurrency(dept.avg_salary)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Total Cost:</span>
                                                    <div className="font-medium text-purple-600">
                                                        {formatCurrency(dept.total_salary_cost)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Monthly Trends Chart Placeholder */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
                            </div>
                            <div className="p-6">
                                {/* Chart will be implemented with Chart.js */}
                                <div className="space-y-4">
                                    {monthlyTrends?.map((month, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {new Date(month.month).toLocaleDateString('en-GB', {
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {month.working_days} working days
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-blue-600">
                                                    {month.attendance_rate}%
                                                </div>
                                                <div className="text-sm text-green-600">
                                                    {formatCurrency(month.total_payroll)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {(!monthlyTrends || monthlyTrends.length === 0) && (
                                    <div className="text-center py-8">
                                        <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No trend data available</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Historical data will appear here as it becomes available.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Employee Performance Table */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-900">Employee Performance Summary</h3>
                                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                                    <option value="attendance">Sort by Attendance</option>
                                    <option value="salary">Sort by Salary</option>
                                    <option value="performance">Sort by Performance</option>
                                </select>
                            </div>
                        </div>
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
                                            Attendance Rate
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Monthly Salary
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Overtime Hours
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Performance
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {employees?.data?.map((employee) => (
                                        <tr key={employee.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                                            <span className="text-white font-medium">
                                                                {employee.name.charAt(0)}
                                                            </span>
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
                                                <div className="text-sm text-gray-900">{employee.department?.name}</div>
                                                <div className="text-sm text-gray-500">{employee.designation}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                                                        <div
                                                            className={`h-2 rounded-full ${
                                                                employee.attendance_rate >= 90
                                                                    ? 'bg-green-500'
                                                                    : employee.attendance_rate >= 80
                                                                    ? 'bg-yellow-500'
                                                                    : 'bg-red-500'
                                                            }`}
                                                            style={{ width: `${employee.attendance_rate}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {employee.attendance_rate}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatCurrency(employee.current_salary)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {employee.overtime_hours || 0} hrs
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                    employee.performance_score >= 90
                                                        ? 'text-green-800 bg-green-100'
                                                        : employee.performance_score >= 80
                                                        ? 'text-yellow-800 bg-yellow-100'
                                                        : employee.performance_score >= 70
                                                        ? 'text-orange-800 bg-orange-100'
                                                        : 'text-red-800 bg-red-100'
                                                }`}>
                                                    {employee.performance_score >= 90
                                                        ? 'Excellent'
                                                        : employee.performance_score >= 80
                                                        ? 'Good'
                                                        : employee.performance_score >= 70
                                                        ? 'Average'
                                                        : 'Below Average'
                                                    }
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {(!employees?.data || employees.data.length === 0) && (
                            <div className="text-center py-12">
                                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No employee data available</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Employee performance data will appear here once attendance and salary records are available.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
