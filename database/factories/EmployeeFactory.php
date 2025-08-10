<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gender = $this->faker->randomElement(['male', 'female']);
        $firstName = $this->faker->firstName($gender);
        $lastName = $this->faker->lastName();

        return [
            'employee_id' => 'SBL-' . $this->faker->unique()->numberBetween(1000, 9999),
            'name' => $firstName . ' ' . $lastName,
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->regexify('01[3-9]\d{8}'),
            'nid_number' => $this->faker->regexify('\d{10}'),
            'address' => $this->faker->address(),
            'department_id' => null, // set via seeder when available
            'date_of_birth' => $this->faker->date(),
            'gender' => $gender,
            'marital_status' => $this->faker->randomElement(['single', 'married', 'divorced', 'widowed']),
            'designation' => $this->faker->randomElement([
                'Manager', 'Assistant Manager', 'Senior Executive', 'Executive',
                'Junior Executive', 'Officer', 'Assistant Officer', 'Coordinator'
            ]),
            'salary' => $this->faker->numberBetween(25000, 150000), // schema uses salary decimal
            'join_date' => $this->faker->dateTimeBetween('-5 years', 'now'),
            'employment_type' => $this->faker->randomElement(['permanent', 'contract', 'part_time']),
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'bank_account' => $this->faker->bankAccountNumber(),
            'emergency_contact' => $this->faker->regexify('01[3-9]\d{8}'),
            'skills' => $this->faker->optional()->sentence(),
            'profile_image' => null,
            'created_at' => $this->faker->dateTimeBetween('-2 years', 'now'),
        ];
    }
}
