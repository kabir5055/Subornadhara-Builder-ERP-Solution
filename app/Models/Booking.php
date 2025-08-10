<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    protected $fillable = [
        'project_id', 'client_id', 'unit_number', 'unit_size', 'unit_price',
        'total_amount', 'paid_amount', 'due_amount', 'booking_date',
        'payment_status', 'booking_status', 'terms_conditions', 'notes'
    ];

    protected $casts = [
        'booking_date' => 'date',
        'unit_size' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'due_amount' => 'decimal:2',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }
}
