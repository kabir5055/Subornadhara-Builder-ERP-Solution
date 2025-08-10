<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Client>
 */
class ClientFactory extends Factory
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
            'name' => $firstName . ' ' . $lastName,
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->regexify('01[3-9]\d{8}'), // Bangladeshi phone format
            'nid_number' => $this->faker->regexify('\d{10}'), // 10 digit NID
            'address' => $this->faker->address(),
            'type' => $this->faker->randomElement(['individual', 'corporate']),
            'occupation' => $this->faker->randomElement([
                'Business Owner', 'Government Employee', 'Private Service',
                'Doctor', 'Engineer', 'Teacher', 'Banker', 'Lawyer'
            ]),
            'annual_income' => $this->faker->numberBetween(500000, 5000000),
            'emergency_contact' => $this->faker->regexify('01[3-9]\d{8}'),
            'reference_by' => $this->faker->optional()->name(),
            'notes' => $this->faker->optional()->paragraph(),
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'created_at' => $this->faker->dateTimeBetween('-2 years', 'now'),
        ];
    }
}
