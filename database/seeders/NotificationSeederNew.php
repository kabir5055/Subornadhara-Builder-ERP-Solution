<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Carbon\Carbon;

class NotificationSeederNew extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        if ($users->isEmpty()) {
            $this->command->warn('No users found. Please run UserSeeder first.');
            return;
        }

        $notificationTypes = [
            'payment_reminder' => [
                'title' => 'Payment Reminder',
                'message' => 'Your payment installment is due in 3 days. Please make the payment to avoid late charges.',
                'type' => 'reminder',
                'icon' => 'payment',
            ],
            'booking_confirmation' => [
                'title' => 'Booking Confirmed',
                'message' => 'Your unit booking has been confirmed successfully. Unit allocation details sent via email.',
                'type' => 'success',
                'icon' => 'check',
            ],
            'project_update' => [
                'title' => 'Project Construction Update',
                'message' => 'Construction progress update: Your project has reached 65% completion milestone.',
                'type' => 'info',
                'icon' => 'building',
            ],
            'document_required' => [
                'title' => 'Documents Required',
                'message' => 'Please submit the remaining documents for loan processing within 7 days.',
                'type' => 'warning',
                'icon' => 'document',
            ],
            'maintenance_notice' => [
                'title' => 'Maintenance Notice',
                'message' => 'Scheduled maintenance work will be conducted next week. Please plan accordingly.',
                'type' => 'info',
                'icon' => 'maintenance',
            ],
            'payment_received' => [
                'title' => 'Payment Received',
                'message' => 'Your payment has been received and processed successfully. Thank you!',
                'type' => 'success',
                'icon' => 'payment',
            ],
            'unit_handover' => [
                'title' => 'Unit Ready for Handover',
                'message' => 'Your unit construction is complete and ready for handover. Please schedule your visit.',
                'type' => 'success',
                'icon' => 'key',
            ],
            'meeting_reminder' => [
                'title' => 'Meeting Reminder',
                'message' => 'You have a scheduled meeting with our team tomorrow at 2:00 PM.',
                'type' => 'reminder',
                'icon' => 'calendar',
            ],
            'special_offer' => [
                'title' => 'Special Offer Available',
                'message' => 'Limited time offer: Get 5% discount on remaining payment if paid within this month.',
                'type' => 'info',
                'icon' => 'offer',
            ],
        ];

        // Generate notifications for each user
        foreach ($users as $user) {
            $notificationCount = rand(5, 15); // Each user gets 5-15 notifications

            for ($i = 1; $i <= $notificationCount; $i++) {
                $notificationType = array_keys($notificationTypes)[rand(0, count($notificationTypes) - 1)];
                $notification = $notificationTypes[$notificationType];

                $createdAt = Carbon::now()->subDays(rand(1, 30));
                $isRead = $createdAt->lt(Carbon::now()->subDays(3)) ? (rand(1, 10) <= 7) : (rand(1, 10) <= 3); // Older notifications more likely to be read

                DB::table('notifications')->insert([
                    'type' => 'App\\Notifications\\' . ucfirst($notificationType),
                    'notifiable_type' => 'App\\Models\\User',
                    'notifiable_id' => $user->id,
                    'data' => json_encode([
                        'title' => $notification['title'],
                        'message' => $notification['message'],
                        'type' => $notification['type'],
                        'icon' => $notification['icon'],
                        'action_url' => $this->getActionUrl($notificationType),
                        'priority' => rand(1, 5),
                        'category' => $this->getCategory($notificationType),
                    ]),
                    'read_at' => $isRead ? $createdAt->copy()->addHours(rand(1, 48)) : null,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);
            }
        }

        // Create some system-wide notifications
        $systemNotifications = [
            [
                'title' => 'System Maintenance Notice',
                'message' => 'System will be under maintenance on Sunday from 2:00 AM to 6:00 AM.',
                'type' => 'warning',
                'icon' => 'maintenance',
            ],
            [
                'title' => 'New Feature Available',
                'message' => 'New online payment feature is now available. You can now make payments through our website.',
                'type' => 'success',
                'icon' => 'feature',
            ],
            [
                'title' => 'Holiday Notice',
                'message' => 'Office will remain closed on Victory Day (December 16). Emergency contact available.',
                'type' => 'info',
                'icon' => 'calendar',
            ],
        ];

        foreach ($systemNotifications as $sysNotification) {
            foreach ($users->take(rand(5, $users->count())) as $user) { // Send to random users
                DB::table('notifications')->insert([
                    'type' => 'App\\Notifications\\SystemNotification',
                    'notifiable_type' => 'App\\Models\\User',
                    'notifiable_id' => $user->id,
                    'data' => json_encode([
                        'title' => $sysNotification['title'],
                        'message' => $sysNotification['message'],
                        'type' => $sysNotification['type'],
                        'icon' => $sysNotification['icon'],
                        'category' => 'system',
                        'priority' => 3,
                    ]),
                    'read_at' => rand(1, 10) <= 6 ? Carbon::now()->subDays(rand(1, 5)) : null, // 60% read
                    'created_at' => Carbon::now()->subDays(rand(1, 7)),
                    'updated_at' => Carbon::now()->subDays(rand(1, 7)),
                ]);
            }
        }

        $this->command->info('Notifications seeded successfully!');
    }

    private function getActionUrl($type)
    {
        $urls = [
            'payment_reminder' => '/payments',
            'booking_confirmation' => '/bookings',
            'project_update' => '/projects',
            'document_required' => '/documents',
            'maintenance_notice' => '/maintenance',
            'payment_received' => '/payments',
            'unit_handover' => '/units',
            'meeting_reminder' => '/meetings',
            'special_offer' => '/offers',
        ];

        return $urls[$type] ?? '/dashboard';
    }

    private function getCategory($type)
    {
        $categories = [
            'payment_reminder' => 'payment',
            'booking_confirmation' => 'booking',
            'project_update' => 'project',
            'document_required' => 'document',
            'maintenance_notice' => 'maintenance',
            'payment_received' => 'payment',
            'unit_handover' => 'unit',
            'meeting_reminder' => 'meeting',
            'special_offer' => 'offer',
        ];

        return $categories[$type] ?? 'general';
    }
}
