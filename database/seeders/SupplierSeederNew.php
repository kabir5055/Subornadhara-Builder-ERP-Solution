<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeederNew extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suppliers = [
            [
                'name' => 'Bengal Cement Industries Ltd.',
                'company_name' => 'Bengal Cement Industries Ltd.',
                'contact_person' => 'Md. Rahman Ahmed',
                'phone' => '01711-123456',
                'email' => 'info@bengalcement.com',
                'address' => 'Munshiganj Industrial Area, Dhaka',
                'type' => 'material',
                'credit_limit' => 500000,
                'status' => 'active',
                'notes' => 'Cement and concrete blocks supplier',
            ],
            [
                'name' => 'Akij Steel Mills Ltd.',
                'company_name' => 'Akij Steel Mills Ltd.',
                'contact_person' => 'Engr. Kamal Hossain',
                'phone' => '01812-987654',
                'email' => 'supply@akijsteel.com',
                'address' => 'Chittagong Steel Mills Area',
                'type' => 'material',
                'credit_limit' => 1000000,
                'status' => 'active',
                'notes' => 'Steel rods, sheets, and TMT bars supplier',
            ],
            [
                'name' => 'Desh Brick Works',
                'company_name' => 'Desh Brick Works',
                'contact_person' => 'Abdul Majid Khan',
                'phone' => '01923-456789',
                'email' => 'orders@deshbrick.com',
                'address' => 'Savar Brick Field, Dhaka',
                'type' => 'material',
                'credit_limit' => 300000,
                'status' => 'active',
                'notes' => 'First class bricks manufacturer',
            ],
            [
                'name' => 'Walton Electronics',
                'company_name' => 'Walton Hi-Tech Industries PLC',
                'contact_person' => 'Mohammad Shahin',
                'phone' => '01734-567890',
                'email' => 'corporate@waltonbd.com',
                'address' => 'Chandra, Gazipur',
                'type' => 'equipment',
                'credit_limit' => 750000,
                'status' => 'active',
                'notes' => 'Electrical equipment and appliances',
            ],
            [
                'name' => 'RFL Plastics Ltd.',
                'company_name' => 'RFL Plastics Ltd.',
                'contact_person' => 'Aminur Rahman',
                'phone' => '01845-678901',
                'email' => 'sales@rflbd.com',
                'address' => 'Dhamrai, Dhaka',
                'type' => 'material',
                'credit_limit' => 400000,
                'status' => 'active',
                'notes' => 'PVC pipes and plastic products',
            ],
            [
                'name' => 'Fresh Tiles Gallery',
                'company_name' => 'Fresh Tiles Gallery',
                'contact_person' => 'Rafiqul Islam',
                'phone' => '01756-789012',
                'email' => 'info@freshtiles.com',
                'address' => 'Elephant Road, Dhaka',
                'type' => 'material',
                'credit_limit' => 200000,
                'status' => 'active',
                'notes' => 'Ceramic and porcelain tiles',
            ],
            [
                'name' => 'Premium Paint House',
                'company_name' => 'Premium Paint House',
                'contact_person' => 'Aminul Haque',
                'phone' => '01687-234567',
                'email' => 'sales@premiumpaint.com',
                'address' => 'Dhanmondi Commercial Area, Dhaka',
                'type' => 'material',
                'credit_limit' => 150000,
                'status' => 'active',
                'notes' => 'Interior and exterior paint supplier',
            ],
            [
                'name' => 'Master Tools & Equipment',
                'company_name' => 'Master Tools & Equipment',
                'contact_person' => 'Jalal Miah',
                'phone' => '01798-345678',
                'email' => 'info@mastertools.com',
                'address' => 'Purana Paltan, Dhaka',
                'type' => 'equipment',
                'credit_limit' => 100000,
                'status' => 'active',
                'notes' => 'Construction tools and safety equipment',
            ],
            [
                'name' => 'Sand & Stone Suppliers Co.',
                'company_name' => 'Sand & Stone Suppliers Co.',
                'contact_person' => 'Billal Hossain',
                'phone' => '01856-456789',
                'email' => 'supply@sandstone.com',
                'address' => 'Sylhet Stone Quarry Area',
                'type' => 'material',
                'credit_limit' => 250000,
                'status' => 'active',
                'notes' => 'Stone chips and sand supplier',
            ],
            [
                'name' => 'Door & Window Craft',
                'company_name' => 'Door & Window Craft',
                'contact_person' => 'Nurul Amin',
                'phone' => '01967-567890',
                'email' => 'orders@doorwindowcraft.com',
                'address' => 'Keraniganj Furniture Hub, Dhaka',
                'type' => 'material',
                'credit_limit' => 350000,
                'status' => 'active',
                'notes' => 'Wooden doors, aluminum windows, iron grills',
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::create($supplier);
        }

        $this->command->info('Suppliers seeded successfully!');
    }
}
