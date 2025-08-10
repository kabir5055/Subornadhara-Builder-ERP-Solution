<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class BookingInstallmentController extends Controller
{
    public function create(Booking $booking): Response
    {
        $defaultPlan = [
            ['label' => 'Down Payment', 'due_date' => Carbon::now()->addDays(7)->toDateString(), 'amount' => round($booking->total_amount * 0.2, 2)],
            ['label' => 'Installment 1', 'due_date' => Carbon::now()->addMonths(1)->toDateString(), 'amount' => round($booking->total_amount * 0.4, 2)],
            ['label' => 'Installment 2', 'due_date' => Carbon::now()->addMonths(2)->toDateString(), 'amount' => round($booking->total_amount * 0.4, 2)],
        ];
        return Inertia::render('Bookings/InstallmentsWizard', [
            'booking' => $booking->only(['id','project_id','client_id','unit_id','unit_number','total_amount','due_amount']),
            'suggestedPlan' => $defaultPlan,
        ]);
    }

    public function store(Request $request, Booking $booking)
    {
        $data = $request->validate([
            'schedule' => ['required','array','min:1'],
            'schedule.*.label' => ['required','string','max:100'],
            'schedule.*.due_date' => ['required','date'],
            'schedule.*.amount' => ['required','numeric','min:0'],
        ]);

        // Persist as pending payments
        foreach ($data['schedule'] as $item) {
            Payment::create([
                'booking_id' => $booking->id,
                'client_id' => $booking->client_id,
                'project_id' => $booking->project_id,
                'amount' => $item['amount'],
                'payment_date' => $item['due_date'],
                'payment_method' => 'online',
                'transaction_id' => null,
                'status' => 'pending',
                'notes' => $item['label'],
            ]);
        }

        return redirect()->route('dashboard')->with('success', 'Installment schedule saved.');
    }
}
