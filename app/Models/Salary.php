<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Salary extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'month',
        'basic_salary',
        'house_allowance',
        'transport_allowance',
        'medical_allowance',
        'other_allowances',
        'overtime_amount',
        'bonus',
        'gross_salary',
        'tax_deduction',
        'provident_fund',
        'other_deductions',
        'attendance_deduction',
        'total_deductions',
        'net_salary',
        'working_days',
        'present_days',
        'absent_days',
        'late_days',
        'overtime_hours',
        'total_hours',
        'attendance_percentage',
        'status',
        'payment_method',
        'payment_reference',
        'payment_notes',
        'calculated_by',
        'calculated_at',
        'approved_by',
        'approved_at',
        'paid_by',
        'paid_at',
    ];

    protected $casts = [
        'month' => 'datetime',
        'basic_salary' => 'decimal:2',
        'house_allowance' => 'decimal:2',
        'transport_allowance' => 'decimal:2',
        'medical_allowance' => 'decimal:2',
        'other_allowances' => 'decimal:2',
        'overtime_amount' => 'decimal:2',
        'bonus' => 'decimal:2',
        'gross_salary' => 'decimal:2',
        'tax_deduction' => 'decimal:2',
        'provident_fund' => 'decimal:2',
        'other_deductions' => 'decimal:2',
        'attendance_deduction' => 'decimal:2',
        'total_deductions' => 'decimal:2',
        'net_salary' => 'decimal:2',
        'present_days' => 'decimal:1',
        'absent_days' => 'decimal:1',
        'overtime_hours' => 'decimal:2',
        'total_hours' => 'decimal:2',
        'attendance_percentage' => 'decimal:1',
        'calculated_at' => 'datetime',
        'approved_at' => 'datetime',
        'paid_at' => 'datetime',
    ];

    protected $appends = [
        'month_year',
        'status_color',
        'total_earnings',
    ];

    /**
     * Get the employee that owns the salary
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the user who calculated the salary
     */
    public function calculatedBy()
    {
        return $this->belongsTo(User::class, 'calculated_by');
    }

    /**
     * Get the user who approved the salary
     */
    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get the user who paid the salary
     */
    public function paidBy()
    {
        return $this->belongsTo(User::class, 'paid_by');
    }

    /**
     * Get month and year formatted
     */
    public function getMonthYearAttribute()
    {
        return $this->month ? $this->month->format('F Y') : null;
    }

    /**
     * Get status color for UI
     */
    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'calculated' => 'blue',
            'approved' => 'yellow',
            'paid' => 'green',
            'cancelled' => 'red',
            default => 'gray'
        };
    }

    /**
     * Get total earnings (gross - deductions)
     */
    public function getTotalEarningsAttribute()
    {
        return $this->gross_salary - $this->total_deductions;
    }

    /**
     * Scope for specific month and year
     */
    public function scopeForMonth($query, $year, $month)
    {
        return $query->whereYear('month', $year)
                    ->whereMonth('month', $month);
    }

    /**
     * Scope for current month
     */
    public function scopeCurrentMonth($query)
    {
        $now = Carbon::now();
        return $query->whereYear('month', $now->year)
                    ->whereMonth('month', $now->month);
    }

    /**
     * Scope for paid salaries
     */
    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    /**
     * Scope for pending approval
     */
    public function scopePendingApproval($query)
    {
        return $query->where('status', 'calculated');
    }

    /**
     * Scope for approved but not paid
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Calculate effective working days
     */
    public function getEffectiveWorkingDays()
    {
        return $this->present_days;
    }

    /**
     * Get attendance efficiency percentage
     */
    public function getAttendanceEfficiency()
    {
        return $this->attendance_percentage;
    }

    /**
     * Check if salary can be approved
     */
    public function canBeApproved()
    {
        return $this->status === 'calculated';
    }

    /**
     * Check if salary can be paid
     */
    public function canBePaid()
    {
        return $this->status === 'approved';
    }

    /**
     * Format currency amount
     */
    public function formatCurrency($amount)
    {
        return number_format($amount, 2) . ' BDT';
    }

    /**
     * Get formatted net salary
     */
    public function getFormattedNetSalary()
    {
        return $this->formatCurrency($this->net_salary);
    }

    /**
     * Get formatted gross salary
     */
    public function getFormattedGrossSalary()
    {
        return $this->formatCurrency($this->gross_salary);
    }
}
