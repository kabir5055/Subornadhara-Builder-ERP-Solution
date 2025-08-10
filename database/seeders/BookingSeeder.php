<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Client;
use App\Models\Project;
use App\Models\Unit;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clients = Client::where('status', 'active')->get();
        $projects = Project::where('status', 'active')->get();
        $units = Unit::whereIn('status', ['booked', 'sold'])->get();

        if ($clients->isEmpty() || $projects->isEmpty()) {
            $this->command->warn('No active clients or projects found. Please run ClientSeeder and ProjectSeeder first.');
            return;
        }

        // If units exist, use them, otherwise create bookings based on projects
        if ($units->isNotEmpty()) {
            foreach ($units->take(50) as $unit) { // Limit to 50 bookings
                $client = $clients->random();
                $project = $projects->find($unit->project_id) ?? $projects->random();
                $bookingDate = Carbon::now()->subDays(rand(1, 365));

                $unitPrice = $unit->price;
                $paidAmount = $unitPrice * (rand(10, 50) / 100); // 10-50% paid
                $dueAmount = $unitPrice - $paidAmount;

                Booking::create([
                    'project_id' => $project->id,
                    'client_id' => $client->id,
                    'unit_number' => $unit->unit_number,
                    'unit_size' => $unit->size ?? rand(800, 2000),
                    'unit_price' => $unitPrice,
                    'total_amount' => $unitPrice,
                    'paid_amount' => $paidAmount,
                    'due_amount' => $dueAmount,
                    'booking_date' => $bookingDate,
                    'payment_status' => $paidAmount >= $unitPrice ? 'completed' : ($paidAmount > 0 ? 'partial' : 'pending'),
                    'booking_status' => $unit->status === 'sold' ? 'confirmed' : 'pending',
                    'terms_conditions' => 'Standard booking terms and conditions apply.',
                    'notes' => 'Booking confirmed for ' . ($unit->type ?? 'apartment') . ' unit ' . $unit->unit_number,
                    'created_at' => $bookingDate,
                    'updated_at' => $bookingDate,
                ]);
            }
        } else {
            // Create sample bookings without units table
            $unitTypes = ['apartment', 'duplex', 'penthouse', 'studio'];

            for ($i = 1; $i <= 30; $i++) {
                $client = $clients->random();
                $project = $projects->random();
                $bookingDate = Carbon::now()->subDays(rand(1, 365));

                $unitSize = rand(800, 2500);
                $unitPrice = $unitSize * rand(4000, 8000); // Price per sqft
                $paidAmount = $unitPrice * (rand(10, 50) / 100);
                $dueAmount = $unitPrice - $paidAmount;

                Booking::create([
                    'project_id' => $project->id,
                    'client_id' => $client->id,
                    'unit_number' => strtoupper(substr($project->name, 0, 2)) . '-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                    'unit_size' => $unitSize,
                    'unit_price' => $unitPrice,
                    'total_amount' => $unitPrice,
                    'paid_amount' => $paidAmount,
                    'due_amount' => $dueAmount,
                    'booking_date' => $bookingDate,
                    'payment_status' => $paidAmount >= $unitPrice ? 'completed' : ($paidAmount > 0 ? 'partial' : 'pending'),
                    'booking_status' => rand(1, 10) <= 7 ? 'confirmed' : 'pending', // 70% confirmed
                    'terms_conditions' => 'Standard booking terms and conditions apply.',
                    'notes' => 'Booking for ' . $unitTypes[rand(0, 3)] . ' unit in ' . $project->name,
                    'created_at' => $bookingDate,
                    'updated_at' => $bookingDate,
                ]);
            }
        }

        $this->command->info('Bookings seeded successfully!');
    }
}
