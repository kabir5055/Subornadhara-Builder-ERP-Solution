<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Client;
use App\Models\Project;
use App\Models\Employee;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class ERPSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles and permissions
        $this->createRolesAndPermissions();

        // Create admin user
        $this->createAdminUser();

    // Note: The following heavy seeders are invoked by dedicated seeders in MasterSeeder.
    // They were causing mismatches earlier due to schema drift. We'll let specific seeders
    // handle their own data to avoid duplication and ensure correct ordering.
    // $this->createEmployees();
    // $this->createClients();
    // $this->createProjects();

        $this->command->info('ERP Sample Data Created Successfully!');
        $this->command->info('Admin Login: admin@subornadhara.com / admin123');
        $this->command->info('Employee Login: staff@subornadhara.com / staff123');
    }

    private function createRolesAndPermissions()
    {
        // Create roles if they don't exist
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $staff = Role::firstOrCreate(['name' => 'staff']);
        $agent = Role::firstOrCreate(['name' => 'agent']);

        // Create permissions
        $permissions = [
            'view-dashboard', 'manage-projects', 'manage-clients', 'manage-sales',
            'manage-finance', 'manage-employees', 'manage-inventory', 'view-reports',
            'manage-settings', 'manage-notifications'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Assign all permissions to admin
        $admin->syncPermissions($permissions);

        // Assign limited permissions to staff
        $staff->syncPermissions([
            'view-dashboard', 'manage-clients', 'manage-sales', 'view-reports'
        ]);

        // Assign minimal permissions to agent
        $agent->syncPermissions([
            'view-dashboard', 'manage-clients', 'view-reports'
        ]);
    }

    private function createAdminUser()
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@subornadhara.com'],
            [
                'name' => 'System Administrator',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
            ]
        );

        $admin->assignRole('admin');

        // Create a staff user
        $staff = User::firstOrCreate(
            ['email' => 'staff@subornadhara.com'],
            [
                'name' => 'Staff Member',
                'password' => Hash::make('staff123'),
                'email_verified_at' => now(),
            ]
        );

        $staff->assignRole('staff');

        // Create an agent user
        $agent = User::firstOrCreate(
            ['email' => 'agent@subornadhara.com'],
            [
                'name' => 'Sales Agent',
                'password' => Hash::make('agent123'),
                'email_verified_at' => now(),
            ]
        );

        $agent->assignRole('agent');
    }

    // private function createEmployees()
    // {
    //     Employee::factory(50)->create();
    // }

    // private function createClients()
    // {
    //     Client::factory(100)->create();
    // }

    // private function createProjects()
    // {
    //     Project::factory(25)->create();
    // }
}
