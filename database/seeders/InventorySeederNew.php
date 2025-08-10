<?php

namespace Database\Seeders;

use App\Models\InventoryItem;
use Illuminate\Database\Seeder;

class InventorySeederNew extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $inventoryItems = [
            // Construction Materials
            ['name' => 'Cement Bags (50kg)', 'code' => 'CEM-001', 'category' => 'Construction Materials', 'unit' => 'bags', 'current_stock' => 500, 'minimum_stock' => 100, 'unit_price' => 450, 'location' => 'Warehouse A'],
            ['name' => 'Steel Rods (12mm)', 'code' => 'STL-001', 'category' => 'Construction Materials', 'unit' => 'pieces', 'current_stock' => 200, 'minimum_stock' => 50, 'unit_price' => 850, 'location' => 'Warehouse A'],
            ['name' => 'Bricks (First Class)', 'code' => 'BRK-001', 'category' => 'Construction Materials', 'unit' => 'pieces', 'current_stock' => 10000, 'minimum_stock' => 2000, 'unit_price' => 12, 'location' => 'Yard 1'],
            ['name' => 'Sand (CFT)', 'code' => 'SND-001', 'category' => 'Construction Materials', 'unit' => 'cft', 'current_stock' => 1000, 'minimum_stock' => 200, 'unit_price' => 35, 'location' => 'Yard 2'],
            ['name' => 'Stone Chips', 'code' => 'STC-001', 'category' => 'Construction Materials', 'unit' => 'cft', 'current_stock' => 800, 'minimum_stock' => 150, 'unit_price' => 45, 'location' => 'Yard 2'],

            // Electrical Items
            ['name' => 'Electrical Wire (2.5mm)', 'code' => 'ELW-001', 'category' => 'Electrical', 'unit' => 'meter', 'current_stock' => 2000, 'minimum_stock' => 500, 'unit_price' => 25, 'location' => 'Warehouse B'],
            ['name' => 'Switch Boards', 'code' => 'SWB-001', 'category' => 'Electrical', 'unit' => 'pieces', 'current_stock' => 100, 'minimum_stock' => 20, 'unit_price' => 350, 'location' => 'Warehouse B'],
            ['name' => 'LED Bulbs (12W)', 'code' => 'LED-001', 'category' => 'Electrical', 'unit' => 'pieces', 'current_stock' => 200, 'minimum_stock' => 50, 'unit_price' => 180, 'location' => 'Warehouse B'],
            ['name' => 'Ceiling Fans', 'code' => 'FAN-001', 'category' => 'Electrical', 'unit' => 'pieces', 'current_stock' => 80, 'minimum_stock' => 20, 'unit_price' => 2500, 'location' => 'Warehouse B'],
            ['name' => 'MCB Breakers', 'code' => 'MCB-001', 'category' => 'Electrical', 'unit' => 'pieces', 'current_stock' => 150, 'minimum_stock' => 30, 'unit_price' => 450, 'location' => 'Warehouse B'],

            // Plumbing Items
            ['name' => 'PVC Pipes (4 inch)', 'code' => 'PVC-001', 'category' => 'Plumbing', 'unit' => 'pieces', 'current_stock' => 300, 'minimum_stock' => 75, 'unit_price' => 380, 'location' => 'Warehouse C'],
            ['name' => 'Water Tanks (500L)', 'code' => 'TAN-001', 'category' => 'Plumbing', 'unit' => 'pieces', 'current_stock' => 25, 'minimum_stock' => 5, 'unit_price' => 8500, 'location' => 'Warehouse C'],
            ['name' => 'Bathroom Fittings Set', 'code' => 'BTH-001', 'category' => 'Plumbing', 'unit' => 'sets', 'current_stock' => 40, 'minimum_stock' => 10, 'unit_price' => 12000, 'location' => 'Warehouse C'],
            ['name' => 'Kitchen Sink', 'code' => 'KTC-001', 'category' => 'Plumbing', 'unit' => 'pieces', 'current_stock' => 35, 'minimum_stock' => 8, 'unit_price' => 4500, 'location' => 'Warehouse C'],

            // Finishing Materials
            ['name' => 'Tiles (2x2 ft)', 'code' => 'TIL-001', 'category' => 'Finishing', 'unit' => 'pieces', 'current_stock' => 5000, 'minimum_stock' => 1000, 'unit_price' => 85, 'location' => 'Warehouse D'],
            ['name' => 'Paint (Interior)', 'code' => 'PNT-001', 'category' => 'Finishing', 'unit' => 'liter', 'current_stock' => 200, 'minimum_stock' => 50, 'unit_price' => 320, 'location' => 'Warehouse D'],
            ['name' => 'Doors (Wooden)', 'code' => 'DOR-001', 'category' => 'Finishing', 'unit' => 'pieces', 'current_stock' => 60, 'minimum_stock' => 15, 'unit_price' => 15000, 'location' => 'Warehouse D'],
            ['name' => 'Windows (Aluminum)', 'code' => 'WIN-001', 'category' => 'Finishing', 'unit' => 'pieces', 'current_stock' => 80, 'minimum_stock' => 20, 'unit_price' => 8500, 'location' => 'Warehouse D'],
            ['name' => 'Grills (Iron)', 'code' => 'GRL-001', 'category' => 'Finishing', 'unit' => 'sqft', 'current_stock' => 1000, 'minimum_stock' => 200, 'unit_price' => 120, 'location' => 'Warehouse D'],

            // Tools & Equipment
            ['name' => 'Drilling Machine', 'code' => 'DRL-001', 'category' => 'Tools', 'unit' => 'pieces', 'current_stock' => 10, 'minimum_stock' => 2, 'unit_price' => 15000, 'location' => 'Tool Room'],
            ['name' => 'Measuring Tape', 'code' => 'MST-001', 'category' => 'Tools', 'unit' => 'pieces', 'current_stock' => 25, 'minimum_stock' => 5, 'unit_price' => 350, 'location' => 'Tool Room'],
            ['name' => 'Safety Helmets', 'code' => 'SFH-001', 'category' => 'Safety Equipment', 'unit' => 'pieces', 'current_stock' => 100, 'minimum_stock' => 25, 'unit_price' => 250, 'location' => 'Safety Store'],
            ['name' => 'Safety Gloves', 'code' => 'SFG-001', 'category' => 'Safety Equipment', 'unit' => 'pairs', 'current_stock' => 150, 'minimum_stock' => 40, 'unit_price' => 80, 'location' => 'Safety Store'],
        ];

        foreach ($inventoryItems as $item) {
            InventoryItem::create([
                'name' => $item['name'],
                'code' => $item['code'],
                'category' => $item['category'],
                'unit' => $item['unit'],
                'current_stock' => $item['current_stock'],
                'minimum_stock' => $item['minimum_stock'],
                'unit_price' => $item['unit_price'],
                'total_value' => $item['current_stock'] * $item['unit_price'],
                'status' => $item['current_stock'] > $item['minimum_stock'] ? 'active' : 'active', // All active for now
                'location' => $item['location'],
                'description' => 'Construction inventory item for ' . $item['category'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('Inventory items seeded successfully!');
    }
}
