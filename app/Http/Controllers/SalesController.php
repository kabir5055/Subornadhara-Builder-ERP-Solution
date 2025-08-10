<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Client;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sales = Sale::with(['client', 'project'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Sales/Index', [
            'sales' => $sales
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $clients = Client::select('id', 'name', 'phone')->get();
        $projects = Project::select('id', 'name', 'location')->get();

        return Inertia::render('Sales/Create', [
            'clients' => $clients,
            'projects' => $projects
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'project_id' => 'required|exists:projects,id',
            'unit_number' => 'required|string|max:255',
            'unit_type' => 'required|string|max:255',
            'unit_size' => 'required|numeric|min:0',
            'price_per_sqft' => 'required|numeric|min:0',
            'total_price' => 'required|numeric|min:0',
            'booking_money' => 'required|numeric|min:0',
            'paid_amount' => 'required|numeric|min:0',
            'booking_date' => 'required|date',
            'handover_date' => 'required|date|after:booking_date',
            'notes' => 'nullable|string'
        ]);

        $validated['due_amount'] = $validated['total_price'] - $validated['paid_amount'];
        $validated['payment_status'] = $this->calculatePaymentStatus($validated['paid_amount'], $validated['total_price']);
        $validated['status'] = 'booked';

        Sale::create($validated);

        return redirect()->route('sales.index')->with('success', 'Sale created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale)
    {
        $sale->load(['client', 'project', 'payments']);

        return Inertia::render('Sales/Show', [
            'sale' => $sale
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sale $sale)
    {
        $clients = Client::select('id', 'name', 'phone')->get();
        $projects = Project::select('id', 'name', 'location')->get();

        return Inertia::render('Sales/Edit', [
            'sale' => $sale,
            'clients' => $clients,
            'projects' => $projects
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sale $sale)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'project_id' => 'required|exists:projects,id',
            'unit_number' => 'required|string|max:255',
            'unit_type' => 'required|string|max:255',
            'unit_size' => 'required|numeric|min:0',
            'price_per_sqft' => 'required|numeric|min:0',
            'total_price' => 'required|numeric|min:0',
            'booking_money' => 'required|numeric|min:0',
            'paid_amount' => 'required|numeric|min:0',
            'booking_date' => 'required|date',
            'handover_date' => 'required|date|after:booking_date',
            'status' => 'required|in:booked,sold,cancelled',
            'notes' => 'nullable|string'
        ]);

        $validated['due_amount'] = $validated['total_price'] - $validated['paid_amount'];
        $validated['payment_status'] = $this->calculatePaymentStatus($validated['paid_amount'], $validated['total_price']);

        $sale->update($validated);

        return redirect()->route('sales.index')->with('success', 'Sale updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sale $sale)
    {
        $sale->delete();

        return redirect()->route('sales.index')->with('success', 'Sale deleted successfully.');
    }

    /**
     * Calculate payment status based on paid amount and total price
     */
    private function calculatePaymentStatus($paidAmount, $totalPrice)
    {
        if ($paidAmount >= $totalPrice) {
            return 'paid';
        } elseif ($paidAmount > 0) {
            return 'partial';
        }
        return 'pending';
    }

    /**
     * Get sales statistics for dashboard
     */
    public function getStats()
    {
        return [
            'total_sales' => Sale::count(),
            'total_revenue' => Sale::sum('total_price'),
            'pending_payments' => Sale::where('payment_status', '!=', 'paid')->sum('due_amount'),
            'this_month_sales' => Sale::whereMonth('created_at', now()->month)->count()
        ];
    }
}
