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
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('unit_number');
            $table->string('floor');
            $table->enum('type', ['apartment', 'duplex', 'penthouse', 'studio']);
            $table->integer('bedrooms');
            $table->integer('bathrooms');
            $table->decimal('size_sqft', 8, 2);
            $table->decimal('price', 12, 2);
            $table->enum('status', ['available', 'booked', 'sold', 'reserved'])->default('available');
            $table->text('features')->nullable();
            $table->timestamps();

            $table->unique(['project_id', 'unit_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
