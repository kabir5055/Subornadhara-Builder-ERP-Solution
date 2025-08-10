<?php

namespace Database\Seeders;

use App\Models\FollowUp;
use App\Models\Client;
use App\Models\Employee;
use App\Models\Project;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class FollowUpSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clients = Client::where('status', 'active')->get();
        $employees = Employee::whereHas('department', function($query) {
            $query->where('name', 'Sales & Marketing');
        })->get();
        $projects = Project::where('status', 'active')->get();

        if ($clients->isEmpty() || $employees->isEmpty() || $projects->isEmpty()) {
            $this->command->warn('Required data not found. Please run ClientSeeder, EmployeeSeeder, and ProjectSeeder first.');
            return;
        }

        $followUpTypes = [
            'initial_contact' => 'Initial contact with prospective client',
            'project_presentation' => 'Project presentation and discussion',
            'site_visit' => 'Site visit arranged for client',
            'price_negotiation' => 'Price negotiation and terms discussion',
            'documentation' => 'Documentation and paperwork follow-up',
            'payment_reminder' => 'Payment reminder and follow-up',
            'booking_confirmation' => 'Booking confirmation process',
            'after_sale_service' => 'After sale service and support',
        ];

        $statuses = ['pending', 'in_progress', 'completed', 'postponed'];
        $priorities = ['low', 'medium', 'high', 'urgent'];

        // Generate follow-up records
        foreach ($clients->take(80) as $client) { // 80% of clients have follow-ups
            $followUpCount = rand(1, 5); // Each client has 1-5 follow-ups

            for ($i = 1; $i <= $followUpCount; $i++) {
                $followUpType = array_rand($followUpTypes);
                $followUpDate = Carbon::now()->subDays(rand(1, 90));
                $nextFollowUpDate = $followUpDate->copy()->addDays(rand(1, 14));

                $status = $statuses[rand(0, 3)];
                if ($followUpDate->lt(Carbon::now()->subDays(7))) {
                    $status = rand(0, 1) ? 'completed' : 'postponed'; // Older follow-ups are likely completed or postponed
                }

                FollowUp::create([
                    'client_id' => $client->id,
                    'employee_id' => $employees->random()->id,
                    'project_id' => rand(0, 1) ? $projects->random()->id : null, // 50% have specific project
                    'follow_up_date' => $followUpDate,
                    'follow_up_type' => $followUpType,
                    'description' => $followUpTypes[$followUpType],
                    'notes' => 'Follow-up notes for ' . $client->name . '. ' . $this->getRandomNote($followUpType),
                    'next_follow_up_date' => $status === 'completed' ? null : $nextFollowUpDate,
                    'status' => $status,
                    'priority' => $priorities[rand(0, 3)],
                    'outcome' => $status === 'completed' ? $this->getRandomOutcome($followUpType) : null,
                    'created_at' => $followUpDate,
                    'updated_at' => $followUpDate,
                ]);
            }
        }

        $this->command->info('Follow-up records seeded successfully!');
    }

    private function getRandomNote($followUpType)
    {
        $notes = [
            'initial_contact' => [
                'Client showed interest in residential apartments',
                'Discussed budget and requirements',
                'Provided basic project information',
                'Client requested more details via email',
            ],
            'project_presentation' => [
                'Detailed presentation completed successfully',
                'Client impressed with project features',
                'Discussed payment terms and options',
                'Shared project brochure and floor plans',
            ],
            'site_visit' => [
                'Site visit arranged for weekend',
                'Client visited with family members',
                'Showed ongoing construction progress',
                'Client satisfied with location and amenities',
            ],
            'price_negotiation' => [
                'Negotiated on unit price and payment schedule',
                'Offered flexible payment terms',
                'Discussed discount possibilities',
                'Client considering the proposal',
            ],
            'documentation' => [
                'Collected required documents from client',
                'Paperwork verification in progress',
                'Legal documentation preparation',
                'Bank loan processing assistance provided',
            ],
            'payment_reminder' => [
                'Reminded about upcoming payment due',
                'Discussed payment method preferences',
                'Provided payment receipt and acknowledgment',
                'Installment schedule updated',
            ],
            'booking_confirmation' => [
                'Booking amount received successfully',
                'Unit allocation completed',
                'Booking confirmation letter issued',
                'Next payment schedule shared',
            ],
            'after_sale_service' => [
                'Checking client satisfaction post purchase',
                'Resolving any construction related queries',
                'Handover process coordination',
                'Maintenance service information provided',
            ],
        ];

        return $notes[$followUpType][rand(0, count($notes[$followUpType]) - 1)];
    }

    private function getRandomOutcome($followUpType)
    {
        $outcomes = [
            'initial_contact' => ['Interested', 'Need more information', 'Budget discussion required', 'Site visit requested'],
            'project_presentation' => ['Highly interested', 'Comparing with other projects', 'Ready for site visit', 'Price negotiation needed'],
            'site_visit' => ['Impressed with location', 'Ready to book', 'Need family consultation', 'Considering the project'],
            'price_negotiation' => ['Price agreed', 'Need some discount', 'Payment terms accepted', 'Still negotiating'],
            'documentation' => ['Documents submitted', 'Need additional papers', 'Verification completed', 'Legal process started'],
            'payment_reminder' => ['Payment made', 'Will pay by next week', 'Requested extension', 'Payment processing'],
            'booking_confirmation' => ['Booking confirmed', 'Unit allocated', 'Agreement signed', 'Payment scheduled'],
            'after_sale_service' => ['Satisfied with service', 'Minor issues resolved', 'Handover completed', 'Recommended to others'],
        ];

        return $outcomes[$followUpType][rand(0, count($outcomes[$followUpType]) - 1)];
    }
}
