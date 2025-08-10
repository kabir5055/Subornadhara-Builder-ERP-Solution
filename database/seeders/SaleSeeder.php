<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Sale;
use App\Models\Client;
use App\Models\Project;

class SaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clients = Client::all();
        $projects = Project::all();

        if ($clients->isEmpty() || $projects->isEmpty()) {
            $this->command->warn('Please run ClientSeeder and ProjectSeeder first.');
            return;
        }

        // Generate 500+ sales records
        for ($i = 1; $i <= 600; $i++) {
            $client = $clients->random();
            $project = $projects->random();

            $unitPrice = rand(2500000, 15000000); // 25 lakh to 1.5 crore
            $paidAmount = rand(500000, $unitPrice); // Partial to full payment

            Sale::create([
                'client_id' => $client->id,
                'project_id' => $project->id,
                'unit_number' => 'Unit-' . $project->id . '-' . str_pad($i % 50 + 1, 3, '0', STR_PAD_LEFT),
                'unit_type' => ['1 Bedroom', '2 Bedroom', '3 Bedroom', '4 Bedroom', 'Studio', 'Penthouse'][array_rand(['1 Bedroom', '2 Bedroom', '3 Bedroom', '4 Bedroom', 'Studio', 'Penthouse'])],
                'unit_size' => rand(650, 2500), // sq ft
                'price_per_sqft' => rand(3500, 8000),
                'total_price' => $unitPrice,
                'booking_money' => $unitPrice * 0.1, // 10% booking money
                'paid_amount' => $paidAmount,
                'due_amount' => $unitPrice - $paidAmount,
                'payment_status' => $paidAmount >= $unitPrice ? 'paid' : ($paidAmount >= $unitPrice * 0.5 ? 'partial' : 'pending'),
                'booking_date' => now()->subDays(rand(1, 730))->format('Y-m-d'),
                'handover_date' => now()->addDays(rand(30, 365))->format('Y-m-d'),
                'status' => ['booked', 'sold', 'cancelled'][array_rand(['booked', 'sold', 'cancelled'])],
                'notes' => 'Sale record #' . $i . ' - ' . ['Regular booking', 'Corporate booking', 'Investor purchase', 'First-time buyer', 'Upgrade purchase'][array_rand(['Regular booking', 'Corporate booking', 'Investor purchase', 'First-time buyer', 'Upgrade purchase'])],
                'created_at' => now()->subDays(rand(1, 365)),
                'updated_at' => now()->subDays(rand(1, 30))
            ]);
        }
    }
}
