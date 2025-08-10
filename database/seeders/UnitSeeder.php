<?php

namespace Database\Seeders;

use App\Models\Unit;
use App\Models\Project;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = Project::all();

        if ($projects->isEmpty()) {
            $this->command->warn('No projects found. Please run ProjectSeeder first.');
            return;
        }

        foreach ($projects as $project) {
            $floors = ['Ground', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
            $unitsPerFloor = ceil($project->total_units / 10); // Approximate units per floor
            $unitCounter = 1;

            for ($floor = 0; $floor < min(10, count($floors)); $floor++) {
                for ($unitOnFloor = 1; $unitOnFloor <= $unitsPerFloor && $unitCounter <= $project->total_units; $unitOnFloor++) {
                    $floorName = $floors[$floor];
                    $unitNumber = $floorName === 'Ground' ? 'G-' . str_pad($unitOnFloor, 2, '0', STR_PAD_LEFT) :
                                 ($floor + 1) . str_pad($unitOnFloor, 2, '0', STR_PAD_LEFT);

                    // Determine unit type and specifications
                    $typeChance = rand(1, 100);
                    if ($typeChance <= 60) {
                        $type = 'apartment';
                        $bedrooms = rand(2, 4);
                        $bathrooms = $bedrooms - 1;
                        $sizeFactor = rand(800, 1500);
                    } elseif ($typeChance <= 80) {
                        $type = 'duplex';
                        $bedrooms = rand(3, 5);
                        $bathrooms = $bedrooms;
                        $sizeFactor = rand(1200, 2000);
                    } elseif ($typeChance <= 90) {
                        $type = 'penthouse';
                        $bedrooms = rand(4, 6);
                        $bathrooms = $bedrooms;
                        $sizeFactor = rand(1800, 3000);
                    } else {
                        $type = 'studio';
                        $bedrooms = 1;
                        $bathrooms = 1;
                        $sizeFactor = rand(400, 800);
                    }

                    $sizeQft = $sizeFactor + rand(-100, 200);
                    $price = $sizeQft * $project->price_per_sqft;

                    // Determine status based on project's sold_units
                    $soldPercentage = $project->sold_units / $project->total_units;
                    $statusChance = rand(1, 100);

                    if ($unitCounter <= $project->sold_units) {
                        $status = 'sold';
                    } elseif ($statusChance <= 15) {
                        $status = 'booked';
                    } elseif ($statusChance <= 25) {
                        $status = 'reserved';
                    } else {
                        $status = 'available';
                    }

                    // Generate features based on unit type
                    $features = [];
                    if ($type === 'penthouse') {
                        $features[] = 'Private Rooftop';
                        $features[] = 'Panoramic City View';
                        $features[] = 'Premium Finishes';
                    }
                    if ($type === 'duplex') {
                        $features[] = 'Double Height Living';
                        $features[] = 'Private Staircase';
                    }
                    if ($bedrooms >= 3) {
                        $features[] = 'Master Bedroom Suite';
                    }
                    if ($floor >= 5) {
                        $features[] = 'Great City View';
                    }

                    $commonFeatures = ['Balcony', 'Modern Kitchen', 'Built-in Wardrobes', 'Air Conditioning Ready', 'Internet Ready'];
                    $features = array_merge($features, array_slice($commonFeatures, 0, rand(2, 4)));

                    Unit::create([
                        'project_id' => $project->id,
                        'unit_number' => $unitNumber,
                        'floor' => $floorName,
                        'type' => $type,
                        'bedrooms' => $bedrooms,
                        'bathrooms' => $bathrooms,
                        'size_sqft' => $sizeQft,
                        'price' => $price,
                        'status' => $status,
                        'features' => implode(', ', $features),
                    ]);

                    $unitCounter++;
                }
            }
        }

        $this->command->info('Units seeded successfully!');
    }
}
