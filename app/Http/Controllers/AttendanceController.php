<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Attendance;
use App\Models\Salary;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Show bulk import form (stub page)
     */
    public function bulkImportForm()
    {
        return Inertia::render('Attendance/BulkImport');
    }
    /**
     * Display attendance dashboard for employees
     */
    public function employeePortal()
    {
        $employee = Employee::where('user_id', Auth::id())->first();

        if (!$employee) {
            return redirect()->route('dashboard')->with('error', 'Employee profile not found.');
        }

        $today = Carbon::today();
        $currentMonth = Carbon::now();
        $startOfMonth = $currentMonth->copy()->startOfMonth();
        $endOfMonth = $currentMonth->copy()->endOfMonth();

        // Get today's attendance
        $todayAttendance = Attendance::where('employee_id', $employee->id)
            ->where('date', $today->toDateString())
            ->first();

        // Get current month attendance
        $monthlyAttendance = Attendance::where('employee_id', $employee->id)
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->orderBy('date', 'desc')
            ->get();

        // Calculate monthly stats
        $totalWorkingDays = $startOfMonth->diffInWeekdays($endOfMonth) + 1;
        $presentDays = $monthlyAttendance->where('status', 'present')->count();
        $lateDays = $monthlyAttendance->where('is_late', true)->count();
        $absentDays = $totalWorkingDays - $presentDays;

        // Calculate total hours this month
        $totalHours = $monthlyAttendance->where('status', 'present')->sum('total_hours');

        // Get salary info for current month
        $currentSalary = Salary::where('employee_id', $employee->id)
            ->whereYear('month', $currentMonth->year)
            ->whereMonth('month', $currentMonth->month)
            ->first();

        return Inertia::render('Employee/AttendancePortal', [
            'employee' => $employee->load('department'),
            'todayAttendance' => $todayAttendance,
            'monthlyAttendance' => $monthlyAttendance,
            'stats' => [
                'totalWorkingDays' => $totalWorkingDays,
                'presentDays' => $presentDays,
                'absentDays' => $absentDays,
                'lateDays' => $lateDays,
                'totalHours' => round($totalHours, 2),
                'attendancePercentage' => $totalWorkingDays > 0 ? round(($presentDays / $totalWorkingDays) * 100, 1) : 0,
            ],
            'currentSalary' => $currentSalary,
            'currentMonth' => $currentMonth->format('F Y'),
        ]);
    }

    /**
     * Clock in/out for employees
     */
    public function clockInOut(Request $request)
    {
        $request->validate([
            'action' => 'required|in:clock_in,clock_out',
            'location' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:500',
        ]);

        $employee = Employee::where('user_id', Auth::id())->first();

        if (!$employee) {
            return response()->json(['error' => 'Employee profile not found.'], 404);
        }

        $today = Carbon::today();
        $now = Carbon::now();

        // Get or create today's attendance record
        $attendance = Attendance::firstOrCreate(
            [
                'employee_id' => $employee->id,
                'date' => $today,
            ],
            [
                'status' => 'absent',
                'check_in' => null,
                'check_out' => null,
                'total_hours' => 0,
                'is_late' => false,
                'notes' => '',
            ]
        );

        if ($request->action === 'clock_in') {
            if ($attendance->check_in) {
                return response()->json(['error' => 'Already clocked in for today.'], 400);
            }

            // Define office hours (can be configured per department)
            $officeStartTime = Carbon::parse('09:00');
            $isLate = $now->gt($officeStartTime);

            $attendance->update([
                'check_in' => $now,
                'status' => 'present',
                'is_late' => $isLate,
                'location' => $request->location,
                'notes' => $request->notes,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Clocked in successfully' . ($isLate ? ' (Late)' : ''),
                'attendance' => $attendance,
            ]);

        } else if ($request->action === 'clock_out') {
            if (!$attendance->check_in) {
                return response()->json(['error' => 'Must clock in first.'], 400);
            }

            if ($attendance->check_out) {
                return response()->json(['error' => 'Already clocked out for today.'], 400);
            }

            $checkIn = Carbon::parse($attendance->check_in);
            $totalHours = $now->diffInHours($checkIn, true);

            $attendance->update([
                'check_out' => $now,
                'total_hours' => $totalHours,
                'notes' => $attendance->notes . ' | ' . $request->notes,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Clocked out successfully',
                'attendance' => $attendance,
                'total_hours' => round($totalHours, 2),
            ]);
        }
    }

    /**
     * Manual attendance marking (for HR/Admin)
     */
    public function markAttendance(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'status' => 'required|in:present,absent,half_day,sick_leave,casual_leave',
            'check_in' => 'nullable|date_format:H:i',
            'check_out' => 'nullable|date_format:H:i',
            'notes' => 'nullable|string|max:500',
        ]);

        $employee = Employee::findOrFail($request->employee_id);
        $date = Carbon::parse($request->date);

        // Calculate total hours if both check in/out provided
        $totalHours = 0;
        $isLate = false;

        if ($request->check_in && $request->check_out) {
            $checkIn = Carbon::parse($request->check_in);
            $checkOut = Carbon::parse($request->check_out);
            $totalHours = $checkOut->diffInHours($checkIn, true);

            // Check if late (after 9 AM)
            $officeStartTime = Carbon::parse('09:00');
            $isLate = $checkIn->gt($officeStartTime);
        }

        Attendance::updateOrCreate(
            [
                'employee_id' => $request->employee_id,
                'date' => $date,
            ],
            [
                'status' => $request->status,
                'check_in' => $request->check_in ? $date->copy()->setTimeFromTimeString($request->check_in) : null,
                'check_out' => $request->check_out ? $date->copy()->setTimeFromTimeString($request->check_out) : null,
                'total_hours' => $totalHours,
                'is_late' => $isLate,
                'notes' => $request->notes,
                'marked_by' => Auth::id(),
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Attendance marked successfully',
        ]);
    }

    /**
     * Get attendance data for specific employee and month
     */
    public function getAttendanceData(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'month' => 'required|date_format:Y-m',
        ]);

        $employeeId = $request->employee_id;
        $month = Carbon::createFromFormat('Y-m', $request->month);
        $startOfMonth = $month->copy()->startOfMonth();
        $endOfMonth = $month->copy()->endOfMonth();

        $attendance = Attendance::where('employee_id', $employeeId)
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->orderBy('date', 'asc')
            ->get();

        // Generate calendar data
        $calendar = [];
        $currentDate = $startOfMonth->copy();

        while ($currentDate <= $endOfMonth) {
            $attendanceRecord = $attendance->where('date', $currentDate->toDateString())->first();

            $calendar[] = [
                'date' => $currentDate->toDateString(),
                'day' => $currentDate->day,
                'day_name' => $currentDate->format('D'),
                'is_weekend' => $currentDate->isWeekend(),
                'attendance' => $attendanceRecord,
            ];

            $currentDate->addDay();
        }

        // Calculate stats
        $totalWorkingDays = $startOfMonth->diffInWeekdays($endOfMonth) + 1;
        $presentDays = $attendance->where('status', 'present')->count();
        $absentDays = $attendance->where('status', 'absent')->count();
        $lateDays = $attendance->where('is_late', true)->count();
        $totalHours = $attendance->where('status', 'present')->sum('total_hours');

        return response()->json([
            'calendar' => $calendar,
            'stats' => [
                'totalWorkingDays' => $totalWorkingDays,
                'presentDays' => $presentDays,
                'absentDays' => $absentDays,
                'lateDays' => $lateDays,
                'totalHours' => round($totalHours, 2),
                'attendancePercentage' => $totalWorkingDays > 0 ? round(($presentDays / $totalWorkingDays) * 100, 1) : 0,
            ],
        ]);
    }

    /**
     * Bulk import attendance from machine/CSV
     */
    public function bulkImport(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt',
            'date' => 'required|date',
        ]);

        $file = $request->file('file');
        $date = Carbon::parse($request->date);

        $handle = fopen($file->getRealPath(), 'r');
        $imported = 0;
        $errors = [];

        // Skip header row
        fgetcsv($handle);

        while (($row = fgetcsv($handle)) !== false) {
            try {
                // Expected CSV format: employee_id, check_in_time, check_out_time
                list($employeeId, $checkInTime, $checkOutTime) = $row;

                $employee = Employee::find($employeeId);
                if (!$employee) {
                    $errors[] = "Employee ID {$employeeId} not found";
                    continue;
                }

                $checkIn = $checkInTime ? $date->copy()->setTimeFromTimeString($checkInTime) : null;
                $checkOut = $checkOutTime ? $date->copy()->setTimeFromTimeString($checkOutTime) : null;

                $totalHours = 0;
                $isLate = false;

                if ($checkIn && $checkOut) {
                    $totalHours = $checkOut->diffInHours($checkIn, true);
                    $officeStartTime = Carbon::parse('09:00');
                    $isLate = $checkIn->gt($officeStartTime);
                }

                Attendance::updateOrCreate(
                    [
                        'employee_id' => $employeeId,
                        'date' => $date,
                    ],
                    [
                        'status' => $checkIn ? 'present' : 'absent',
                        'check_in' => $checkIn,
                        'check_out' => $checkOut,
                        'total_hours' => $totalHours,
                        'is_late' => $isLate,
                        'notes' => 'Imported from attendance machine',
                        'marked_by' => Auth::id(),
                    ]
                );

                $imported++;

            } catch (\Exception $e) {
                $errors[] = "Row error: " . $e->getMessage();
            }
        }

        fclose($handle);

        return response()->json([
            'success' => true,
            'message' => "{$imported} records imported successfully",
            'errors' => $errors,
        ]);
    }

    /**
     * Generate attendance report
     */
    public function generateReport(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'department_id' => 'nullable|exists:departments,id',
            'employee_id' => 'nullable|exists:employees,id',
        ]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);

        $query = Attendance::with(['employee.department'])
            ->whereBetween('date', [$startDate, $endDate]);

        if ($request->department_id) {
            $query->whereHas('employee', function ($q) use ($request) {
                $q->where('department_id', $request->department_id);
            });
        }

        if ($request->employee_id) {
            $query->where('employee_id', $request->employee_id);
        }

        $attendanceRecords = $query->orderBy('date', 'desc')
            ->orderBy('employee_id')
            ->get();

        return response()->json([
            'data' => $attendanceRecords,
            'summary' => [
                'total_records' => $attendanceRecords->count(),
                'present_days' => $attendanceRecords->where('status', 'present')->count(),
                'absent_days' => $attendanceRecords->where('status', 'absent')->count(),
                'late_days' => $attendanceRecords->where('is_late', true)->count(),
                'total_hours' => round($attendanceRecords->sum('total_hours'), 2),
            ],
        ]);
    }
}
