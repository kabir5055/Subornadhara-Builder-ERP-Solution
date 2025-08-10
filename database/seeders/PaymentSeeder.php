<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\Booking;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bookings = Booking::where('booking_status', 'confirmed')->get();

        if ($bookings->isEmpty()) {
            $this->command->warn('No confirmed bookings found. Please run BookingSeeder first.');
            return;
        }

        foreach ($bookings as $booking) {
            $remainingAmount = $booking->due_amount;
            $paymentCount = rand(1, 4); // Random installments

            // Create initial booking payment (already paid amount)
            if ($booking->paid_amount > 0) {
                Payment::create([
                    'booking_id' => $booking->id,
                    'amount' => $booking->paid_amount,
                    'payment_method' => ['cash', 'bank_transfer', 'check', 'online'][rand(0, 3)],
                    'payment_date' => $booking->booking_date,
                    'transaction_id' => 'TXN' . str_pad(rand(1, 999999), 6, '0', STR_PAD_LEFT),
                    'notes' => 'Initial booking payment',
                    'created_at' => $booking->booking_date,
                    'updated_at' => $booking->booking_date,
                ]);
            }

            // Create additional installment payments
            for ($i = 1; $i <= $paymentCount && $remainingAmount > 1000; $i++) {
                $paymentAmount = min($remainingAmount * 0.3, $remainingAmount); // Pay 30% or remaining
                $paymentDate = Carbon::parse($booking->booking_date)->addMonths($i);

                $paymentMethod = ['cash', 'bank_transfer', 'check', 'online'][rand(0, 3)];

                Payment::create([
                    'booking_id' => $booking->id,
                    'amount' => $paymentAmount,
                    'payment_method' => $paymentMethod,
                    'payment_date' => $paymentDate,
                    'transaction_id' => 'TXN' . str_pad(rand(1, 999999), 6, '0', STR_PAD_LEFT),
                    'bank_name' => $paymentMethod === 'bank_transfer' ? ['Dutch Bangla Bank', 'BRAC Bank', 'City Bank', 'Eastern Bank'][rand(0, 3)] : null,
                    'check_number' => $paymentMethod === 'check' ? 'CHK' . rand(100000, 999999) : null,
                    'notes' => 'Installment payment #' . $i,
                    'created_at' => $paymentDate,
                    'updated_at' => $paymentDate,
                ]);

                $remainingAmount -= $paymentAmount;
            }
        }

        $this->command->info('Payments seeded successfully!');
    }
}
