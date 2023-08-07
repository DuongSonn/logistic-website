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
        Schema::create('orders', function (Blueprint $table) {
            $table->string('id')->index();
            $table->string('customer_id');
            $table->integer('total_price');
            $table->enum('status', ['pending', 'delivering', 'completed', 'canceled'])->default('pending');
            $table->timestamps();
            $table->integer('shipping_date');
            $table->integer('delivery_date');
            $table->text('shipping_address');
            $table->text('delivery_address');
            $table->increments('number_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
