<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('employees') && Schema::hasTable('departments')) {
            // Add FK if not already present
            Schema::table('employees', function (Blueprint $table) {
                // Ensure column exists and is unsigned big integer
                if (!Schema::hasColumn('employees', 'department_id')) {
                    $table->unsignedBigInteger('department_id')->nullable()->index();
                }
                // Add foreign key constraint
                $table->foreign('department_id')->references('id')->on('departments')->cascadeOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('employees')) {
            Schema::table('employees', function (Blueprint $table) {
                // Drop FK if exists
                try {
                    $table->dropForeign(['department_id']);
                } catch (Throwable $e) {
                    // ignore if not exists
                }
            });
        }
    }
};
