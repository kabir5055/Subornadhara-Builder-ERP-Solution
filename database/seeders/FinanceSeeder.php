<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FinanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $transactions = [
            [
                'transaction_id' => 'TXN-001',
                'type' => 'income',
                'category' => 'Property Sales',
                'subcategory' => 'Apartment Sale',
                'amount' => 22500000.00,
                'description' => 'Sale of Unit A-15, Subornadhara Heights to Dr. Ahmed Hassan',
                'transaction_date' => '2024-07-15',
                'payment_method' => 'bank_transfer',
                'reference_number' => 'BT-2024-001',
                'project_id' => 1,
                'vendor_supplier' => null,
                'notes' => 'Full payment received for luxury apartment',
            ],
            [
                'transaction_id' => 'TXN-002',
                'type' => 'expense',
                'category' => 'Construction',
                'subcategory' => 'Materials',
                'amount' => 1500000.00,
                'description' => 'Purchase of cement, steel and bricks for Subornadhara Heights',
                'transaction_date' => '2024-07-10',
                'payment_method' => 'check',
                'reference_number' => 'CHK-001',
                'project_id' => 1,
                'vendor_supplier' => 'LafargeHolcim Bangladesh',
                'notes' => 'Monthly construction materials procurement',
            ],
            [
                'transaction_id' => 'TXN-003',
                'type' => 'income',
                'category' => 'Booking Money',
                'subcategory' => 'Advance Payment',
                'amount' => 500000.00,
                'description' => 'Booking money for Unit B-08, Golden Garden Residency',
                'transaction_date' => '2024-07-20',
                'payment_method' => 'cash',
                'reference_number' => 'CSH-001',
                'project_id' => 2,
                'vendor_supplier' => null,
                'notes' => 'Initial booking amount received',
            ],
            [
                'transaction_id' => 'TXN-004',
                'type' => 'expense',
                'category' => 'Administrative',
                'subcategory' => 'Salary',
                'amount' => 850000.00,
                'description' => 'Monthly salary payment for all employees',
                'transaction_date' => '2024-07-25',
                'payment_method' => 'bank_transfer',
                'reference_number' => 'SAL-2024-07',
                'project_id' => null,
                'vendor_supplier' => 'Employee Payroll',
                'notes' => 'July 2024 salary disbursement',
            ],
            [
                'transaction_id' => 'TXN-005',
                'type' => 'expense',
                'category' => 'Marketing',
                'subcategory' => 'Advertisement',
                'amount' => 250000.00,
                'description' => 'Digital marketing campaign for new projects',
                'transaction_date' => '2024-07-12',
                'payment_method' => 'online',
                'reference_number' => 'ON-001',
                'project_id' => null,
                'vendor_supplier' => 'Digital Marketing Agency',
                'notes' => 'Social media and Google Ads campaign',
            ],
        ];

        foreach ($transactions as $transactionData) {
            \App\Models\FinanceTransaction::create($transactionData);
        }

        // Generate additional transactions to reach 500+ records
        $incomeCategories = ['Property Sales', 'Booking Money', 'Rent Income', 'Investment Return', 'Miscellaneous'];
        $expenseCategories = ['Construction', 'Administrative', 'Marketing', 'Legal', 'Maintenance', 'Utilities'];
        $paymentMethods = ['cash', 'bank_transfer', 'check', 'online'];

        for ($i = 6; $i <= 520; $i++) {
            $isIncome = rand(0, 1);
            $type = $isIncome ? 'income' : 'expense';
            $categories = $isIncome ? $incomeCategories : $expenseCategories;
            $category = $categories[array_rand($categories)];

            $amount = match($category) {
                'Property Sales' => rand(15000000, 50000000),
                'Construction' => rand(500000, 5000000),
                'Administrative' => rand(50000, 1000000),
                'Booking Money' => rand(100000, 2000000),
                default => rand(10000, 500000),
            };

            $year = rand(2023, 2024);
            $month = rand(1, 12);
            $day = rand(1, 28);

            \App\Models\FinanceTransaction::create([
                'transaction_id' => 'TXN-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'type' => $type,
                'category' => $category,
                'subcategory' => $this->getSubcategory($category),
                'amount' => $amount,
                'description' => $this->generateDescription($category, $type),
                'transaction_date' => "{$year}-{$month}-{$day}",
                'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                'reference_number' => $this->generateReference($paymentMethods[array_rand($paymentMethods)], $i),
                'project_id' => rand(0, 1) ? rand(1, 10) : null,
                'vendor_supplier' => $type === 'expense' ? $this->getRandomVendor($category) : null,
                'notes' => $this->generateNotes($category, $type),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function getSubcategory($category)
    {
        $subcategories = [
            'Property Sales' => ['Apartment Sale', 'Commercial Space', 'Villa Sale', 'Plot Sale'],
            'Construction' => ['Materials', 'Labor', 'Equipment', 'Contractor Payment'],
            'Administrative' => ['Salary', 'Office Rent', 'Utilities', 'Insurance'],
            'Booking Money' => ['Advance Payment', 'Token Money', 'Registration Fee'],
            'Marketing' => ['Advertisement', 'Events', 'Brochures', 'Website'],
            'Legal' => ['Legal Fees', 'Registration', 'Documentation', 'Consultation'],
        ];

        return isset($subcategories[$category]) ?
               $subcategories[$category][array_rand($subcategories[$category])] :
               'General';
    }

    private function generateDescription($category, $type)
    {
        $descriptions = [
            'Property Sales' => 'Sale of residential/commercial property unit',
            'Construction' => 'Construction materials and services for ongoing projects',
            'Administrative' => 'Administrative expenses for office operations',
            'Booking Money' => 'Customer booking amount for property reservation',
            'Marketing' => 'Marketing and promotional activities',
            'Legal' => 'Legal services and documentation fees',
        ];

        return $descriptions[$category] ?? ucfirst($type) . ' transaction for ' . strtolower($category);
    }

    private function generateReference($paymentMethod, $id)
    {
        $prefixes = [
            'cash' => 'CSH',
            'bank_transfer' => 'BT',
            'check' => 'CHK',
            'online' => 'ON',
        ];

        return $prefixes[$paymentMethod] . '-' . str_pad($id, 3, '0', STR_PAD_LEFT);
    }

    private function getRandomVendor($category)
    {
        $vendors = [
            'Construction' => ['LafargeHolcim Bangladesh', 'BSRM Steel', 'Akij Cement', 'Shah Cement'],
            'Administrative' => ['Employee Payroll', 'Office Supplies Ltd', 'Utility Company', 'Insurance Corp'],
            'Marketing' => ['Digital Marketing Agency', 'Print Media House', 'Event Management Co'],
            'Legal' => ['Law Associates', 'Legal Consultancy', 'Documentation Services'],
        ];

        return isset($vendors[$category]) ?
               $vendors[$category][array_rand($vendors[$category])] :
               'Various Vendors';
    }

    private function generateNotes($category, $type)
    {
        return ucfirst($type) . ' transaction for ' . strtolower($category) . ' related activities';
    }
}
