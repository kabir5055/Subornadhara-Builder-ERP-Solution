<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Disabled duplicate migration: superseded by 2025_08_07_121820_create_attendances_table
        return; // no-op
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // no-op
        return;
    }
};
