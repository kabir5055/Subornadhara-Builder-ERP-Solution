<?php

namespace Database\Seeders;

use App\Models\FinanceTransaction;
use App\Models\Project;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class FinanceTransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = Project::all();

        // Generate income transactions (from property sales, bookings)
        $incomeTransactions = [
            ['description' => 'Property Sale Commission - Unit SH-101', 'amount' => 150000, 'type' => 'income', 'category' => 'Sales Commission', 'subcategory' => 'Commission'],
            ['description' => 'Booking Money Received - Unit GC-205', 'amount' => 200000, 'type' => 'income', 'category' => 'Booking', 'subcategory' => 'Advance'],
            ['description' => 'Installment Payment - Unit DG-302', 'amount' => 300000, 'type' => 'income', 'category' => 'Installment', 'subcategory' => 'Monthly'],
            ['description' => 'Registration Fee Collection', 'amount' => 50000, 'type' => 'income', 'category' => 'Service Fee', 'subcategory' => 'Registration'],
            ['description' => 'Property Transfer Fee', 'amount' => 75000, 'type' => 'income', 'category' => 'Service Fee', 'subcategory' => 'Transfer'],
            ['description' => 'Utility Connection Charge', 'amount' => 25000, 'type' => 'income', 'category' => 'Service Fee', 'subcategory' => 'Utility'],
            ['description' => 'Maintenance Fee Collection', 'amount' => 120000, 'type' => 'income', 'category' => 'Maintenance', 'subcategory' => 'Monthly'],
            ['description' => 'Late Payment Penalty', 'amount' => 15000, 'type' => 'income', 'category' => 'Penalty', 'subcategory' => 'Late Fee'],
        ];

        // Generate expense transactions (construction, operational, administrative)
        $expenseTransactions = [
            ['description' => 'Construction Material Purchase - Cement', 'amount' => 225000, 'type' => 'expense', 'category' => 'Construction', 'subcategory' => 'Materials', 'vendor' => 'Bengal Cement Industries Ltd.'],
            ['description' => 'Labor Payment - Site Work', 'amount' => 180000, 'type' => 'expense', 'category' => 'Labor', 'subcategory' => 'Construction', 'vendor' => 'Construction Workers Union'],
            ['description' => 'Office Rent Payment', 'amount' => 35000, 'type' => 'expense', 'category' => 'Administrative', 'subcategory' => 'Rent', 'vendor' => 'Building Owner'],
            ['description' => 'Utility Bills - Electricity', 'amount' => 12000, 'type' => 'expense', 'category' => 'Utilities', 'subcategory' => 'Electricity', 'vendor' => 'DESCO'],
            ['description' => 'Marketing & Advertisement', 'amount' => 45000, 'type' => 'expense', 'category' => 'Marketing', 'subcategory' => 'Advertisement', 'vendor' => 'Media Agency'],
            ['description' => 'Legal Documentation Fee', 'amount' => 28000, 'type' => 'expense', 'category' => 'Legal', 'subcategory' => 'Documentation', 'vendor' => 'Law Firm'],
            ['description' => 'Equipment Rental', 'amount' => 55000, 'type' => 'expense', 'category' => 'Equipment', 'subcategory' => 'Rental', 'vendor' => 'Equipment Rental Co.'],
            ['description' => 'Insurance Premium', 'amount' => 22000, 'type' => 'expense', 'category' => 'Insurance', 'subcategory' => 'Premium', 'vendor' => 'Insurance Company'],
            ['description' => 'Bank Service Charges', 'amount' => 3500, 'type' => 'expense', 'category' => 'Banking', 'subcategory' => 'Service Charge', 'vendor' => 'Bank'],
            ['description' => 'Staff Salary Payment', 'amount' => 250000, 'type' => 'expense', 'category' => 'Salary', 'subcategory' => 'Monthly', 'vendor' => 'HR Department'],
            ['description' => 'Transportation Cost', 'amount' => 18000, 'type' => 'expense', 'category' => 'Transportation', 'subcategory' => 'Vehicle', 'vendor' => 'Transport Service'],
            ['description' => 'Security Service Payment', 'amount' => 32000, 'type' => 'expense', 'category' => 'Security', 'subcategory' => 'Guard', 'vendor' => 'Security Agency'],
        ];

        // Create income transactions
        $counter = 1;
        foreach ($incomeTransactions as $transaction) {
            FinanceTransaction::create([
                'transaction_id' => 'INC-' . str_pad($counter, 4, '0', STR_PAD_LEFT),
                'transaction_date' => Carbon::now()->subDays(rand(1, 180)),
                'description' => $transaction['description'],
                'amount' => $transaction['amount'],
                'type' => $transaction['type'],
                'category' => $transaction['category'],
                'subcategory' => $transaction['subcategory'],
                'project_id' => $projects->random()->id,
                'reference_number' => 'REF-INC-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT),
                'payment_method' => ['cash', 'bank_transfer', 'check', 'online'][rand(0, 3)],
                'vendor_supplier' => null,
                'notes' => 'Income transaction for ' . $transaction['category'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $counter++;
        }

        // Create expense transactions
        foreach ($expenseTransactions as $transaction) {
            FinanceTransaction::create([
                'transaction_id' => 'EXP-' . str_pad($counter, 4, '0', STR_PAD_LEFT),
                'transaction_date' => Carbon::now()->subDays(rand(1, 180)),
                'description' => $transaction['description'],
                'amount' => $transaction['amount'],
                'type' => $transaction['type'],
                'category' => $transaction['category'],
                'subcategory' => $transaction['subcategory'],
                'project_id' => $projects->random()->id,
                'reference_number' => 'REF-EXP-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT),
                'payment_method' => ['cash', 'bank_transfer', 'check', 'online'][rand(0, 3)],
                'vendor_supplier' => $transaction['vendor'],
                'notes' => 'Expense transaction for ' . $transaction['category'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $counter++;
        }

        // Generate additional random transactions
        for ($i = 1; $i <= 30; $i++) {
            $isIncome = rand(1, 10) <= 4; // 40% income, 60% expense
            $categories = $isIncome
                ? ['Sales Commission', 'Booking', 'Installment', 'Service Fee', 'Rental Income']
                : ['Construction', 'Labor', 'Administrative', 'Utilities', 'Marketing', 'Legal'];

            $subcategories = $isIncome
                ? ['Commission', 'Advance', 'Monthly', 'Registration', 'Transfer']
                : ['Materials', 'Construction', 'Rent', 'Bills', 'Advertisement', 'Documentation'];

            FinanceTransaction::create([
                'transaction_id' => ($isIncome ? 'INC-' : 'EXP-') . str_pad($counter, 4, '0', STR_PAD_LEFT),
                'transaction_date' => Carbon::now()->subDays(rand(1, 365)),
                'description' => ($isIncome ? 'Income from ' : 'Payment for ') . $categories[array_rand($categories)],
                'amount' => rand(5000, 200000),
                'type' => $isIncome ? 'income' : 'expense',
                'category' => $categories[array_rand($categories)],
                'subcategory' => $subcategories[array_rand($subcategories)],
                'project_id' => $projects->random()->id,
                'reference_number' => 'REF-' . ($isIncome ? 'INC-' : 'EXP-') . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT),
                'payment_method' => ['cash', 'bank_transfer', 'check', 'online'][rand(0, 3)],
                'vendor_supplier' => !$isIncome ? 'Vendor-' . rand(100, 999) : null,
                'notes' => 'Auto-generated transaction',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $counter++;
        }

        $this->command->info('Finance transactions seeded successfully!');
    }
}
