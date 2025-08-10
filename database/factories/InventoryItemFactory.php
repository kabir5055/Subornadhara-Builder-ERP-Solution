<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InventoryItem>
 */
class InventoryItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['Steel', 'Cement', 'Electrical', 'Tiles', 'Plumbing'];
        $units = ['kg', 'bag', 'meter', 'box', 'piece'];
        $category = $this->faker->randomElement($categories);
        $unit = $this->faker->randomElement($units);
        $code = strtoupper(substr($category, 0, 3)) . '-' . strtoupper($this->faker->bothify('???-###'));

        $unitPrice = $this->faker->randomFloat(2, 50, 20000);
        $stock = $this->faker->numberBetween(0, 1000);

        return [
            'name' => $category . ' ' . ucfirst($this->faker->word()),
            'code' => $code,
            'description' => $this->faker->optional()->sentence(),
            'category' => $category,
            'unit' => $unit,
            'current_stock' => $stock,
            'minimum_stock' => $this->faker->numberBetween(0, 50),
            'unit_price' => $unitPrice,
            'total_value' => $unitPrice * $stock,
            'supplier_id' => null,
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'location' => $this->faker->optional()->bothify('Aisle-#-Bin-##'),
        ];
    }
}
