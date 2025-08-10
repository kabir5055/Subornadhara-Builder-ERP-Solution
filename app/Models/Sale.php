<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'project_id',
        'unit_number',
        'unit_type',
        'unit_size',
        'price_per_sqft',
        'total_price',
        'booking_money',
        'paid_amount',
        'due_amount',
        'payment_status',
        'booking_date',
        'handover_date',
        'status',
        'notes'
    ];

    protected $casts = [
        'unit_size' => 'decimal:2',
        'price_per_sqft' => 'decimal:2',
        'total_price' => 'decimal:2',
        'booking_money' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'due_amount' => 'decimal:2',
        'booking_date' => 'date',
        'handover_date' => 'date'
    ];

    /**
     * Get the client that owns the sale.
     */
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Get the project that owns the sale.
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the payments for the sale.
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Scope for filtering by payment status
     */
    public function scopeByPaymentStatus($query, $status)
    {
        return $query->where('payment_status', $status);
    }

    /**
     * Scope for filtering by sale status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
