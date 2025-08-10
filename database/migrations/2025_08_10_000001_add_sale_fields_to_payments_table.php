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
        Schema::table('payments', function (Blueprint $table) {
            $table->foreignId('sale_id')->nullable()->constrained()->onDelete('cascade')->after('booking_id');
            $table->foreignId('client_id')->nullable()->constrained()->onDelete('cascade')->after('sale_id');
            $table->foreignId('project_id')->nullable()->constrained()->onDelete('cascade')->after('client_id');
            $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('completed')->after('notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['sale_id']);
            $table->dropForeign(['client_id']);
            $table->dropForeign(['project_id']);
            $table->dropColumn(['sale_id', 'client_id', 'project_id', 'status']);
        });
    }
};
