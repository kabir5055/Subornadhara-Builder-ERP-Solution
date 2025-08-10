<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $areas = ['Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mirpur', 'Bashundhara', 'Wari', 'Elephant Road'];
        $projectTypes = ['Residential Tower', 'Commercial Complex', 'Mixed Development', 'Luxury Apartments'];

        $name = $this->faker->randomElement($projectTypes) . ' - ' . $this->faker->randomElement($areas);
        $code = 'SBL-' . strtoupper($this->faker->lexify('???')) . '-' . $this->faker->numberBetween(100, 999);

        $totalArea = $this->faker->numberBetween(5000, 50000);
        $pricePerSqft = $this->faker->numberBetween(8000, 15000);
        $totalUnits = $this->faker->numberBetween(20, 200);
        $soldUnits = $this->faker->numberBetween(0, $totalUnits);

        $startDate = $this->faker->dateTimeBetween('-3 years', '-1 year');
        $completionDate = $this->faker->dateTimeBetween($startDate, '+2 years');

        return [
            'name' => $name,
            'code' => $code,
            'description' => $this->faker->paragraph(3),
            'location' => $this->faker->randomElement($areas) . ', Dhaka',
            'total_area' => $totalArea,
            'total_units' => $totalUnits,
            'sold_units' => $soldUnits,
            'price_per_sqft' => $pricePerSqft,
            'status' => $this->faker->randomElement(['planning', 'ongoing', 'completed']),
            'progress_percentage' => $this->faker->numberBetween(0, 100),
            'start_date' => $startDate,
            'expected_completion' => $completionDate,
            'project_image' => 'projects/project-' . $this->faker->numberBetween(1, 10) . '.jpg',
            'created_at' => $this->faker->dateTimeBetween('-2 years', 'now'),
        ];
    }
}
