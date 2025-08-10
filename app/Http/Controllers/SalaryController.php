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

class SalaryController extends Controller
{
    /**
     * Display salary dashboard
     */
    public function index(Request $request)
    {
        $currentMonth = Carbon::now();
        $selectedMonth = $request->month ? Carbon::createFromFormat('Y-m', $request->month) : $currentMonth;

        $salaries = Salary::with(['employee.department'])
            ->whereYear('month', $selectedMonth->year)
            ->whereMonth('month', $selectedMonth->month)
            ->when($request->department_id, function ($query, $departmentId) {
                return $query->whereHas('employee', function ($q) use ($departmentId) {
                    $q->where('department_id', $departmentId);
                });
            })
            ->when($request->search, function ($query, $search) {
                return $query->whereHas('employee', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('employee_id', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        // Calculate summary statistics
        $totalSalaries = Salary::whereYear('month', $selectedMonth->year)
            ->whereMonth('month', $selectedMonth->month)
            ->sum('net_salary');

        $totalEmployees = Employee::where('status', 'active')->count();
        $processedSalaries = $salaries->total();
        $pendingSalaries = $totalEmployees - $processedSalaries;

        $departments = Department::withCount(['employees' => function ($query) {
            $query->where('status', 'active');
        }])->get();

        return Inertia::render('Salary/Index', [
            'salaries' => $salaries,
            'departments' => $departments,
            'stats' => [
                'totalSalaries' => $totalSalaries,
                'totalEmployees' => $totalEmployees,
                'processedSalaries' => $processedSalaries,
                'pendingSalaries' => $pendingSalaries,
                'averageSalary' => $processedSalaries > 0 ? $totalSalaries / $processedSalaries : 0,
            ],
            'filters' => [
                'month' => $request->month,
                'department_id' => $request->department_id,
                'search' => $request->search,
            ],
            'currentMonth' => $selectedMonth->format('F Y'),
        ]);
    }

    /**
     * Calculate salary for specific month
     */
    public function calculateSalary(Request $request)
    {
        $request->validate([
            'month' => 'required|date_format:Y-m',
            'employee_ids' => 'nullable|array',
            'employee_ids.*' => 'exists:employees,id',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        $month = Carbon::createFromFormat('Y-m', $request->month);
        $startOfMonth = $month->copy()->startOfMonth();
        $endOfMonth = $month->copy()->endOfMonth();

        $employeeQuery = Employee::where('status', 'active');

        if ($request->employee_ids) {
            $employeeQuery->whereIn('id', $request->employee_ids);
        } elseif ($request->department_id) {
            $employeeQuery->where('department_id', $request->department_id);
        }

        $employees = $employeeQuery->get();
        $processedCount = 0;
        $errors = [];

        DB::beginTransaction();

        try {
            foreach ($employees as $employee) {
                // Check if salary already calculated for this month
                $existingSalary = Salary::where('employee_id', $employee->id)
                    ->whereYear('month', $month->year)
                    ->whereMonth('month', $month->month)
                    ->first();

                if ($existingSalary) {
                    continue; // Skip if already calculated
                }

                // Get attendance data for the month
                $attendanceData = $this->calculateAttendanceMetrics($employee->id, $startOfMonth, $endOfMonth);

                // Calculate salary components
                $salaryComponents = $this->calculateSalaryComponents($employee, $attendanceData);

                // Create salary record
                Salary::create([
                    'employee_id' => $employee->id,
                    'month' => $month->startOfMonth(),
                    'basic_salary' => $employee->basic_salary,
                    'house_allowance' => $salaryComponents['house_allowance'],
                    'transport_allowance' => $salaryComponents['transport_allowance'],
                    'medical_allowance' => $salaryComponents['medical_allowance'],
                    'other_allowances' => $salaryComponents['other_allowances'],
                    'overtime_amount' => $salaryComponents['overtime_amount'],
                    'bonus' => $salaryComponents['bonus'],
                    'gross_salary' => $salaryComponents['gross_salary'],
                    'tax_deduction' => $salaryComponents['tax_deduction'],
                    'provident_fund' => $salaryComponents['provident_fund'],
                    'other_deductions' => $salaryComponents['other_deductions'],
                    'attendance_deduction' => $salaryComponents['attendance_deduction'],
                    'total_deductions' => $salaryComponents['total_deductions'],
                    'net_salary' => $salaryComponents['net_salary'],
                    'working_days' => $attendanceData['total_working_days'],
                    'present_days' => $attendanceData['present_days'],
                    'absent_days' => $attendanceData['absent_days'],
                    'late_days' => $attendanceData['late_days'],
                    'overtime_hours' => $attendanceData['overtime_hours'],
                    'total_hours' => $attendanceData['total_hours'],
                    'attendance_percentage' => $attendanceData['attendance_percentage'],
                    'status' => 'calculated',
                    'calculated_by' => Auth::id(),
                    'calculated_at' => now(),
                ]);

                $processedCount++;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Salary calculated for {$processedCount} employees",
                'processed_count' => $processedCount,
                'errors' => $errors,
            ]);

        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'success' => false,
                'message' => 'Error calculating salaries: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Approve salary for payment
     */
    public function approveSalary(Request $request, $id)
    {
        $salary = Salary::findOrFail($id);

        $salary->update([
            'status' => 'approved',
            'approved_by' => Auth::id(),
            'approved_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Salary approved for payment',
        ]);
    }

    /**
     * Process salary payment
     */
    public function processSalaryPayment(Request $request, $id)
    {
        $request->validate([
            'payment_method' => 'required|in:bank_transfer,cash,cheque',
            'payment_reference' => 'nullable|string|max:255',
            'payment_notes' => 'nullable|string|max:500',
        ]);

        $salary = Salary::findOrFail($id);

        if ($salary->status !== 'approved') {
            return response()->json([
                'success' => false,
                'message' => 'Salary must be approved before payment',
            ], 400);
        }

        $salary->update([
            'status' => 'paid',
            'payment_method' => $request->payment_method,
            'payment_reference' => $request->payment_reference,
            'payment_notes' => $request->payment_notes,
            'paid_by' => Auth::id(),
            'paid_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Salary payment processed successfully',
        ]);
    }

    /**
     * Get salary slip
     */
    public function getSalarySlip($id)
    {
        $salary = Salary::with(['employee.department'])->findOrFail($id);

        return Inertia::render('Salary/SalarySlip', [
            'salary' => $salary,
        ]);
    }

    /**
     * Bulk salary calculation
     */
    public function bulkCalculate(Request $request)
    {
        $request->validate([
            'month' => 'required|date_format:Y-m',
            'department_ids' => 'nullable|array',
            'department_ids.*' => 'exists:departments,id',
        ]);

        $month = Carbon::createFromFormat('Y-m', $request->month);

        $employeeQuery = Employee::where('status', 'active');

        if ($request->department_ids) {
            $employeeQuery->whereIn('department_id', $request->department_ids);
        }

        $employees = $employeeQuery->pluck('id')->toArray();

        return $this->calculateSalary(new Request([
            'month' => $request->month,
            'employee_ids' => $employees,
        ]));
    }

    /**
     * Calculate attendance metrics for salary calculation
     */
    private function calculateAttendanceMetrics($employeeId, $startDate, $endDate)
    {
        $totalWorkingDays = $startDate->diffInWeekdays($endDate) + 1;

        $attendance = Attendance::where('employee_id', $employeeId)
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        $presentDays = $attendance->where('status', 'present')->count();
        $halfDays = $attendance->where('status', 'half_day')->count();
        $lateDays = $attendance->where('is_late', true)->count();
        $totalHours = $attendance->sum('total_hours');

        // Calculate overtime hours (over 8 hours per day)
        $overtimeHours = $attendance->map(function ($record) {
            return max(0, $record->total_hours - 8);
        })->sum();

        // Adjust present days for half days (0.5 each)
        $adjustedPresentDays = $presentDays + ($halfDays * 0.5);
        $absentDays = $totalWorkingDays - $adjustedPresentDays;

        return [
            'total_working_days' => $totalWorkingDays,
            'present_days' => $adjustedPresentDays,
            'absent_days' => $absentDays,
            'late_days' => $lateDays,
            'half_days' => $halfDays,
            'total_hours' => $totalHours,
            'overtime_hours' => $overtimeHours,
            'attendance_percentage' => $totalWorkingDays > 0 ? ($adjustedPresentDays / $totalWorkingDays) * 100 : 0,
        ];
    }

    /**
     * Calculate salary components based on attendance
     */
    private function calculateSalaryComponents($employee, $attendanceData)
    {
        $basicSalary = $employee->basic_salary;

        // Calculate pro-rated salary based on attendance
        $attendancePercentage = $attendanceData['attendance_percentage'] / 100;
        $proRatedBasicSalary = $basicSalary * $attendancePercentage;

        // Allowances (usually fixed)
        $houseAllowance = $employee->house_allowance ?: ($basicSalary * 0.5); // 50% of basic
        $transportAllowance = $employee->transport_allowance ?: 5000; // Fixed amount
        $medicalAllowance = $employee->medical_allowance ?: 3000; // Fixed amount
        $otherAllowances = $employee->other_allowances ?: 0;

        // Overtime calculation (1.5x hourly rate)
        $dailyRate = $basicSalary / $attendanceData['total_working_days'];
        $hourlyRate = $dailyRate / 8;
        $overtimeAmount = $attendanceData['overtime_hours'] * ($hourlyRate * 1.5);

        // Bonus (performance-based, can be configured)
        $bonus = 0;
        if ($attendanceData['attendance_percentage'] >= 95) {
            $bonus = $basicSalary * 0.1; // 10% bonus for excellent attendance
        } elseif ($attendanceData['attendance_percentage'] >= 90) {
            $bonus = $basicSalary * 0.05; // 5% bonus for good attendance
        }

        // Calculate gross salary
        $grossSalary = $proRatedBasicSalary + $houseAllowance + $transportAllowance +
                      $medicalAllowance + $otherAllowances + $overtimeAmount + $bonus;

        // Deductions
        $taxDeduction = $this->calculateTaxDeduction($grossSalary);
        $providentFund = $basicSalary * 0.08; // 8% of basic salary
        $attendanceDeduction = ($basicSalary - $proRatedBasicSalary); // Deduction for absent days
        $otherDeductions = 0;

        // Late penalty (can be configured)
        if ($attendanceData['late_days'] > 3) {
            $otherDeductions += ($attendanceData['late_days'] - 3) * 200; // BDT 200 per late day after 3
        }

        $totalDeductions = $taxDeduction + $providentFund + $attendanceDeduction + $otherDeductions;
        $netSalary = $grossSalary - $totalDeductions;

        return [
            'house_allowance' => $houseAllowance,
            'transport_allowance' => $transportAllowance,
            'medical_allowance' => $medicalAllowance,
            'other_allowances' => $otherAllowances,
            'overtime_amount' => $overtimeAmount,
            'bonus' => $bonus,
            'gross_salary' => $grossSalary,
            'tax_deduction' => $taxDeduction,
            'provident_fund' => $providentFund,
            'other_deductions' => $otherDeductions,
            'attendance_deduction' => $attendanceDeduction,
            'total_deductions' => $totalDeductions,
            'net_salary' => max(0, $netSalary), // Ensure non-negative
        ];
    }

    /**
     * Calculate tax deduction based on salary
     */
    private function calculateTaxDeduction($grossSalary)
    {
        $annualSalary = $grossSalary * 12;
        $taxableIncome = max(0, $annualSalary - 300000); // Tax-free limit BDT 3,00,000

        $tax = 0;

        // Progressive tax calculation (Bangladesh tax slabs)
        if ($taxableIncome > 0) {
            if ($taxableIncome <= 400000) {
                $tax = $taxableIncome * 0.05; // 5%
            } elseif ($taxableIncome <= 700000) {
                $tax = 20000 + (($taxableIncome - 400000) * 0.10); // 10%
            } elseif ($taxableIncome <= 1100000) {
                $tax = 50000 + (($taxableIncome - 700000) * 0.15); // 15%
            } elseif ($taxableIncome <= 1600000) {
                $tax = 110000 + (($taxableIncome - 1100000) * 0.20); // 20%
            } else {
                $tax = 210000 + (($taxableIncome - 1600000) * 0.25); // 25%
            }
        }

        return $tax / 12; // Monthly tax deduction
    }
}
