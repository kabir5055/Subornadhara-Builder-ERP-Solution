<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\URL;

class ProjectImage extends Model
{
    use HasFactory;

    protected $fillable = ['project_id','path','caption','position'];

    protected $appends = ['url'];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function getUrlAttribute(): string
    {
        // Assume files are stored under storage/app/public and linked to public/storage
        $path = ltrim($this->path, '/');
        return asset('storage/'.$path);
    }
}
