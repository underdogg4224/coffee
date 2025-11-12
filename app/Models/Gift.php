<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Gift extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'gift_code',
        'recipient_name',
        'recipient_email',
        'recipient_phone',
        'personalized_message',
        'occasion',
        'total_amount',
        'scheduled_delivery_date',
        'delivery_time_preference',
        'status',
        'shipping_address',
        'packaging_type',
        'include_greeting_card',
        'greeting_card_design',
        'is_surprise',
        'paid_at',
        'shipped_at',
        'delivered_at',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'scheduled_delivery_date' => 'date',
        'shipping_address' => 'array',
        'include_greeting_card' => 'boolean',
        'is_surprise' => 'boolean',
        'paid_at' => 'datetime',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    /**
     * Boot method to generate gift code
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($gift) {
            if (empty($gift->gift_code)) {
                $gift->gift_code = 'GIFT-' . strtoupper(Str::random(10));
            }
        });
    }

    /**
     * Get the user who created the gift
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all items in this gift
     */
    public function items()
    {
        return $this->hasMany(GiftItem::class);
    }

    /**
     * Calculate total amount based on items
     */
    public function calculateTotal()
    {
        $this->total_amount = $this->items()->sum('subtotal');
        $this->save();
        return $this->total_amount;
    }

    /**
     * Mark gift as paid
     */
    public function markAsPaid()
    {
        $this->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);
    }

    /**
     * Mark gift as shipped
     */
    public function markAsShipped()
    {
        $this->update([
            'status' => 'shipped',
            'shipped_at' => now(),
        ]);
    }

    /**
     * Mark gift as delivered
     */
    public function markAsDelivered()
    {
        $this->update([
            'status' => 'delivered',
            'delivered_at' => now(),
        ]);
    }

    /**
     * Scope for gifts by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope for scheduled deliveries
     */
    public function scopeScheduledFor($query, $date)
    {
        return $query->whereDate('scheduled_delivery_date', $date);
    }
}
