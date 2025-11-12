<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GiftRegistryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'gift_registry_id',
        'product_id',
        'item_name',
        'item_description',
        'item_price',
        'quantity_requested',
        'quantity_purchased',
        'priority',
        'is_curated',
        'allow_partial',
        'notes',
    ];

    protected $casts = [
        'item_price' => 'decimal:2',
        'quantity_requested' => 'integer',
        'quantity_purchased' => 'integer',
        'priority' => 'integer',
        'is_curated' => 'boolean',
        'allow_partial' => 'boolean',
    ];

    /**
     * Get the registry this item belongs to
     */
    public function registry()
    {
        return $this->belongsTo(GiftRegistry::class, 'gift_registry_id');
    }

    /**
     * Get the product
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get purchases for this item
     */
    public function purchases()
    {
        return $this->hasMany(GiftRegistryPurchase::class);
    }

    /**
     * Get remaining quantity needed
     */
    public function getRemainingQuantityAttribute()
    {
        return max(0, $this->quantity_requested - $this->quantity_purchased);
    }

    /**
     * Check if item is fully purchased
     */
    public function isFullyPurchased()
    {
        return $this->quantity_purchased >= $this->quantity_requested;
    }

    /**
     * Get fulfillment percentage
     */
    public function getFulfillmentPercentageAttribute()
    {
        if ($this->quantity_requested == 0) {
            return 0;
        }
        return min(100, round(($this->quantity_purchased / $this->quantity_requested) * 100, 2));
    }

    /**
     * Increment purchased quantity
     */
    public function incrementPurchased($quantity)
    {
        $this->increment('quantity_purchased', $quantity);
    }
}
