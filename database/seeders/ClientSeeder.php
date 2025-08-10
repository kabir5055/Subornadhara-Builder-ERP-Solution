<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clients = [
            [
                'name' => 'Mohammad Abdul Rahman',
                'email' => 'abdul.rahman@email.com',
                'phone' => '+8801712345001',
                'nid_number' => '1975123456001',
                'address' => '45/A, Road 12, Gulshan-2, Dhaka-1212',
                'type' => 'individual',
                'status' => 'active',
                'occupation' => 'Business Owner',
                'annual_income' => 2500000.00,
                'emergency_contact' => '+8801812345001',
                'reference_by' => 'Facebook Marketing',
                'notes' => 'Interested in luxury apartments. Prefers high-floor units.',
            ],
            [
                'name' => 'Fatema Begum',
                'email' => 'fatema.begum@email.com',
                'phone' => '+8801712345002',
                'nid_number' => '1980234567002',
                'address' => '23/B, Dhanmondi Road 15, Dhaka-1205',
                'type' => 'individual',
                'status' => 'active',
                'occupation' => 'Doctor',
                'annual_income' => 1800000.00,
                'emergency_contact' => '+8801812345002',
                'reference_by' => 'Existing Client Referral',
                'notes' => 'Looking for family-friendly environment with medical facilities nearby.',
            ],
            [
                'name' => 'Ahmed Trading Corporation',
                'email' => 'info@ahmedtrading.com',
                'phone' => '+8801712345003',
                'nid_number' => null,
                'address' => '67/C, Motijheel Commercial Area, Dhaka-1000',
                'type' => 'corporate',
                'status' => 'active',
                'occupation' => 'Trading Business',
                'annual_income' => 5000000.00,
                'emergency_contact' => '+8801812345003',
                'reference_by' => 'Business Network',
                'notes' => 'Corporate client interested in commercial spaces for expansion.',
            ],
            [
                'name' => 'Rashida Khatun',
                'email' => 'rashida.khatun@email.com',
                'phone' => '+8801712345004',
                'nid_number' => '1985345678004',
                'address' => '12/A, Uttara Sector 7, Dhaka-1230',
                'type' => 'individual',
                'status' => 'active',
                'occupation' => 'Bank Officer',
                'annual_income' => 1200000.00,
                'emergency_contact' => '+8801812345004',
                'reference_by' => 'Google Ads',
                'notes' => 'First-time property buyer. Needs financing assistance.',
            ],
            [
                'name' => 'Karim Textile Mills Ltd.',
                'email' => 'contact@karimtextile.com',
                'phone' => '+8801712345005',
                'nid_number' => null,
                'address' => '89/D, Tejgaon Industrial Area, Dhaka-1208',
                'type' => 'corporate',
                'status' => 'active',
                'occupation' => 'Manufacturing',
                'annual_income' => 8000000.00,
                'emergency_contact' => '+8801812345005',
                'reference_by' => 'Business Chamber',
                'notes' => 'Looking for warehouse and office space combination.',
            ],
            [
                'name' => 'Nasir Ahmed',
                'email' => 'nasir.ahmed@email.com',
                'phone' => '+8801712345006',
                'nid_number' => '1978456789006',
                'address' => '34/E, Banani Road 11, Dhaka-1213',
                'type' => 'individual',
                'status' => 'active',
                'occupation' => 'IT Professional',
                'annual_income' => 1500000.00,
                'emergency_contact' => '+8801812345006',
                'reference_by' => 'LinkedIn',
                'notes' => 'Tech-savvy client interested in smart home features.',
            ],
            [
                'name' => 'Salma Akter',
                'email' => 'salma.akter@email.com',
                'phone' => '+8801712345007',
                'nid_number' => '1990567890007',
                'address' => '56/F, Bashundhara R/A Block C, Dhaka-1229',
                'type' => 'individual',
                'status' => 'active',
                'occupation' => 'Teacher',
                'annual_income' => 800000.00,
                'emergency_contact' => '+8801812345007',
                'reference_by' => 'Colleague Referral',
                'notes' => 'Looking for affordable housing options with good schools nearby.',
            ],
            [
                'name' => 'Green Valley Pharmaceuticals',
                'email' => 'admin@greenvalley.com',
                'phone' => '+8801712345008',
                'nid_number' => null,
                'address' => '78/G, Panthapath, Dhaka-1205',
                'type' => 'corporate',
                'status' => 'active',
                'occupation' => 'Pharmaceutical',
                'annual_income' => 12000000.00,
                'emergency_contact' => '+8801812345008',
                'reference_by' => 'Industry Association',
                'notes' => 'Requires specialized facilities for pharmaceutical operations.',
            ],
            [
                'name' => 'Mahmuda Rahman',
                'email' => 'mahmuda.rahman@email.com',
                'phone' => '+8801712345009',
                'nid_number' => '1982678901009',
                'address' => '91/H, Lalmatia Block B, Dhaka-1207',
                'type' => 'individual',
                'status' => 'active',
                'occupation' => 'Government Officer',
                'annual_income' => 1000000.00,
                'emergency_contact' => '+8801812345009',
                'reference_by' => 'Newspaper Advertisement',
                'notes' => 'Conservative buyer, prefers traditional designs and proven locations.',
            ],
            [
                'name' => 'Digital Solutions Ltd.',
                'email' => 'hello@digitalsolutions.com',
                'phone' => '+8801712345010',
                'nid_number' => null,
                'address' => '123/I, Gulshan Avenue, Dhaka-1212',
                'type' => 'corporate',
                'status' => 'active',
                'occupation' => 'Software Company',
                'annual_income' => 6000000.00,
                'emergency_contact' => '+8801812345010',
                'reference_by' => 'Online Search',
                'notes' => 'Modern tech company looking for contemporary office space with high-speed internet.',
            ],
        ];

        foreach ($clients as $client) {
            Client::firstOrCreate(
                ['email' => $client['email']],
                $client
            );
        }

        // Generate additional random clients
        for ($i = 11; $i <= 100; $i++) {
            $isIndividual = rand(1, 10) <= 7; // 70% individual, 30% corporate

            if ($isIndividual) {
                $firstName = ['Mohammad', 'Abdul', 'Fatema', 'Rashida', 'Ahmed', 'Nasir', 'Salma', 'Mahmuda', 'Karim', 'Hasina', 'Rahim', 'Sultana'][rand(0, 11)];
                $lastName = ['Rahman', 'Ahmed', 'Khatun', 'Begum', 'Ali', 'Islam', 'Khan', 'Hossain', 'Chowdhury', 'Aktar'][rand(0, 9)];
                $name = $firstName . ' ' . $lastName;
                $occupation = ['Engineer', 'Doctor', 'Teacher', 'Business Owner', 'Bank Officer', 'Government Officer', 'IT Professional', 'Lawyer'][rand(0, 7)];
                $income = rand(500000, 3000000);
            } else {
                $companyTypes = ['Trading', 'Textile', 'Pharmaceuticals', 'Solutions', 'Corporation', 'Industries', 'Group', 'Enterprise'];
                $companyNames = ['Ahmed', 'Rahman', 'Digital', 'Green Valley', 'Metro', 'Golden', 'Prime', 'Elite', 'Star', 'Royal'];
                $name = $companyNames[rand(0, 9)] . ' ' . $companyTypes[rand(0, 7)] . ' Ltd.';
                $occupation = ['Manufacturing', 'Trading', 'Software', 'Pharmaceutical', 'Textile', 'Construction', 'Import/Export'][rand(0, 6)];
                $income = rand(2000000, 15000000);
            }

            Client::create([
                'name' => $name,
                'email' => 'client' . $i . '@example.com',
                'phone' => '+88017' . rand(10000000, 99999999),
                'nid_number' => $isIndividual ? (1980 + rand(0, 20)) . rand(100000000, 999999999) : null,
                'address' => rand(1, 999) . '/' . chr(65 + rand(0, 25)) . ', Dhaka-' . (1200 + rand(0, 30)),
                'type' => $isIndividual ? 'individual' : 'corporate',
                'status' => ['active', 'active', 'active', 'inactive'][rand(0, 3)], // 75% active
                'occupation' => $occupation,
                'annual_income' => $income,
                'emergency_contact' => '+88018' . rand(10000000, 99999999),
                'reference_by' => ['Google Ads', 'Facebook', 'Referral', 'Website', 'Newspaper', 'Billboard'][rand(0, 5)],
                'notes' => 'Auto-generated client for testing purposes.',
            ]);
        }

        $this->command->info('Clients seeded successfully!');
    }
}
