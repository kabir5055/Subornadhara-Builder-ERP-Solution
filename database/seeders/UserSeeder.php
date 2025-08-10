<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            // User Management
            'view-users', 'create-users', 'edit-users', 'delete-users',
            // Employee Management
            'view-employees', 'create-employees', 'edit-employees', 'delete-employees',
            // Project Management
            'view-projects', 'create-projects', 'edit-projects', 'delete-projects',
            // Client Management
            'view-clients', 'create-clients', 'edit-clients', 'delete-clients',
            // Sales Management
            'view-sales', 'create-sales', 'edit-sales', 'delete-sales',
            // Finance Management
            'view-finance', 'create-finance', 'edit-finance', 'delete-finance',
            // Inventory Management
            'view-inventory', 'create-inventory', 'edit-inventory', 'delete-inventory',
            // Attendance Management
            'view-attendance', 'create-attendance', 'edit-attendance', 'delete-attendance',
            // Salary Management
            'view-salary', 'create-salary', 'edit-salary', 'delete-salary',
            // Reports
            'view-reports', 'export-reports',
            // Settings
            'view-settings', 'edit-settings',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $hrRole = Role::firstOrCreate(['name' => 'hr']);
        $managerRole = Role::firstOrCreate(['name' => 'manager']);
        $employeeRole = Role::firstOrCreate(['name' => 'employee']);
        $agentRole = Role::firstOrCreate(['name' => 'agent']);

        // Assign permissions to roles
        $adminRole->givePermissionTo(Permission::all());

        $hrRole->givePermissionTo([
            'view-employees', 'create-employees', 'edit-employees',
            'view-attendance', 'create-attendance', 'edit-attendance',
            'view-salary', 'create-salary', 'edit-salary',
            'view-reports', 'export-reports',
        ]);

        $managerRole->givePermissionTo([
            'view-projects', 'create-projects', 'edit-projects',
            'view-clients', 'create-clients', 'edit-clients',
            'view-sales', 'create-sales', 'edit-sales',
            'view-employees', 'view-attendance', 'view-reports',
        ]);

        $agentRole->givePermissionTo([
            'view-clients', 'create-clients', 'edit-clients',
            'view-sales', 'create-sales', 'edit-sales',
            'view-projects',
        ]);

        $employeeRole->givePermissionTo([
            'view-attendance', 'create-attendance',
        ]);

        // Create users
        $adminUser = User::firstOrCreate([
            'email' => 'admin@subornadhara.com'
        ], [
            'name' => 'System Administrator',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $adminUser->assignRole('admin');

        $hrUser = User::firstOrCreate([
            'email' => 'hr@subornadhara.com'
        ], [
            'name' => 'HR Manager',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $hrUser->assignRole('hr');

        $managerUser = User::firstOrCreate([
            'email' => 'manager@subornadhara.com'
        ], [
            'name' => 'Project Manager',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $managerUser->assignRole('manager');

        $agentUser = User::firstOrCreate([
            'email' => 'agent@subornadhara.com'
        ], [
            'name' => 'Sales Agent',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $agentUser->assignRole('agent');

        $this->command->info('Users and permissions seeded successfully!');
    }
}
