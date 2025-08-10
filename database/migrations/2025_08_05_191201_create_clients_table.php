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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->string('nid_number')->nullable();
            $table->text('address');
            $table->enum('type', ['individual', 'corporate'])->default('individual');
            $table->enum('status', ['active', 'inactive', 'blacklisted'])->default('active');
            $table->string('occupation')->nullable();
            $table->decimal('annual_income', 12, 2)->nullable();
            $table->string('emergency_contact')->nullable();
            $table->string('reference_by')->nullable();
            $table->text('notes')->nullable();
            $table->string('profile_photo')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
