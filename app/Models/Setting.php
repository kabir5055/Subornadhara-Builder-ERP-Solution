<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'key', 'value', 'type', 'group', 'description'
    ];

    public $timestamps = true;

    /**
     * Get a setting value by key with optional default.
     */
    public static function getValue(string $key, $default = null)
    {
        $record = static::query()->where('key', $key)->first();
        if (!$record) return $default;
        // Basic casting based on stored type
        return match ($record->type) {
            'boolean' => filter_var($record->value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $record->value,
            'json' => json_decode($record->value, true),
            default => $record->value,
        };
    }

    /**
     * Create or update a setting value.
     */
    public static function setValue(string $key, $value, string $type = 'string', string $group = 'general', ?string $description = null): static
    {
        $storeValue = $type === 'json' ? json_encode($value) : (string) $value;
        return static::query()->updateOrCreate(
            ['key' => $key],
            [
                'value' => $storeValue,
                'type' => $type,
                'group' => $group,
                'description' => $description,
            ]
        );
    }
}
