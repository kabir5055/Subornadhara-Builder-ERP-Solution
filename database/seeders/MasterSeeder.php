<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Exception;

class MasterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🚀 Starting Subornadhara ERP Database Seeding...');

        // List of seeders (FQCN) in proper order; skip gracefully if missing
        $seeders = [
            [ERPSeeder::class, 'Basic system setup and admin user'],
            ['Database\\Seeders\\SettingSeeder', 'System settings'],
            ['Database\\Seeders\\DepartmentSeeder', 'Company departments'],
            ['Database\\Seeders\\ProjectSeeder', 'Real estate projects'],
            ['Database\\Seeders\\ClientSeeder', 'Customer database'],
            ['Database\\Seeders\\EmployeeSeeder', 'Employee records'],
            ['Database\\Seeders\\AttendanceDeviceSeeder', 'Attendance devices'],
            ['Database\\Seeders\\SaleSeeder', 'Sales transactions'],
            ['Database\\Seeders\\InventorySeeder', 'Inventory items'],
            ['Database\\Seeders\\FinanceTransactionSeeder', 'Financial transactions'],
            ['Database\\Seeders\\AttendanceSeeder', 'Employee attendance records'],
        ];

        foreach ($seeders as [$seederClass, $description]) {
            $this->command->info("📋 Seeding: {$description}");

            if (!class_exists($seederClass)) {
                $this->command->warn("ℹ️  Skipped: {$seederClass} not found.");
                continue;
            }

            try {
                $this->call($seederClass);
                $this->command->info("✅ {$seederClass} completed successfully!");
            } catch (Exception $e) {
                $this->command->warn("⚠️  {$seederClass} failed: " . $e->getMessage());

                // Ask if user wants to continue
                if (!$this->command->confirm("Continue with next seeder?", true)) {
                    $this->command->error("🛑 Seeding process stopped by user.");
                    return;
                }
            }
        }

        // Summary
        $this->printSummary();
    }

    private function printSummary()
    {
        $this->command->info('');
        $this->command->info('📊 Database Seeding Summary:');
        $this->command->info('================================');

        $tables = [
            'users' => 'System Users',
            'departments' => 'Departments',
            'projects' => 'Projects',
            'clients' => 'Clients',
            'employees' => 'Employees',
            'attendance_devices' => 'Attendance Devices',
            'sales' => 'Sales Records',
            'inventory_items' => 'Inventory Items',
            'finance_transactions' => 'Finance Records',
            'attendances' => 'Attendance Records',
        ];

        foreach ($tables as $table => $label) {
            try {
                $count = DB::table($table)->count();
                $this->command->info("📋 {$label}: {$count} records");
            } catch (Exception $e) {
                $this->command->warn("⚠️  {$label}: Table not found or accessible");
            }
        }

        $this->command->info('');
        $this->command->info('🎉 Subornadhara ERP Database Setup Complete!');
        $this->command->info('');
        $this->command->info('🌐 You can now access:');
        $this->command->info('   Main App: http://localhost:8000');
        $this->command->info('   Employee Portal: http://localhost:8000/attendance/portal');
        $this->command->info('   Salary Management: http://localhost:8000/salaries');
        $this->command->info('');
        $this->command->info('🔐 Default Admin Login:');
        $this->command->info('   Email: admin@subornadhara.com');
        $this->command->info('   Password: password');
    }
}
