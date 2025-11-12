<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GiftItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'gift_id',
        'product_id',
        'quantity',
        'unit_price',
        'subtotal',
        'custom_notes',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    /**
     * Boot method to calculate subtotal
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($item) {
            $item->subtotal = $item->quantity * $item->unit_price;
        });
    }

    /**
     * Get the gift this item belongs to
     */
    public function gift()
    {
        return $this->belongsTo(Gift::class);
    }

    /**
     * Get the product
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
