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
        Schema::create('gift_registries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('registry_code')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['wedding', 'holiday', 'corporate', 'birthday', 'anniversary', 'other'])->default('other');
            $table->string('event_name');
            $table->date('event_date')->nullable();
            $table->string('registry_owner_name');
            $table->string('co_owner_name')->nullable();
            $table->string('contact_email');
            $table->string('contact_phone')->nullable();
            $table->json('shipping_address')->nullable();
            $table->boolean('is_public')->default(true);
            $table->boolean('is_active')->default(true);
            $table->boolean('allow_custom_amounts')->default(true);
            $table->boolean('show_purchased_items')->default(false);
            $table->decimal('target_amount', 10, 2)->nullable();
            $table->decimal('received_amount', 10, 2)->default(0);
            $table->text('thank_you_message')->nullable();
            $table->date('registry_start_date')->nullable();
            $table->date('registry_end_date')->nullable();
            $table->enum('status', ['draft', 'active', 'completed', 'cancelled'])->default('draft');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['registry_code', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gift_registries');
    }
};
