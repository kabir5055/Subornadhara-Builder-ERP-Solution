<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'employee_id', 'name', 'email', 'phone', 'nid_number', 'address',
    'department_id', 'department', 'designation', 'date_of_birth', 'gender', 'marital_status',
        'join_date', 'salary', 'employment_type', 'status', 'bank_account',
        'emergency_contact', 'skills', 'profile_image', 'user_id'
    ];

    protected $casts = [
        'join_date' => 'date',
        'date_of_birth' => 'date',
        'salary' => 'decimal:2',
    ];

    protected $appends = [];

    /**
     * Get the user associated with the employee
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the department that owns the employee
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get all attendance records for the employee
     */
    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Get all salary records for the employee
     */
    public function salaries(): HasMany
    {
        return $this->hasMany(Salary::class);
    }

    /**
     * Get current month attendance
     */
    public function currentMonthAttendance(): HasMany
    {
        return $this->hasMany(Attendance::class)
                   ->whereYear('date', Carbon::now()->year)
                   ->whereMonth('date', Carbon::now()->month);
    }

    /**
     * Get today's attendance
     */
    public function todayAttendance()
    {
        return $this->attendances()->whereDate('date', Carbon::today())->first();
    }

    /**
     * Get current month salary
     */
    /**
     * Get employee tenure in years
     */
    public function getTenureYearsAttribute()
    {
        // Ensure we handle both Carbon instances (from casts) and raw strings safely
        if (empty($this->join_date)) {
            return 0;
        }

        $raw = $this->getAttribute('join_date');
        if ($raw instanceof \DateTimeInterface) {
            $joinDate = Carbon::instance($raw);
        } else {
            $joinDate = Carbon::parse((string) $raw);
        }
        return Carbon::now()->diffInYears($joinDate);
    }

    /**
     * Get current month attendance summary
     */
    public function getCurrentMonthAttendanceAttribute()
    {
        $currentMonth = $this->currentMonthAttendance;
        $totalDays = $currentMonth->count();
        $presentDays = $currentMonth->where('status', 'present')->count();
        $lateDays = $currentMonth->where('is_late', true)->count();

        return [
            'total_days' => $totalDays,
            'present_days' => $presentDays,
            'absent_days' => $totalDays - $presentDays,
            'late_days' => $lateDays,
            'percentage' => $totalDays > 0 ? round(($presentDays / $totalDays) * 100, 1) : 0,
        ];
    }

    /**
     * Scope for active employees
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for specific department
     */
    public function scopeByDepartment($query, $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }

    /**
     * Check if employee is present today
     */
    public function isPresentToday()
    {
        $today = $this->todayAttendance();
        return $today && $today->status === 'present';
    }

    /**
     * Check if employee is late today
     */
    public function isLateToday()
    {
        $today = $this->todayAttendance();
        return $today && $today->is_late;
    }

    /**
     * Get employee's monthly attendance percentage
     */
    public function getMonthlyAttendancePercentage($year = null, $month = null)
    {
        $year = $year ?: Carbon::now()->year;
        $month = $month ?: Carbon::now()->month;

        $totalWorkingDays = Carbon::create($year, $month, 1)->diffInWeekdays(Carbon::create($year, $month, 1)->endOfMonth()) + 1;

        $presentDays = $this->attendances()
                           ->whereYear('date', $year)
                           ->whereMonth('date', $month)
                           ->where('status', 'present')
                           ->count();

        return $totalWorkingDays > 0 ? round(($presentDays / $totalWorkingDays) * 100, 1) : 0;
    }

    /**
     * Calculate monthly salary based on attendance
     */
    // Salary calculation moved to Salary model/service; Employee stores single 'salary'.
}
