<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'code', 'description', 'location', 'total_area',
        'total_units', 'sold_units', 'price_per_sqft', 'status',
        'progress_percentage', 'start_date', 'expected_completion',
        'project_image'
    ];

    protected $casts = [
        'start_date' => 'date',
        'expected_completion' => 'date',
        'total_area' => 'decimal:2',
        'price_per_sqft' => 'decimal:2',
    ];

    public function units(): HasMany
    {
        return $this->hasMany(Unit::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProjectImage::class)->orderBy('position');
    }

    public function financeTransactions(): HasMany
    {
        return $this->hasMany(FinanceTransaction::class);
    }

    // Accessors
    public function getAvailableUnitsAttribute(): int
    {
        return $this->total_units - $this->sold_units;
    }

    public function getTotalValueAttribute(): float
    {
        return $this->total_area * $this->price_per_sqft;
    }

    public function getOccupancyRateAttribute(): float
    {
        return $this->total_units > 0 ?
            round(($this->sold_units / $this->total_units) * 100, 2) : 0;
    }

    public function getTotalRevenueAttribute(): float
    {
        return $this->bookings->sum('total_amount');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->whereIn('status', ['planning', 'ongoing']);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    // Frontend alias: treat end_date as expected_completion
    public function getEndDateAttribute()
    {
        return $this->expected_completion;
    }

    public function setEndDateAttribute($value): void
    {
        $this->attributes['expected_completion'] = $value;
    }
}
