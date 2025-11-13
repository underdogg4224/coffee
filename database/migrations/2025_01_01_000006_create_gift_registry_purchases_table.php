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
        Schema::create('gift_registry_purchases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gift_registry_id')->constrained()->onDelete('cascade');
            $table->foreignId('gift_registry_item_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('purchaser_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('purchaser_name');
            $table->string('purchaser_email');
            $table->integer('quantity')->default(1);
            $table->decimal('amount', 10, 2);
            $table->text('message_to_recipient')->nullable();
            $table->string('transaction_id')->nullable();
            $table->enum('status', ['pending', 'completed', 'refunded', 'cancelled'])->default('pending');
            $table->boolean('is_anonymous')->default(false);
            $table->timestamp('purchased_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gift_registry_purchases');
    }
};
