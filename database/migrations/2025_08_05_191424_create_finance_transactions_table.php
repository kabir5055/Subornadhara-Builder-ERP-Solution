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
        Schema::create('finance_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_id')->unique();
            $table->enum('type', ['income', 'expense']);
            $table->string('category');
            $table->string('subcategory')->nullable();
            $table->decimal('amount', 12, 2);
            $table->text('description');
            $table->date('transaction_date');
            $table->enum('payment_method', ['cash', 'bank_transfer', 'check', 'online']);
            $table->string('reference_number')->nullable();
            $table->foreignId('project_id')->nullable()->constrained()->onDelete('set null');
            $table->string('vendor_supplier')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('finance_transactions');
    }
};
