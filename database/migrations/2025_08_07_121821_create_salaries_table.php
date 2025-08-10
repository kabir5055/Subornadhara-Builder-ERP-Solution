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
        Schema::create('salaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->date('month'); // First day of the month

            // Salary components
            $table->decimal('basic_salary', 10, 2);
            $table->decimal('house_allowance', 10, 2)->default(0);
            $table->decimal('transport_allowance', 10, 2)->default(0);
            $table->decimal('medical_allowance', 10, 2)->default(0);
            $table->decimal('other_allowances', 10, 2)->default(0);
            $table->decimal('overtime_amount', 10, 2)->default(0);
            $table->decimal('bonus', 10, 2)->default(0);
            $table->decimal('gross_salary', 10, 2);

            // Deductions
            $table->decimal('tax_deduction', 10, 2)->default(0);
            $table->decimal('provident_fund', 10, 2)->default(0);
            $table->decimal('other_deductions', 10, 2)->default(0);
            $table->decimal('attendance_deduction', 10, 2)->default(0);
            $table->decimal('total_deductions', 10, 2)->default(0);
            $table->decimal('net_salary', 10, 2);

            // Attendance metrics
            $table->integer('working_days');
            $table->decimal('present_days', 4, 1);
            $table->decimal('absent_days', 4, 1);
            $table->integer('late_days')->default(0);
            $table->decimal('overtime_hours', 6, 2)->default(0);
            $table->decimal('total_hours', 6, 2)->default(0);
            $table->decimal('attendance_percentage', 5, 1);

            // Status and payment tracking
            $table->enum('status', ['calculated', 'approved', 'paid', 'cancelled'])->default('calculated');
            $table->enum('payment_method', ['bank_transfer', 'cash', 'cheque'])->nullable();
            $table->string('payment_reference')->nullable();
            $table->text('payment_notes')->nullable();

            // Audit fields
            $table->foreignId('calculated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->datetime('calculated_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->datetime('approved_at')->nullable();
            $table->foreignId('paid_by')->nullable()->constrained('users')->onDelete('set null');
            $table->datetime('paid_at')->nullable();

            $table->timestamps();

            $table->unique(['employee_id', 'month']);
            $table->index(['employee_id', 'month']);
            $table->index(['month', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salaries');
    }
};
