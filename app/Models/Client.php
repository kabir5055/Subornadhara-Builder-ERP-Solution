<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'email', 'phone', 'nid_number', 'address', 'type',
        'occupation', 'annual_income', 'emergency_contact', 'reference_by',
        'notes', 'profile_photo', 'status'
    ];

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function followUps(): HasMany
    {
        return $this->hasMany(FollowUp::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function getTotalBookingsAttribute(): int
    {
        return $this->bookings->count();
    }

    public function getTotalInvestmentAttribute(): float
    {
        return $this->bookings->sum('total_amount');
    }
}
