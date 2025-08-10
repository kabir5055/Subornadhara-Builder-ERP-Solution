<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceDevice extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'serial', 'api_key', 'ip', 'timezone', 'active', 'last_seen'
    ];

    protected $casts = [
        'active' => 'boolean',
        'last_seen' => 'datetime',
    ];
}
