<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GiftRegistryPurchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'gift_registry_id',
        'gift_registry_item_id',
        'purchaser_user_id',
        'purchaser_name',
        'purchaser_email',
        'quantity',
        'amount',
        'message_to_recipient',
        'transaction_id',
        'status',
        'is_anonymous',
        'purchased_at',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'amount' => 'decimal:2',
        'is_anonymous' => 'boolean',
        'purchased_at' => 'datetime',
    ];

    /**
     * Get the registry this purchase belongs to
     */
    public function registry()
    {
        return $this->belongsTo(GiftRegistry::class, 'gift_registry_id');
    }

    /**
     * Get the registry item
     */
    public function registryItem()
    {
        return $this->belongsTo(GiftRegistryItem::class, 'gift_registry_item_id');
    }

    /**
     * Get the purchaser user
     */
    public function purchaser()
    {
        return $this->belongsTo(User::class, 'purchaser_user_id');
    }

    /**
     * Mark as completed
     */
    public function markAsCompleted()
    {
        $this->update([
            'status' => 'completed',
            'purchased_at' => now(),
        ]);

        // Update registry item quantity
        if ($this->registryItem) {
            $this->registryItem->incrementPurchased($this->quantity);
        }

        // Update registry received amount
        if ($this->registry) {
            $this->registry->updateReceivedAmount();
        }
    }

    /**
     * Scope for completed purchases
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }
}
