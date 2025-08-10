<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'date',
        'check_in',
        'check_out',
        'status',
        'notes',
        'total_hours',
        'is_late',
        'location',
        'marked_by',
    ];

    protected $casts = [
    'date' => 'datetime',
    'check_in' => 'datetime',
    'check_out' => 'datetime',
    'total_hours' => 'float',
    'is_late' => 'boolean',
    ];

    protected $appends = [
        'check_in_time',
        'check_out_time',
        'duration_text',
        'status_color',
        'is_today',
    ];

    /**
     * Get the employee that owns the attendance record
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get check-in time in H:i format
     */
    public function getCheckInTimeAttribute()
    {
        return $this->check_in ? $this->check_in->format('H:i') : null;
    }

    /**
     * Get check-out time in H:i format
     */
    public function getCheckOutTimeAttribute()
    {
        return $this->check_out ? $this->check_out->format('H:i') : null;
    }

    /**
     * Get human readable duration
     */
    public function getDurationTextAttribute()
    {
        if ($this->total_hours) {
            $hours = floor($this->total_hours);
            $minutes = round(($this->total_hours - $hours) * 60);
            return "{$hours}h {$minutes}m";
        }
        return null;
    }

    /**
     * Get status color for UI
     */
    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'present' => 'green',
            'absent' => 'red',
            'half_day' => 'orange',
            'sick_leave' => 'blue',
            'casual_leave' => 'purple',
            default => 'gray'
        };
    }

    /**
     * Check if attendance is for today
     */
    public function getIsTodayAttribute()
    {
    return $this->date ? $this->date->isToday() : false;
    }

    /**
     * Scope for current month attendance
     */
    public function scopeCurrentMonth($query)
    {
        return $query->whereYear('date', Carbon::now()->year)
                    ->whereMonth('date', Carbon::now()->month);
    }

    /**
     * Scope for present employees
     */
    public function scopePresent($query)
    {
        return $query->where('status', 'present');
    }

    /**
     * Scope for absent employees
     */
    public function scopeAbsent($query)
    {
        return $query->where('status', 'absent');
    }

    /**
     * Check if employee is late (based on 9 AM standard)
     */
    public function getIsLateAttribute()
    {
        if ($this->status === 'present' && $this->check_in) {
            return $this->check_in->format('H:i') > '09:00';
        }
        return false;
    }

    /**
     * Calculate working hours if both check_in and check_out exist
     */
    public function calculateWorkingHours()
    {
        if ($this->check_in && $this->check_out) {
            $diffInMinutes = $this->check_in->diffInMinutes($this->check_out);
            return round($diffInMinutes / 60, 2); // Return as decimal hours
        }
        return 0;
    }

    /**
     * Scope for today's attendance
     */
    public function scopeToday($query)
    {
        return $query->whereDate('date', Carbon::today());
    }
}
