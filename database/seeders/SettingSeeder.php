<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Company Information
            ['key' => 'company_name', 'value' => 'Subornadhara Development Ltd.', 'group' => 'company', 'type' => 'string', 'description' => 'Company name'],
            ['key' => 'company_address', 'value' => 'House 123, Road 45, Gulshan-2, Dhaka-1212, Bangladesh', 'group' => 'company', 'type' => 'string', 'description' => 'Company address'],
            ['key' => 'company_phone', 'value' => '+880-2-9876543210', 'group' => 'company', 'type' => 'string', 'description' => 'Company phone number'],
            ['key' => 'company_email', 'value' => 'info@subornadhara.com', 'group' => 'company', 'type' => 'string', 'description' => 'Company email address'],
            ['key' => 'company_website', 'value' => 'https://www.subornadhara.com', 'group' => 'company', 'type' => 'string', 'description' => 'Company website URL'],
            ['key' => 'company_logo', 'value' => 'uploads/company/logo.png', 'group' => 'company', 'type' => 'string', 'description' => 'Company logo path'],

            // Business Settings
            ['key' => 'business_type', 'value' => 'Real Estate Development', 'group' => 'business', 'type' => 'string', 'description' => 'Type of business'],
            ['key' => 'currency', 'value' => 'BDT', 'group' => 'business', 'type' => 'string', 'description' => 'Default currency'],
            ['key' => 'currency_symbol', 'value' => '৳', 'group' => 'business', 'type' => 'string', 'description' => 'Currency symbol'],
            ['key' => 'timezone', 'value' => 'Asia/Dhaka', 'group' => 'system', 'type' => 'string', 'description' => 'System timezone'],

            // Payment Settings
            ['key' => 'booking_percentage', 'value' => '20', 'group' => 'payment', 'type' => 'integer', 'description' => 'Minimum booking percentage'],
            ['key' => 'max_installments', 'value' => '36', 'group' => 'payment', 'type' => 'integer', 'description' => 'Maximum number of installments'],
            ['key' => 'late_payment_penalty', 'value' => '2', 'group' => 'payment', 'type' => 'integer', 'description' => 'Late payment penalty percentage'],

            // HR Settings
            ['key' => 'working_hours_per_day', 'value' => '8', 'group' => 'hr', 'type' => 'integer', 'description' => 'Standard working hours per day'],
            ['key' => 'working_days_per_week', 'value' => '5', 'group' => 'hr', 'type' => 'integer', 'description' => 'Working days per week'],
            ['key' => 'weekend_days', 'value' => 'Friday,Saturday', 'group' => 'hr', 'type' => 'string', 'description' => 'Weekend days'],

            // System Settings
            ['key' => 'system_maintenance', 'value' => 'false', 'group' => 'system', 'type' => 'boolean', 'description' => 'System maintenance mode'],
            ['key' => 'max_file_upload_size', 'value' => '10240', 'group' => 'system', 'type' => 'integer', 'description' => 'Maximum file upload size in KB'],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }

        $this->command->info('Settings seeded successfully!');
    }
}
