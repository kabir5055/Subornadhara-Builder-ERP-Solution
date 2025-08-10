<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = [
            [
                'name' => 'Subornadhara Heights',
                'code' => 'SH001',
                'description' => 'Luxury residential project with modern amenities including swimming pool, gym, and rooftop garden',
                'location' => 'Gulshan, Dhaka',
                'total_area' => 45000.00,
                'total_units' => 120,
                'sold_units' => 85,
                'price_per_sqft' => 8500.00,
                'status' => 'ongoing',
                'progress_percentage' => 75,
                'start_date' => '2023-01-15',
                'expected_completion' => '2025-12-31',
            ],
            [
                'name' => 'Golden City Plaza',
                'code' => 'GCP002',
                'description' => 'Commercial complex with shops, offices, and food court facilities',
                'location' => 'Dhanmondi, Dhaka',
                'total_area' => 28000.00,
                'total_units' => 80,
                'sold_units' => 65,
                'price_per_sqft' => 12000.00,
                'status' => 'ongoing',
                'progress_percentage' => 60,
                'start_date' => '2023-06-01',
                'expected_completion' => '2026-05-30',
            ],
            [
                'name' => 'Dream Garden Residency',
                'code' => 'DGR003',
                'description' => 'Family-friendly residential project with playground, community center, and green spaces',
                'location' => 'Uttara, Dhaka',
                'total_area' => 35000.00,
                'total_units' => 95,
                'sold_units' => 45,
                'price_per_sqft' => 7200.00,
                'status' => 'planning',
                'progress_percentage' => 20,
                'start_date' => '2024-03-01',
                'expected_completion' => '2027-02-28',
            ],
            [
                'name' => 'Metro Square',
                'code' => 'MS004',
                'description' => 'Mixed-use development with residential, commercial, and recreational facilities',
                'location' => 'Banani, Dhaka',
                'total_area' => 52000.00,
                'total_units' => 150,
                'sold_units' => 150,
                'price_per_sqft' => 9800.00,
                'status' => 'completed',
                'progress_percentage' => 100,
                'start_date' => '2021-08-15',
                'expected_completion' => '2024-07-31',
            ],
            [
                'name' => 'Riverside Apartments',
                'code' => 'RSA005',
                'description' => 'Waterfront residential apartments with scenic river views and premium finishes',
                'location' => 'Tejgaon, Dhaka',
                'total_area' => 30000.00,
                'total_units' => 72,
                'sold_units' => 25,
                'price_per_sqft' => 8800.00,
                'status' => 'planning',
                'progress_percentage' => 15,
                'start_date' => '2024-09-01',
                'expected_completion' => '2027-08-31',
            ],
            [
                'name' => 'Business Hub Tower',
                'code' => 'BHT006',
                'description' => 'Premium office tower with conference facilities, executive lounges, and parking',
                'location' => 'Motijheel, Dhaka',
                'total_area' => 40000.00,
                'total_units' => 60,
                'sold_units' => 42,
                'price_per_sqft' => 15000.00,
                'status' => 'ongoing',
                'progress_percentage' => 40,
                'start_date' => '2023-11-01',
                'expected_completion' => '2026-10-31',
            ],
            [
                'name' => 'Green Valley Homes',
                'code' => 'GVH007',
                'description' => 'Eco-friendly residential project with solar panels, rainwater harvesting, and green architecture',
                'location' => 'Bashundhara, Dhaka',
                'total_area' => 42000.00,
                'total_units' => 110,
                'sold_units' => 30,
                'price_per_sqft' => 7800.00,
                'status' => 'planning',
                'progress_percentage' => 10,
                'start_date' => '2024-12-01',
                'expected_completion' => '2027-11-30',
            ],
            [
                'name' => 'City Center Mall',
                'code' => 'CCM008',
                'description' => 'Large shopping mall with entertainment zone, cinema, and restaurants',
                'location' => 'Wari, Dhaka',
                'total_area' => 48000.00,
                'total_units' => 200,
                'sold_units' => 180,
                'price_per_sqft' => 11500.00,
                'status' => 'ongoing',
                'progress_percentage' => 85,
                'start_date' => '2022-04-15',
                'expected_completion' => '2025-03-31',
            ],
        ];

        foreach ($projects as $project) {
            Project::firstOrCreate(
                ['code' => $project['code']],
                $project
            );
        }

        $this->command->info('Projects seeded successfully!');
    }
}
