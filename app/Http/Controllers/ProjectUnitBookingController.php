<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Unit;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Reservation;
use Carbon\Carbon;
use App\Models\Client;

class ProjectUnitBookingController extends Controller
{
    public function availability(Project $project): Response
    {
        $floors = Unit::where('project_id', $project->id)
            ->select('floor')
            ->distinct()
            ->orderBy('floor')
            ->pluck('floor');

        $units = Unit::where('project_id', $project->id)
            ->orderBy('floor')
            ->orderBy('unit_number')
            ->get(['id','unit_number','floor','type','bedrooms','bathrooms','size_sqft','price','status']);

        $clients = Client::where('status', 'active')->orderBy('name')->get(['id','name']);

        return Inertia::render('Projects/Availability', [
            'project' => $project,
            'floors' => $floors,
            'units' => $units,
            'clients' => $clients,
        ]);
    }

    public function book(Request $request, Project $project, Unit $unit)
    {
        $data = $request->validate([
            'client_id' => ['required','exists:clients,id'],
            'booking_date' => ['required','date'],
            'notes' => ['nullable','string'],
        ]);

        if ($unit->project_id !== $project->id) {
            abort(404);
        }
        if ($unit->status !== 'available') {
            return back()->withErrors(['unit' => 'This unit is not available for booking.']);
        }

        $booking = null;
        DB::transaction(function () use ($project, $unit, $data, &$booking) {
            $booking = Booking::create([
                'project_id' => $project->id,
                'client_id' => $data['client_id'],
                'unit_id' => $unit->id,
                'unit_number' => $unit->unit_number,
                'unit_size' => $unit->size_sqft,
                'unit_price' => $unit->price,
                'total_amount' => $unit->price,
                'paid_amount' => 0,
                'due_amount' => $unit->price,
                'booking_date' => $data['booking_date'],
                'payment_status' => 'pending',
                'booking_status' => 'pending',
                'notes' => $data['notes'] ?? null,
            ]);

            $unit->update(['status' => 'booked']);
        });

        return redirect()->route('bookings.installments.create', $booking)->with('success', 'Unit booked successfully. Set up installments.');
    }

    public function reserve(Request $request, Project $project, Unit $unit)
    {
        $data = $request->validate([
            'client_id' => ['required','exists:clients,id'],
            'hours' => ['nullable','integer','min:1','max:168'],
            'notes' => ['nullable','string']
        ]);

        if ($unit->project_id !== $project->id) abort(404);
        if ($unit->status !== 'available') return back()->withErrors(['unit' => 'Unit is not available.']);

        $expires = Carbon::now()->addHours($data['hours'] ?? 24);
        DB::transaction(function () use ($project, $unit, $data, $expires) {
            Reservation::create([
                'unit_id' => $unit->id,
                'project_id' => $project->id,
                'client_id' => $data['client_id'],
                'reserved_at' => Carbon::now(),
                'expires_at' => $expires,
                'status' => 'active',
                'notes' => $data['notes'] ?? null,
            ]);
            $unit->update(['status' => 'reserved']);
        });

        return back()->with('success', 'Unit reserved successfully.');
    }

    public function unreserve(Request $request, Project $project, Unit $unit)
    {
        if ($unit->project_id !== $project->id) abort(404);
        DB::transaction(function () use ($unit) {
            Reservation::where('unit_id', $unit->id)->where('status', 'active')->update(['status' => 'cancelled']);
            $unit->update(['status' => 'available']);
        });
        return back()->with('success', 'Reservation cancelled.');
    }
}
