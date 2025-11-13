<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class GiftRegistry extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'registry_code',
        'title',
        'description',
        'type',
        'event_name',
        'event_date',
        'registry_owner_name',
        'co_owner_name',
        'contact_email',
        'contact_phone',
        'shipping_address',
        'is_public',
        'is_active',
        'allow_custom_amounts',
        'show_purchased_items',
        'target_amount',
        'received_amount',
        'thank_you_message',
        'registry_start_date',
        'registry_end_date',
        'status',
    ];

    protected $casts = [
        'event_date' => 'date',
        'shipping_address' => 'array',
        'is_public' => 'boolean',
        'is_active' => 'boolean',
        'allow_custom_amounts' => 'boolean',
        'show_purchased_items' => 'boolean',
        'target_amount' => 'decimal:2',
        'received_amount' => 'decimal:2',
        'registry_start_date' => 'date',
        'registry_end_date' => 'date',
    ];

    /**
     * Boot method to generate registry code
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($registry) {
            if (empty($registry->registry_code)) {
                $registry->registry_code = 'REG-' . strtoupper(Str::random(10));
            }
        });
    }

    /**
     * Get the user who created the registry
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all items in this registry
     */
    public function items()
    {
        return $this->hasMany(GiftRegistryItem::class);
    }

    /**
     * Get all purchases for this registry
     */
    public function purchases()
    {
        return $this->hasMany(GiftRegistryPurchase::class);
    }

    /**
     * Get curated items
     */
    public function curatedItems()
    {
        return $this->items()->where('is_curated', true);
    }

    /**
     * Update received amount
     */
    public function updateReceivedAmount()
    {
        $this->received_amount = $this->purchases()
            ->where('status', 'completed')
            ->sum('amount');
        $this->save();
        return $this->received_amount;
    }

    /**
     * Get completion percentage
     */
    public function getCompletionPercentageAttribute()
    {
        if (!$this->target_amount || $this->target_amount == 0) {
            return 0;
        }
        return min(100, round(($this->received_amount / $this->target_amount) * 100, 2));
    }

    /**
     * Check if registry is expired
     */
    public function isExpired()
    {
        if ($this->registry_end_date) {
            return $this->registry_end_date < now();
        }
        return false;
    }

    /**
     * Scope for active registries
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->where('status', 'active');
    }

    /**
     * Scope for public registries
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    /**
     * Scope by registry code
     */
    public function scopeByCode($query, $code)
    {
        return $query->where('registry_code', $code);
    }
}
