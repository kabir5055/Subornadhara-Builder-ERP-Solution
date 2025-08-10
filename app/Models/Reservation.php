<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'unit_id', 'project_id', 'client_id', 'reserved_at', 'expires_at', 'status', 'notes'
    ];

    protected $casts = [
        'reserved_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function unit(): BelongsTo { return $this->belongsTo(Unit::class); }
    public function project(): BelongsTo { return $this->belongsTo(Project::class); }
    public function client(): BelongsTo { return $this->belongsTo(Client::class); }
}
