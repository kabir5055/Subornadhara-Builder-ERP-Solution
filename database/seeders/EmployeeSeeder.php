<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Department;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = Department::all()->pluck('id', 'name')->toArray();

        if (empty($departments)) {
            $this->command->warn('No departments found. Please run DepartmentSeeder first.');
            return;
        }

        $employees = [
            [
                'employee_id' => 'SB001',
                'name' => 'Mohammad Rashid Ahmed',
                'email' => 'rashid.ahmed@subornadhara.com',
                'phone' => '+8801712345001',
                'nid_number' => '1975123456001',
                'date_of_birth' => '1975-03-15',
                'gender' => 'male',
                'marital_status' => 'married',
                'address' => '45/A, Gulshan-2, Dhaka-1212',
                'department_id' => $departments['Administration'] ?? array_values($departments)[0],
                'designation' => 'Managing Director',
                'join_date' => '2020-01-15',
                'salary' => 250000.00,
                'employment_type' => 'permanent',
                'status' => 'active',
                'bank_account' => '1234567890123',
                'emergency_contact' => '+8801812345001',
            ],
            [
                'employee_id' => 'SB002',
                'name' => 'Fatima Rahman',
                'email' => 'fatima.rahman@subornadhara.com',
                'phone' => '+8801712345002',
                'nid_number' => '1980234567002',
                'date_of_birth' => '1980-06-20',
                'gender' => 'female',
                'marital_status' => 'single',
                'address' => '12/B, Dhanmondi, Dhaka-1205',
                'department_id' => $departments['Sales & Marketing'] ?? array_values($departments)[1],
                'designation' => 'Sales Manager',
                'join_date' => '2020-03-20',
                'salary' => 150000.00,
                'employment_type' => 'permanent',
                'status' => 'active',
                'bank_account' => '2234567890123',
                'emergency_contact' => '+8801812345002',
            ],
            [
                'employee_id' => 'SB003',
                'name' => 'Ahmed Hassan',
                'email' => 'ahmed.hassan@subornadhara.com',
                'phone' => '+8801712345003',
                'nid_number' => '1985345678003',
                'date_of_birth' => '1985-09-10',
                'gender' => 'male',
                'marital_status' => 'married',
                'address' => '78/C, Uttara, Dhaka-1230',
                'department_id' => $departments['Engineering'] ?? array_values($departments)[2],
                'designation' => 'Civil Engineer',
                'join_date' => '2020-06-10',
                'salary' => 120000.00,
                'employment_type' => 'permanent',
                'status' => 'active',
                'bank_account' => '3234567890123',
                'emergency_contact' => '+8801812345003',
            ],
            [
                'employee_id' => 'SB004',
                'name' => 'Nasreen Akter',
                'email' => 'nasreen.akter@subornadhara.com',
                'phone' => '+8801712345004',
                'nid_number' => '1988456789004',
                'date_of_birth' => '1988-12-05',
                'gender' => 'female',
                'marital_status' => 'married',
                'address' => '34/D, Banani, Dhaka-1213',
                'department_id' => $departments['Finance & Accounts'] ?? array_values($departments)[3],
                'designation' => 'Senior Accountant',
                'join_date' => '2020-08-25',
                'salary' => 110000.00,
                'employment_type' => 'permanent',
                'status' => 'active',
                'bank_account' => '4234567890123',
                'emergency_contact' => '+8801812345004',
            ],
            [
                'employee_id' => 'SB005',
                'name' => 'Kamal Hossain',
                'email' => 'kamal.hossain@subornadhara.com',
                'phone' => '+8801712345005',
                'nid_number' => '1983567890005',
                'date_of_birth' => '1983-02-28',
                'gender' => 'male',
                'marital_status' => 'single',
                'address' => '56/E, Mirpur, Dhaka-1216',
                'department_id' => $departments['HR'] ?? array_values($departments)[4],
                'designation' => 'HR Manager',
                'join_date' => '2020-10-12',
                'salary' => 130000.00,
                'employment_type' => 'permanent',
                'status' => 'active',
                'bank_account' => '5234567890123',
                'emergency_contact' => '+8801812345005',
            ],
        ];

        foreach ($employees as $employeeData) {
            Employee::create(array_merge($employeeData, [
                'created_at' => Carbon::parse($employeeData['join_date']),
                'updated_at' => now(),
            ]));
        }

        // Generate additional employees
        $departmentIds = array_values($departments);
        $designations = ['Executive', 'Assistant Manager', 'Senior Executive', 'Junior Executive', 'Officer', 'Assistant', 'Coordinator'];

        for ($i = 6; $i <= 50; $i++) {
            Employee::create([
                'employee_id' => 'SB' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'name' => $this->generateRandomName(),
                'email' => 'employee' . $i . '@subornadhara.com',
                'phone' => '+880171' . rand(1000000, 9999999),
                'nid_number' => rand(1970000000000, 1995999999999),
                'date_of_birth' => Carbon::now()->subYears(rand(25, 55))->format('Y-m-d'),
                'gender' => rand(0, 1) ? 'male' : 'female',
                'marital_status' => ['single', 'married', 'divorced'][rand(0, 2)],
                'address' => $this->generateRandomAddress(),
                'department_id' => $departmentIds[rand(0, count($departmentIds) - 1)],
                'designation' => $designations[rand(0, count($designations) - 1)],
                'join_date' => Carbon::now()->subMonths(rand(1, 60))->format('Y-m-d'),
                'salary' => rand(25000, 150000),
                'employment_type' => rand(0, 10) > 8 ? 'contract' : 'permanent',
                'status' => rand(0, 20) > 18 ? 'inactive' : 'active',
                'bank_account' => rand(1000000000000, 9999999999999),
                'emergency_contact' => '+880181' . rand(1000000, 9999999),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('Employees seeded successfully!');
    }

    private function generateRandomName()
    {
        $firstNames = ['Mohammad', 'Ahmed', 'Abdul', 'Rashid', 'Karim', 'Rahman', 'Hassan', 'Ali', 'Omar', 'Yusuf',
                      'Fatima', 'Aysha', 'Khadija', 'Zainab', 'Mariam', 'Nasreen', 'Sultana', 'Rehana', 'Salma', 'Ruma'];
        $lastNames = ['Ahmed', 'Rahman', 'Hassan', 'Ali', 'Khan', 'Chowdhury', 'Islam', 'Uddin', 'Hossain', 'Akter',
                     'Begum', 'Khatun', 'Mondal', 'Sheikh', 'Miah', 'Sarkar', 'Das', 'Roy', 'Biswas', 'Saha'];

        return $firstNames[rand(0, count($firstNames) - 1)] . ' ' . $lastNames[rand(0, count($lastNames) - 1)];
    }

    private function generateRandomAddress()
    {
        $areas = ['Gulshan', 'Dhanmondi', 'Uttara', 'Banani', 'Mirpur', 'Wari', 'Old Dhaka', 'Tejgaon', 'Mohammadpur', 'Ramna'];
        $house = rand(1, 99);
        $road = rand(1, 50);
        $area = $areas[rand(0, count($areas) - 1)];

        return "{$house}/{$road}, {$area}, Dhaka-" . rand(1200, 1230);
    }
}
