<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use App\Exports\GenericReportExport;
use App\Imports\GenericTableImport;

class ModuleActionController extends Controller
{
    private array $tableMap = [
        'projects' => 'projects',
        'clients' => 'clients',
        'sales' => 'sales',
        'finance' => 'finance_transactions',
        'employees' => 'employees',
        'inventory' => 'inventory_items',
        'attendance' => 'attendances',
        'salaries' => 'salaries',
    ];

    private function resolve(string $module): ?string
    {
        return $this->tableMap[$module] ?? null;
    }

    public function export(Request $request)
    {
        $module = $request->segment(1);
        $table = $this->resolve($module);
        if (!$table) return back()->with('error', 'Unknown module: '.$module);

        $actualColumns = Schema::hasTable($table) ? Schema::getColumnListing($table) : [];
        if (empty($actualColumns)) return back()->with('error', 'Table not found: '.$table);

        // Optional: filter columns via ?columns=a,b,c
        $requested = array_values(array_filter(array_map('trim', explode(',', (string) $request->query('columns')))));
        $headings = $requested ? array_values(array_intersect($requested, $actualColumns)) : array_slice($actualColumns, 0, 10);
        if (empty($headings)) $headings = array_slice($actualColumns, 0, 10);

        $dateColumn = $request->query('date_column', 'created_at');
        if (!in_array($dateColumn, $actualColumns, true)) {
            $dateColumn = null;
        }

        $sortBy = $request->query('sort_by');
        $sortDir = strtolower($request->query('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';
        if ($sortBy && !in_array($sortBy, $actualColumns, true)) {
            $sortBy = null;
        }

        $limit = (int) $request->query('limit', 100);
        if ($limit <= 0) $limit = 100;

        $query = DB::table($table)->select($headings);
        if ($dateColumn) {
            if ($request->filled('date_from')) {
                $query->whereDate($dateColumn, '>=', $request->query('date_from'));
            }
            if ($request->filled('date_to')) {
                $query->whereDate($dateColumn, '<=', $request->query('date_to'));
            }
        }
        if ($sortBy) {
            $query->orderBy($sortBy, $sortDir);
        }
        $rows = $query->limit($limit)->get()->map(fn($row) => (array) $row)->toArray();

        $export = new GenericReportExport($request->query('title', Str::headline($module).' Export'), $headings, $rows);

        $format = strtolower((string) $request->query('format', 'xlsx'));
        $writerType = \Maatwebsite\Excel\Excel::XLSX;
        $ext = 'xlsx';
        if ($format === 'csv') {
            $writerType = \Maatwebsite\Excel\Excel::CSV;
            $ext = 'csv';
        }

        $filename = $request->query('filename') ?: ($module.'-export-'.now()->format('Ymd_His').'.'.$ext);
        return Excel::download($export, $filename, $writerType);
    }

    public function pdf(Request $request)
    {
        $module = $request->segment(1);
        $table = $this->resolve($module);
        if (!$table) return back()->with('error', 'Unknown module: '.$module);

        $columns = Schema::hasTable($table) ? Schema::getColumnListing($table) : [];
        if (empty($columns)) return back()->with('error', 'Table not found: '.$table);

        // Columns selection similar to export
        $requested = array_values(array_filter(array_map('trim', explode(',', (string) $request->query('columns')))));
        $headings = $requested ? array_values(array_intersect($requested, $columns)) : array_slice($columns, 0, 8);
        if (empty($headings)) $headings = array_slice($columns, 0, 8);

        $dateColumn = $request->query('date_column', 'created_at');
        if (!in_array($dateColumn, $columns, true)) {
            $dateColumn = null;
        }

        $sortBy = $request->query('sort_by');
        $sortDir = strtolower($request->query('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';
        if ($sortBy && !in_array($sortBy, $columns, true)) {
            $sortBy = null;
        }

        $limit = (int) $request->query('limit', 100);
        if ($limit <= 0) $limit = 100;

        $query = DB::table($table)->select($headings);
        if ($dateColumn) {
            if ($request->filled('date_from')) {
                $query->whereDate($dateColumn, '>=', $request->query('date_from'));
            }
            if ($request->filled('date_to')) {
                $query->whereDate($dateColumn, '<=', $request->query('date_to'));
            }
        }
        if ($sortBy) {
            $query->orderBy($sortBy, $sortDir);
        }
        $rows = $query->limit($limit)->get($headings)->toArray();

        $paper = strtolower((string) $request->query('paper', 'a4'));
        $orientation = strtolower((string) $request->query('orientation', 'portrait')) === 'landscape' ? 'landscape' : 'portrait';

        $title = $request->query('title', Str::headline($module).' PDF');
        $pdf = PDF::loadView('pdf.generic', [
            'title' => $title,
            'columns' => $headings,
            'rows' => $rows,
            'generatedAt' => now(),
        ])->setPaper($paper, $orientation);

        $filename = $request->query('filename') ?: ($module.'-report-'.now()->format('Ymd_His').'.pdf');
        return $pdf->download($filename);
    }

    public function import(Request $request)
    {
        $module = $request->segment(1);
        $table = $this->resolve($module);
        if (!$table) return back()->with('error', 'Unknown module: '.$module);

        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv,txt|max:10240',
        ]);

        try {
            Excel::import(new GenericTableImport($table), $request->file('file'));
            return back()->with('success', Str::headline($module).' imported successfully');
        } catch (\Throwable $e) {
            return back()->with('error', 'Import failed: '.$e->getMessage());
        }
    }
}
