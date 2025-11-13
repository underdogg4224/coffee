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
        Schema::create('gift_registry_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gift_registry_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->nullable()->constrained()->onDelete('set null');
            $table->string('item_name');
            $table->text('item_description')->nullable();
            $table->decimal('item_price', 10, 2)->nullable();
            $table->integer('quantity_requested')->default(1);
            $table->integer('quantity_purchased')->default(0);
            $table->integer('priority')->default(1); // 1 = high, 2 = medium, 3 = low
            $table->boolean('is_curated')->default(false); // true if pre-selected by registry owner
            $table->boolean('allow_partial')->default(true); // allow partial quantity fulfillment
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gift_registry_items');
    }
};
