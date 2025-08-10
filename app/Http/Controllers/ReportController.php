<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\GenericReportExport;

class ReportController extends Controller
{
    /**
     * Show reports landing page
     */
    public function index()
    {
        return Inertia::render('Reports/Index', [
            'filters' => [
                'type' => request('type'),
            ],
        ]);
    }

    /**
     * Generate a report (stub)
     */
    public function generate(Request $request)
    {
        // Validate minimal input and redirect back with a flash
        $request->validate([
            'type' => 'required|string',
        ]);

        return back()->with('success', 'Report generation started for: ' . $request->input('type'));
    }

    /**
     * Export a report (stub)
     */
    public function export(string $type)
    {
        // Map report types to DB tables and headings (basic demo)
        $map = [
            'hr' => ['table' => 'employees', 'headings' => ['id','name','email','phone','department_id','created_at']],
            'sales' => ['table' => 'sales', 'headings' => ['id','client_id','project_id','amount','status','created_at']],
            'finance' => ['table' => 'finance_transactions', 'headings' => ['id','type','amount','reference','created_at']],
            'inventory' => ['table' => 'inventory_items', 'headings' => ['id','name','sku','stock','created_at']],
            'projects' => ['table' => 'projects', 'headings' => ['id','name','status','created_at']],
        ];

        if (!isset($map[$type])) {
            return back()->with('error', 'Unknown report type: '.$type);
        }

    $table = $map[$type]['table'];
    $preferredHeadings = $map[$type]['headings'];

        try {
            // Align headings to actual columns to avoid SQL errors
            $actualColumns = Schema::hasTable($table) ? Schema::getColumnListing($table) : [];
            if (empty($actualColumns)) {
                return back()->with('error', 'Export failed: table not found or has no columns');
            }
            $headings = array_values(array_intersect($preferredHeadings, $actualColumns));
            if (empty($headings)) {
                // Fallback: first N columns
                $headings = array_slice($actualColumns, 0, 6);
            }

            // Pull first 100 rows for demo; adjust as needed
            $rows = DB::table($table)->limit(100)->get($headings)->map(function ($row) {
                return (array) $row;
            })->toArray();

            $export = new GenericReportExport(ucfirst($type).' Report', $headings, $rows);
            $filename = $type.'-report-'.now()->format('Ymd_His').'.xlsx';
            return Excel::download($export, $filename);
        } catch (\Throwable $e) {
            return back()->with('error', 'Export failed: '.$e->getMessage());
        }
    }
}
