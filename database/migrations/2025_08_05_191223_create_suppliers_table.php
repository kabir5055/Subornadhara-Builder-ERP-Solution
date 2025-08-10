<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        // Disabled empty duplicate suppliers migration; canonical is 2025_08_05_191210_create_suppliers_table
        return;
    }

    public function down(): void
    {
        return;
    }
};
