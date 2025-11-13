<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('gifts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('gift_code')->unique();
            $table->string('recipient_name');
            $table->string('recipient_email');
            $table->string('recipient_phone')->nullable();
            $table->text('personalized_message')->nullable();
            $table->string('occasion')->nullable(); // birthday, wedding, holiday, corporate, etc.
            $table->decimal('total_amount', 10, 2);
            $table->date('scheduled_delivery_date')->nullable();
            $table->enum('delivery_time_preference', ['morning', 'afternoon', 'evening', 'anytime'])->default('anytime');
            $table->enum('status', ['draft', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'])->default('draft');
            $table->json('shipping_address')->nullable();
            $table->string('packaging_type')->default('standard'); // standard, premium, luxury
            $table->boolean('include_greeting_card')->default(false);
            $table->string('greeting_card_design')->nullable();
            $table->boolean('is_surprise')->default(false);
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gifts');
    }
};
