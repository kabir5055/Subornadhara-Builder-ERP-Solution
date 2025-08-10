import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { BanknotesIcon, CalendarDaysIcon, UserIcon, ClockIcon, CalculatorIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function SalarySlip({ salary, employee, company = null, auth }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const printSlip = () => {
        window.print();
    };

    return (
        <AppLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Salary Slip - {employee.name}
                    </h2>
                    <button
                        onClick={printSlip}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors print:hidden"
                    >
                        <DocumentTextIcon className="w-5 h-5 mr-2" />
                        Print Slip
                    </button>
                </div>
            }
        >
            <Head title={`Salary Slip - ${employee.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden print:shadow-none print:border-none">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white print:bg-gray-800">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">
                                        {company?.name || 'Subornadhara Builder Ltd.'}
                                    </h1>
                                    <p className="text-blue-100">
                                        {company?.address || 'Dhaka, Bangladesh'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                        <p className="text-blue-100 text-sm">Salary Month</p>
                                        <p className="text-2xl font-bold">
                                            {new Date(salary.salary_month).toLocaleDateString('en-GB', {
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Employee Information */}
                        <div className="p-8 bg-gray-50 border-b border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0 h-16 w-16">
                                        <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
                                            <span className="text-white font-bold text-xl">
                                                {employee.name.charAt(0)}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
                                        <p className="text-gray-600">Employee ID: {employee.employee_id}</p>
                                        <p className="text-gray-600">{employee.designation}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <UserIcon className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-600">Department:</span>
                                        <span className="font-medium">{employee.department?.name || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-600">Joining Date:</span>
                                        <span className="font-medium">{formatDate(employee.joining_date)}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <ClockIcon className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-600">Generated:</span>
                                        <span className="font-medium">{formatDate(salary.created_at)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CalculatorIcon className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-600">Status:</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            salary.status === 'paid'
                                                ? 'bg-green-100 text-green-800'
                                                : salary.status === 'approved'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {salary.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Attendance Summary */}
                        <div className="p-8 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">{salary.working_days}</div>
                                    <div className="text-sm text-blue-700">Working Days</div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">{salary.present_days}</div>
                                    <div className="text-sm text-green-700">Present Days</div>
                                </div>
                                <div className="bg-red-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-red-600">{salary.absent_days}</div>
                                    <div className="text-sm text-red-700">Absent Days</div>
                                </div>
                                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-yellow-600">{salary.late_days}</div>
                                    <div className="text-sm text-yellow-700">Late Days</div>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-600">{salary.attendance_percentage}%</div>
                                    <div className="text-sm text-purple-700">Attendance</div>
                                </div>
                            </div>
                        </div>

                        {/* Salary Breakdown */}
                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Earnings */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <BanknotesIcon className="w-5 h-5 mr-2 text-green-500" />
                                        Earnings
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Basic Salary</span>
                                            <span className="font-medium">{formatCurrency(salary.basic_salary)}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600">House Rent Allowance</span>
                                            <span className="font-medium">{formatCurrency(salary.hra)}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Medical Allowance</span>
                                            <span className="font-medium">{formatCurrency(salary.medical_allowance)}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Transport Allowance</span>
                                            <span className="font-medium">{formatCurrency(salary.transport_allowance)}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Other Allowances</span>
                                            <span className="font-medium">{formatCurrency(salary.other_allowances)}</span>
                                        </div>
                                        {salary.overtime_hours > 0 && (
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-gray-600">
                                                    Overtime ({salary.overtime_hours} hrs)
                                                </span>
                                                <span className="font-medium">{formatCurrency(salary.overtime_amount)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center py-3 border-t-2 border-green-200 bg-green-50 px-3 rounded">
                                            <span className="font-semibold text-green-800">Gross Salary</span>
                                            <span className="font-bold text-green-800 text-lg">{formatCurrency(salary.gross_salary)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Deductions */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <CalculatorIcon className="w-5 h-5 mr-2 text-red-500" />
                                        Deductions
                                    </h3>
                                    <div className="space-y-3">
                                        {salary.provident_fund > 0 && (
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Provident Fund</span>
                                                <span className="font-medium text-red-600">-{formatCurrency(salary.provident_fund)}</span>
                                            </div>
                                        )}
                                        {salary.tax_deduction > 0 && (
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Income Tax</span>
                                                <span className="font-medium text-red-600">-{formatCurrency(salary.tax_deduction)}</span>
                                            </div>
                                        )}
                                        {salary.late_deduction > 0 && (
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Late Deduction ({salary.late_days} days)</span>
                                                <span className="font-medium text-red-600">-{formatCurrency(salary.late_deduction)}</span>
                                            </div>
                                        )}
                                        {salary.absent_deduction > 0 && (
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Absent Deduction ({salary.absent_days} days)</span>
                                                <span className="font-medium text-red-600">-{formatCurrency(salary.absent_deduction)}</span>
                                            </div>
                                        )}
                                        {salary.advance_deduction > 0 && (
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Advance Deduction</span>
                                                <span className="font-medium text-red-600">-{formatCurrency(salary.advance_deduction)}</span>
                                            </div>
                                        )}
                                        {salary.other_deductions > 0 && (
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Other Deductions</span>
                                                <span className="font-medium text-red-600">-{formatCurrency(salary.other_deductions)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center py-3 border-t-2 border-red-200 bg-red-50 px-3 rounded">
                                            <span className="font-semibold text-red-800">Total Deductions</span>
                                            <span className="font-bold text-red-800 text-lg">-{formatCurrency(salary.total_deductions)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Net Salary */}
                            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Net Salary</h3>
                                        <p className="text-gray-600">Amount to be paid</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-green-600">
                                            {formatCurrency(salary.net_salary)}
                                        </div>
                                        {salary.paid_at && (
                                            <p className="text-sm text-green-700">
                                                Paid on {formatDate(salary.paid_at)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details */}
                            {salary.status === 'paid' && (
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-2">Payment Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Payment Method:</span>
                                            <span className="ml-2 font-medium capitalize">
                                                {salary.payment_method?.replace('_', ' ') || 'N/A'}
                                            </span>
                                        </div>
                                        {salary.payment_reference && (
                                            <div>
                                                <span className="text-gray-600">Reference:</span>
                                                <span className="ml-2 font-medium">{salary.payment_reference}</span>
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-gray-600">Payment Date:</span>
                                            <span className="ml-2 font-medium">{formatDate(salary.paid_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Footer Note */}
                            <div className="mt-8 pt-6 border-t border-gray-200 text-center print:mt-12">
                                <p className="text-sm text-gray-500 mb-2">
                                    This is a computer-generated salary slip and does not require a signature.
                                </p>
                                <p className="text-xs text-gray-400">
                                    Generated on {formatDate(new Date())} by {auth.user.name}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
