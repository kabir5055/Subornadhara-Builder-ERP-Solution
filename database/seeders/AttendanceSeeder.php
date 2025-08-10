<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class AttendanceSeeder extends Seeder
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

        // Generate attendance records for the last 30 days
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();

    for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
            // Skip weekends (Friday and Saturday in Bangladesh)
            if ($date->isFriday() || $date->isSaturday()) {
                // Create weekend records using allowed status and columns
                foreach ($employees as $employee) {
                    Attendance::updateOrCreate(
                        [
                            'employee_id' => $employee->id,
                            'date' => $date->toDateString(),
                        ],
                        [
                            'check_in' => null,
                            'check_out' => null,
                            'total_hours' => 0,
                            'is_late' => false,
                            'status' => 'absent', // mark weekend via notes
                            'notes' => 'Weekend holiday',
                            'created_at' => $date,
                            'updated_at' => $date,
                        ]
                    );
                }
                continue;
            }

            foreach ($employees as $employee) {
                // 90% attendance rate
                if (rand(1, 100) <= 90) {
                    $checkInTime = $date->copy()->setTime(9, rand(0, 30), 0); // 9:00-9:30 AM
                    $workingHours = rand(7, 10); // 7-10 hours
                    $checkOutTime = $checkInTime->copy()->addHours($workingHours)->addMinutes(rand(0, 59));

                    // Determine status
                    $status = 'present';
                    $isLate = ($checkInTime->hour > 9 || ($checkInTime->hour == 9 && $checkInTime->minute > 15));

                    // Random half day
                    if (rand(1, 100) <= 5) { // 5% chance of half day
                        $checkOutTime = $checkInTime->copy()->addHours(rand(3, 4));
                        $status = 'half_day';
                    }

                    $minutes = $checkInTime->diffInMinutes($checkOutTime);
                    $totalHours = round($minutes / 60, 2);

                    Attendance::updateOrCreate(
                        [
                            'employee_id' => $employee->id,
                            'date' => $date->toDateString(),
                        ],
                        [
                            'check_in' => $checkInTime->toDateTimeString(),
                            'check_out' => $checkOutTime->toDateTimeString(),
                            'total_hours' => $totalHours,
                            'is_late' => $isLate,
                            'status' => $status,
                            'notes' => $isLate ? 'Late arrival' : ($status === 'half_day' ? 'Left early - half day' : 'Regular attendance'),
                            'created_at' => $date,
                            'updated_at' => $date,
                        ]
                    );
                } else {
                    // Absent days
                    Attendance::updateOrCreate(
                        [
                            'employee_id' => $employee->id,
                            'date' => $date->toDateString(),
                        ],
                        [
                            'check_in' => null,
                            'check_out' => null,
                            'total_hours' => 0,
                            'is_late' => false,
                            'status' => 'absent',
                            'notes' => 'Employee absent',
                            'created_at' => $date,
                            'updated_at' => $date,
                        ]
                    );
                }
            }
        }

        $this->command->info('Attendance records seeded successfully!');
    }
}
