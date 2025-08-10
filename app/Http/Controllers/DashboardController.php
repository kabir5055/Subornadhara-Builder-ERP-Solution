<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Client;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\FinanceTransaction;
use App\Models\Sale;
use App\Models\InventoryItem;
use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Support\Facades\Schema;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_projects'   => Project::count(),
            'active_projects'  => Project::where('status', 'ongoing')->count(),
            'total_clients'    => Client::count(),
            'active_clients'   => Client::where('status', 'active')->count(),
            'total_bookings'   => Booking::count(),
            'total_revenue'    => Payment::sum('amount'),
            'pending_payments' => Booking::where('payment_status', 'pending')->sum('due_amount'),
            'sold_units'       => Project::sum('sold_units'),
            'available_units'  => Project::sum('total_units') - Project::sum('sold_units'),
            'total_employees'  => Employee::where('status', 'active')->count(),
        ];

        // Chart data for monthly sales
        $monthlySales = Booking::selectRaw('MONTH(created_at) as month, COUNT(*) as count, SUM(total_amount) as revenue')
            ->whereYear('created_at', date('Y'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Income vs Expense monthly
        $incomeExpense = FinanceTransaction::selectRaw('MONTH(transaction_date) as month, type, SUM(amount) as total')
            ->whereYear('transaction_date', date('Y'))
            ->groupBy('month', 'type')
            ->orderBy('month')
            ->get()
            ->groupBy('month')
            ->map(function ($rows, $month) {
                return [
                    'month'   => (int) $month,
                    'income'  => (float) ($rows->firstWhere('type', 'income')->total ?? 0),
                    'expense' => (float) ($rows->firstWhere('type', 'expense')->total ?? 0),
                ];
            })
            ->values();

        // Unsold units by project (top 7)
        $unsoldByProject = Project::select('id', 'name', 'total_units', 'sold_units')
            ->get()
            ->map(function ($p) {
                $available = max(($p->total_units ?? 0) - ($p->sold_units ?? 0), 0);
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'available_units' => $available,
                    'sold_units' => (int) ($p->sold_units ?? 0),
                ];
            })
            ->sortByDesc('available_units')
            ->take(7)
            ->values();

        // Recent activities - bookings
    $recentBookings = Booking::with(['client', 'project'])
            ->latest()
            ->take(10)
            ->get();

        // Top projects by sales
        $topProjects = Project::orderBy('sold_units', 'desc')
            ->take(5)
            ->get();

        $salesCount = Schema::hasTable('sales') ? (int) (Sale::count()) : 0;

        $moduleSummary = [
            'Projects'   => (int) $stats['total_projects'],
            'Clients'    => (int) $stats['total_clients'],
            'Bookings'   => (int) $stats['total_bookings'],
            'Sales'      => $salesCount,
            'Finance Tx' => (int) (FinanceTransaction::count()),
            'Inventory'  => (int) (InventoryItem::count()),
            'Employees'  => (int) $stats['total_employees'],
            'Attendance' => (int) (Attendance::count()),
        ];

        // Project status distribution
        $projectStatusSummary = Project::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        // Today's attendance summary
        $today = now()->toDateString();
        $totalEmployees = (int) Employee::where('status', 'active')->count();
        $todayRecords = Attendance::with(['employee.department'])
            ->where('date', $today)
            ->get();

        $present = (int) $todayRecords->where('status', 'present')->count();
        $late = (int) $todayRecords->where('is_late', true)->count();
        $absent = max($totalEmployees - $present, 0);

        $latestCheckins = $todayRecords
            ->filter(fn($a) => !empty($a->check_in))
            ->sortByDesc('check_in')
            ->take(8)
            ->values()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'employee' => [
                        'name' => $a->employee->name ?? 'N/A',
                        'department' => $a->employee->department->name ?? null,
                    ],
                    'check_in' => optional($a->check_in)->toDateTimeString(),
                    'check_out' => optional($a->check_out)->toDateTimeString(),
                    'status' => $a->status,
                    'is_late' => (bool) $a->is_late,
                    'total_hours' => (float) ($a->total_hours ?? 0),
                ];
            });

        return Inertia::render('Dashboard/Index', [
            'stats' => $stats,
            'monthlySales' => $monthlySales,
            'recentBookings' => $recentBookings,
            'topProjects' => $topProjects,
            'incomeExpense' => $incomeExpense,
            'unsoldByProject' => $unsoldByProject,
            'moduleSummary' => $moduleSummary,
            'projectStatusSummary' => $projectStatusSummary,
            'todayAttendance' => [
                'total' => $totalEmployees,
                'present' => $present,
                'absent' => $absent,
                'late' => $late,
                'details' => $latestCheckins,
            ],
        ]);
    }
}
