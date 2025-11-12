<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'type',
        'roast_level',
        'origin',
        'price',
        'size',
        'stock_quantity',
        'image_url',
        'is_active',
        'available_for_gifting',
        'flavor_notes',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock_quantity' => 'integer',
        'is_active' => 'boolean',
        'available_for_gifting' => 'boolean',
        'flavor_notes' => 'array',
    ];

    /**
     * Get gift items for this product
     */
    public function giftItems()
    {
        return $this->hasMany(GiftItem::class);
    }

    /**
     * Get registry items for this product
     */
    public function registryItems()
    {
        return $this->hasMany(GiftRegistryItem::class);
    }

    /**
     * Scope for active products
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for products available for gifting
     */
    public function scopeAvailableForGifting($query)
    {
        return $query->where('available_for_gifting', true)->where('is_active', true);
    }

    /**
     * Check if product is in stock
     */
    public function isInStock($quantity = 1)
    {
        return $this->stock_quantity >= $quantity;
    }

    /**
     * Reduce stock quantity
     */
    public function reduceStock($quantity)
    {
        if ($this->isInStock($quantity)) {
            $this->decrement('stock_quantity', $quantity);
            return true;
        }
        return false;
    }
}
