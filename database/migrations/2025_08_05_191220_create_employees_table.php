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
        $hasDepartments = Schema::hasTable('departments');

        Schema::create('employees', function (Blueprint $table) use ($hasDepartments) {
            $table->id();
            $table->string('employee_id')->unique();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->text('address');
            $table->string('nid_number')->unique();
            $table->date('date_of_birth');
            $table->enum('gender', ['male', 'female', 'other']);
            $table->enum('marital_status', ['single', 'married', 'divorced', 'widowed']);
            if ($hasDepartments) {
                $table->foreignId('department_id')->nullable()->constrained('departments')->cascadeOnDelete();
            } else {
                $table->unsignedBigInteger('department_id')->nullable()->index();
            }
            $table->string('designation');
            $table->date('join_date');
            $table->decimal('salary', 10, 2);
            $table->string('bank_account')->nullable();
            $table->string('emergency_contact')->nullable();
            $table->text('skills')->nullable();
            $table->enum('employment_type', ['permanent', 'contract', 'part_time']);
            $table->enum('status', ['active', 'inactive', 'terminated'])->default('active');
            $table->string('profile_image')->nullable();
            $table->timestamps();

            $table->index(['department_id', 'status']);
            $table->index('employee_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
