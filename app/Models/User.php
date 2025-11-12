<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get gifts created by user
     */
    public function gifts()
    {
        return $this->hasMany(Gift::class);
    }

    /**
     * Get gift registries created by user
     */
    public function registries()
    {
        return $this->hasMany(GiftRegistry::class);
    }

    /**
     * Get registry purchases made by user
     */
    public function registryPurchases()
    {
        return $this->hasMany(GiftRegistryPurchase::class, 'purchaser_user_id');
    }
}
