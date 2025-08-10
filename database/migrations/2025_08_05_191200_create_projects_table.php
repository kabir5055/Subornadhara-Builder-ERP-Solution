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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->string('location');
            $table->decimal('total_area', 10, 2);
            $table->integer('total_units');
            $table->integer('sold_units')->default(0);
            $table->decimal('price_per_sqft', 10, 2);
            $table->enum('status', ['planning', 'ongoing', 'completed', 'on_hold'])->default('planning');
            $table->integer('progress_percentage')->default(0);
            $table->date('start_date')->nullable();
            $table->date('expected_completion')->nullable();
            $table->string('project_image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
