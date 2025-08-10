<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    protected $fillable = [
        'name', 'code', 'description', 'category', 'unit',
        'current_stock', 'minimum_stock', 'unit_price', 'total_value',
        'supplier_id', 'status', 'location'
    ];

    protected $casts = [
        'current_stock' => 'integer',
        'minimum_stock' => 'integer',
        'unit_price' => 'decimal:2',
        'total_value' => 'decimal:2',
    ];

    // Frontend alias: sku maps to 'code'
    protected $appends = ['sku'];

    public function getSkuAttribute()
    {
        return $this->code;
    }

    public function setSkuAttribute($value): void
    {
        $this->attributes['code'] = $value;
    }
}
