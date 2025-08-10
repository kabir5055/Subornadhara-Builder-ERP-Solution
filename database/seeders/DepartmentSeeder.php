<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            [
                'name' => 'Administration',
                'description' => 'Administrative and management staff including executives and support staff',
                'status' => 'active',
            ],
            [
                'name' => 'Engineering',
                'description' => 'Civil engineers, architects, and technical consultants',
                'status' => 'active',
            ],
            [
                'name' => 'Sales & Marketing',
                'description' => 'Sales representatives, marketing executives, and business development team',
                'status' => 'active',
            ],
            [
                'name' => 'Finance & Accounts',
                'description' => 'Financial analysts, accountants, and audit team',
                'status' => 'active',
            ],
            [
                'name' => 'Human Resources',
                'description' => 'HR managers, recruitment specialists, and employee relations',
                'status' => 'active',
            ],
            [
                'name' => 'Construction',
                'description' => 'Site supervisors, construction workers, and project coordinators',
                'status' => 'active',
            ],
            [
                'name' => 'Legal Affairs',
                'description' => 'Legal advisors, documentation specialists, and compliance officers',
                'status' => 'active',
            ],
            [
                'name' => 'Customer Service',
                'description' => 'Customer support representatives and client relationship managers',
                'status' => 'active',
            ],
            [
                'name' => 'Quality Assurance',
                'description' => 'Quality control inspectors and assurance specialists',
                'status' => 'active',
            ],
            [
                'name' => 'IT & Technology',
                'description' => 'IT support, system administrators, and technology specialists',
                'status' => 'active',
            ],
        ];

        foreach ($departments as $department) {
            Department::firstOrCreate(
                ['name' => $department['name']],
                $department
            );
        }

        $this->command->info('Departments seeded successfully!');
    }
}
