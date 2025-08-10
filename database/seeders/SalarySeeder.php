<?php

namespace Database\Seeders;

use App\Models\Salary;
use App\Models\Employee;
use App\Models\Attendance;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class SalarySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = Employee::where('status', 'active')->get();

        if ($employees->isEmpty()) {
            $this->command->warn('No active employees found. Please run EmployeeSeeder first.');
            return;
        }

        // Generate salary records for the last 3 months
        for ($i = 1; $i <= 3; $i++) {
            $salaryMonth = Carbon::now()->subMonths($i)->startOfMonth();
            $monthStart = $salaryMonth->copy();
            $monthEnd = $salaryMonth->copy()->endOfMonth();

            foreach ($employees as $employee) {
                // Get attendance data for the month
                $attendanceData = Attendance::where('employee_id', $employee->id)
                    ->whereBetween('date', [$monthStart->format('Y-m-d'), $monthEnd->format('Y-m-d')])
                    ->selectRaw('
                        COUNT(*) as total_days,
                        SUM(CASE WHEN status = "present" OR status = "late" OR status = "half_day" THEN 1 ELSE 0 END) as present_days,
                        SUM(CASE WHEN status = "absent" THEN 1 ELSE 0 END) as absent_days,
                        SUM(CASE WHEN status = "late" THEN 1 ELSE 0 END) as late_days,
                        COALESCE(SUM(working_hours), 0) as total_working_hours
                    ')
                    ->first();

                $baseSalary = $employee->salary;
                $presentDays = $attendanceData->present_days ?? 0;
                $totalWorkingDays = $salaryMonth->daysInMonth - 8; // Minus Fridays & Saturdays

                // Calculate salary components
                $dailySalary = $baseSalary / $totalWorkingDays;
                $earnedSalary = $dailySalary * $presentDays;

                // Allowances (House rent 40%, Medical 10%, Transport fixed 3000)
                $houseRent = $baseSalary * 0.40;
                $medicalAllowance = $baseSalary * 0.10;
                $transportAllowance = 3000;
                $totalAllowances = $houseRent + $medicalAllowance + $transportAllowance;

                // Overtime calculation (assume 1.5x hourly rate for extra hours beyond 8 per day)
                $regularHours = $presentDays * 8;
                $overtimeHours = max(0, ($attendanceData->total_working_hours ?? 0) - $regularHours);
                $hourlyRate = $baseSalary / ($totalWorkingDays * 8);
                $overtimePay = $overtimeHours * $hourlyRate * 1.5;

                // Deductions
                $absentDeduction = $dailySalary * ($attendanceData->absent_days ?? 0);
                $lateDeduction = ($attendanceData->late_days ?? 0) * 200; // 200 per late day
                $providentFund = $baseSalary * 0.08; // 8% PF deduction
                $totalDeductions = $absentDeduction + $lateDeduction + $providentFund;

                // Bonus (random small amount)
                $bonus = rand(0, 1) ? rand(1000, 5000) : 0;

                // Total salary calculation
                $totalSalary = $earnedSalary + $totalAllowances + $overtimePay + $bonus - $totalDeductions;

                Salary::create([
                    'employee_id' => $employee->id,
                    'month_year' => $salaryMonth->format('Y-m'),
                    'basic_salary' => round($earnedSalary, 2),
                    'allowances' => round($totalAllowances, 2),
                    'overtime_amount' => round($overtimePay, 2),
                    'bonus' => round($bonus, 2),
                    'deductions' => round($totalDeductions, 2),
                    'total_salary' => round($totalSalary, 2),
                    'payment_date' => $monthEnd->copy()->addDays(rand(1, 5)), // Paid 1-5 days after month end
                    'status' => rand(1, 10) <= 9 ? 'paid' : 'pending', // 90% paid
                    'notes' => 'Salary for ' . $salaryMonth->format('F Y') . ' - ' . $presentDays . '/' . $totalWorkingDays . ' days worked',
                    'created_at' => $monthEnd,
                    'updated_at' => $monthEnd,
                ]);
            }
        }

        $this->command->info('Salary records seeded successfully!');
    }
}
