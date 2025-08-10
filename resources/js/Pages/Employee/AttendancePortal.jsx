import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ClockIcon, CalendarDaysIcon, UserCircleIcon, ChartBarIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function AttendancePortal({
    employee,
    todayAttendance,
    monthlyAttendance,
    stats,
    currentSalary,
    currentMonth,
    auth
}) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isClocking, setIsClocking] = useState(false);
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                },
                () => {
                    setLocation('Location not available');
                }
            );
        }
    }, []);

    const handleClockAction = async (action) => {
        setIsClocking(true);

        try {
            const response = await fetch(route('attendance.clock'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                    action,
                    location,
                    notes,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Refresh the page to update attendance data
                router.reload();
                setNotes('');
            } else {
                alert(data.error || 'An error occurred');
            }
        } catch (error) {
            alert('Network error occurred');
        } finally {
            setIsClocking(false);
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-BD', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-BD', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return 'text-green-800 bg-green-100 border-green-200';
            case 'absent': return 'text-red-800 bg-red-100 border-red-200';
            case 'half_day': return 'text-yellow-800 bg-yellow-100 border-yellow-200';
            case 'sick_leave': return 'text-blue-800 bg-blue-100 border-blue-200';
            case 'casual_leave': return 'text-purple-800 bg-purple-100 border-purple-200';
            default: return 'text-gray-800 bg-gray-100 border-gray-200';
        }
    };

    const canClockIn = !todayAttendance || !todayAttendance.check_in;
    const canClockOut = todayAttendance && todayAttendance.check_in && !todayAttendance.check_out;

    return (
        <AppLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Employee Attendance Portal
                        </h2>
                        <p className="text-sm text-gray-600">
                            Welcome, {employee.name} ({employee.employee_id})
                        </p>
                    </div>

                    <div className="text-right">
                        <div className="text-2xl font-mono font-bold text-blue-600">
                            {formatTime(currentTime)}
                        </div>
                        <div className="text-sm text-gray-600">
                            {formatDate(currentTime)}
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Attendance Portal" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Clock In/Out Section */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg border border-blue-200 p-8 mb-8">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-600 rounded-full mb-6">
                                <ClockIcon className="w-12 h-12 text-white" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Time Tracking
                            </h3>

                            {/* Today's Status */}
                            {todayAttendance ? (
                                <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 mb-1">Check In</p>
                                            <p className="text-lg font-bold text-green-600">
                                                {todayAttendance.check_in ?
                                                    new Date(todayAttendance.check_in).toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit' }) :
                                                    'Not clocked in'
                                                }
                                            </p>
                                            {todayAttendance.is_late && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                                                    <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                                                    Late
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 mb-1">Check Out</p>
                                            <p className="text-lg font-bold text-red-600">
                                                {todayAttendance.check_out ?
                                                    new Date(todayAttendance.check_out).toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit' }) :
                                                    'Not clocked out'
                                                }
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 mb-1">Duration</p>
                                            <p className="text-lg font-bold text-blue-600">
                                                {todayAttendance.total_hours ?
                                                    `${Math.floor(todayAttendance.total_hours)}h ${Math.round((todayAttendance.total_hours % 1) * 60)}m` :
                                                    'In progress'
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(todayAttendance.status)}`}>
                                            <CheckCircleIcon className="w-4 h-4 mr-1" />
                                            {todayAttendance.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                                    <p className="text-gray-600">No attendance record for today</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                                {canClockIn && (
                                    <button
                                        onClick={() => handleClockAction('clock_in')}
                                        disabled={isClocking}
                                        className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
                                    >
                                        <ClockIcon className="w-6 h-6 mr-2" />
                                        {isClocking ? 'Clocking In...' : 'Clock In'}
                                    </button>
                                )}

                                {canClockOut && (
                                    <button
                                        onClick={() => handleClockAction('clock_out')}
                                        disabled={isClocking}
                                        className="flex items-center px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
                                    >
                                        <ClockIcon className="w-6 h-6 mr-2" />
                                        {isClocking ? 'Clocking Out...' : 'Clock Out'}
                                    </button>
                                )}
                            </div>

                            {/* Additional Notes */}
                            <div className="mt-6">
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add any notes (optional)"
                                    rows={2}
                                    className="w-full max-w-md mx-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>

                            {/* Location Info */}
                            {location && (
                                <div className="mt-4 text-sm text-gray-600">
                                    <p>Location: {location}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Monthly Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 overflow-hidden shadow-lg rounded-xl border border-green-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600 truncate">Present Days</p>
                                        <p className="text-3xl font-bold text-green-900">{stats.presentDays}</p>
                                        <p className="text-sm text-green-700">out of {stats.totalWorkingDays}</p>
                                    </div>
                                    <div className="p-3 bg-green-500 rounded-full">
                                        <CheckCircleIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-red-50 to-red-100 overflow-hidden shadow-lg rounded-xl border border-red-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-red-600 truncate">Absent Days</p>
                                        <p className="text-3xl font-bold text-red-900">{stats.absentDays}</p>
                                        <p className="text-sm text-red-700">missed days</p>
                                    </div>
                                    <div className="p-3 bg-red-500 rounded-full">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 overflow-hidden shadow-lg rounded-xl border border-yellow-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-yellow-600 truncate">Late Days</p>
                                        <p className="text-3xl font-bold text-yellow-900">{stats.lateDays}</p>
                                        <p className="text-sm text-yellow-700">late arrivals</p>
                                    </div>
                                    <div className="p-3 bg-yellow-500 rounded-full">
                                        <ExclamationTriangleIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden shadow-lg rounded-xl border border-blue-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600 truncate">Attendance</p>
                                        <p className="text-3xl font-bold text-blue-900">{stats.attendancePercentage}%</p>
                                        <p className="text-sm text-blue-700">this month</p>
                                    </div>
                                    <div className="p-3 bg-blue-500 rounded-full">
                                        <ChartBarIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attendance History */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <CalendarDaysIcon className="w-5 h-5 mr-2" />
                                {currentMonth} Attendance History
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {monthlyAttendance.map((record) => (
                                        <tr key={record.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {new Date(record.date).toLocaleDateString('en-BD')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.check_in ?
                                                    <>
                                                        {new Date(record.check_in).toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit' })}
                                                        {record.is_late && (
                                                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                Late
                                                            </span>
                                                        )}
                                                    </> :
                                                    '-'
                                                }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.check_out ?
                                                    new Date(record.check_out).toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit' }) :
                                                    '-'
                                                }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.total_hours ?
                                                    `${Math.floor(record.total_hours)}h ${Math.round((record.total_hours % 1) * 60)}m` :
                                                    '-'
                                                }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                                                    {record.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Salary Information */}
                    {currentSalary && (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <UserCircleIcon className="w-5 h-5 mr-2" />
                                {currentMonth} Salary Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <p className="text-sm text-green-600 mb-1">Net Salary</p>
                                    <p className="text-2xl font-bold text-green-900">
                                        ৳{currentSalary.net_salary.toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-600 mb-1">Gross Salary</p>
                                    <p className="text-2xl font-bold text-blue-900">
                                        ৳{currentSalary.gross_salary.toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <p className="text-sm text-purple-600 mb-1">Status</p>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentSalary.status === 'paid' ? 'bg-green-100 text-green-800' : currentSalary.status === 'approved' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {currentSalary.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
