<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\SalaryController;
use App\Http\Controllers\Api\AttendanceIngestController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\ProjectUnitBookingController;
use App\Http\Controllers\BookingInstallmentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ModuleActionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    // Check if user is authenticated
    if (Auth::check()) {
        // User is authenticated, redirect to dashboard
        return redirect()->route('dashboard');
    }

    // User is not authenticated, redirect to login
    return redirect()->route('login');
});

// Dashboard Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Project Management
    Route::resource('projects', ProjectController::class);
    // Module actions (import/export/pdf) for projects
    Route::post('projects/import', [ModuleActionController::class, 'import'])->name('projects.import');
    Route::get('projects/export', [ModuleActionController::class, 'export'])->name('projects.export');
    Route::get('projects/pdf', [ModuleActionController::class, 'pdf'])->name('projects.pdf');
    // Project gallery
    Route::post('projects/{project}/images', [ProjectController::class, 'uploadImages'])->name('projects.images.upload');
    Route::delete('projects/{project}/images/{image}', [ProjectController::class, 'deleteImage'])->name('projects.images.delete');
    Route::post('projects/{project}/units', [ProjectController::class, 'addUnits'])->name('projects.units.store');
    // Project Units Availability & Booking
    Route::get('projects/{project}/availability', [ProjectUnitBookingController::class, 'availability'])->name('projects.availability');
    Route::post('projects/{project}/units/{unit}/book', [ProjectUnitBookingController::class, 'book'])->name('projects.units.book');
    Route::post('projects/{project}/units/{unit}/reserve', [ProjectUnitBookingController::class, 'reserve'])->name('projects.units.reserve');
    Route::post('projects/{project}/units/{unit}/unreserve', [ProjectUnitBookingController::class, 'unreserve'])->name('projects.units.unreserve');

    // Booking installments wizard
    Route::get('bookings/{booking}/installments/create', [BookingInstallmentController::class, 'create'])->name('bookings.installments.create');
    Route::post('bookings/{booking}/installments', [BookingInstallmentController::class, 'store'])->name('bookings.installments.store');

    // Client Management
    Route::resource('clients', ClientController::class);
    Route::post('clients/import', [ModuleActionController::class, 'import'])->name('clients.import');
    Route::get('clients/export', [ModuleActionController::class, 'export'])->name('clients.export');
    Route::get('clients/pdf', [ModuleActionController::class, 'pdf'])->name('clients.pdf');
    Route::post('clients/{client}/follow-up', [ClientController::class, 'addFollowUp'])->name('clients.follow-up');

    // Sales Management
    Route::resource('sales', SalesController::class);
    Route::post('sales/import', [ModuleActionController::class, 'import'])->name('sales.import');
    Route::get('sales/export', [ModuleActionController::class, 'export'])->name('sales.export');
    Route::get('sales/pdf', [ModuleActionController::class, 'pdf'])->name('sales.pdf');
    Route::post('sales/{sale}/payment', [SalesController::class, 'addPayment'])->name('sales.payment');

    // Finance Management
    Route::resource('finance', FinanceController::class);
    Route::post('finance/import', [ModuleActionController::class, 'import'])->name('finance.import');
    Route::get('finance/export', [ModuleActionController::class, 'export'])->name('finance.export');
    Route::get('finance/pdf', [ModuleActionController::class, 'pdf'])->name('finance.pdf');
    Route::get('finance/reports/income-statement', [FinanceController::class, 'incomeStatement'])->name('finance.income-statement');
    Route::get('finance/reports/balance-sheet', [FinanceController::class, 'balanceSheet'])->name('finance.balance-sheet');

    // Employee & HR
    Route::resource('employees', EmployeeController::class);
    Route::post('employees/import', [ModuleActionController::class, 'import'])->name('employees.import');
    Route::get('employees/export', [ModuleActionController::class, 'export'])->name('employees.export');
    Route::get('employees/pdf', [ModuleActionController::class, 'pdf'])->name('employees.pdf');
    Route::post('employees/{employee}/attendance', [EmployeeController::class, 'markAttendance'])->name('employees.attendance');
    Route::post('employees/{employee}/salary', [EmployeeController::class, 'processSalary'])->name('employees.salary');

    // Attendance Management
    Route::get('attendance/portal', [AttendanceController::class, 'employeePortal'])->name('attendance.portal');
    Route::post('attendance/clock', [AttendanceController::class, 'clockInOut'])->name('attendance.clock');
    Route::post('attendance/mark', [AttendanceController::class, 'markAttendance'])->name('attendance.mark');
    Route::get('attendance/data', [AttendanceController::class, 'getAttendanceData'])->name('attendance.data');
    Route::post('attendance/bulk-import', [AttendanceController::class, 'bulkImport'])->name('attendance.bulk-import');
    Route::get('attendance/bulk-import', [AttendanceController::class, 'bulkImportForm'])->name('attendance.bulk-import.form');
    Route::get('attendance/report', [AttendanceController::class, 'generateReport'])->name('attendance.report');

    // Salary Management
    Route::get('salaries', [SalaryController::class, 'index'])->name('salaries.index');
    Route::post('salaries/calculate', [SalaryController::class, 'calculateSalary'])->name('salaries.calculate');
    Route::post('salaries/bulk-calculate', [SalaryController::class, 'bulkCalculate'])->name('salaries.bulk-calculate');
    Route::post('salaries/{salary}/approve', [SalaryController::class, 'approveSalary'])->name('salaries.approve');
    Route::post('salaries/{salary}/pay', [SalaryController::class, 'processSalaryPayment'])->name('salaries.pay');
    Route::get('salaries/{salary}/slip', [SalaryController::class, 'getSalarySlip'])->name('salaries.slip');

    // Inventory Management
    Route::resource('inventory', InventoryController::class);
    Route::post('inventory/import', [ModuleActionController::class, 'import'])->name('inventory.import');
    Route::get('inventory/export', [ModuleActionController::class, 'export'])->name('inventory.export');
    Route::get('inventory/pdf', [ModuleActionController::class, 'pdf'])->name('inventory.pdf');
    Route::post('inventory/stock-adjustment', [InventoryController::class, 'adjustStock'])->name('inventory.adjust-stock');

    // Reports
    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::post('reports/generate', [ReportController::class, 'generate'])->name('reports.generate');
    Route::get('reports/export/{type}', [ReportController::class, 'export'])->name('reports.export');

    // Settings
    Route::resource('settings', SettingController::class);
    Route::post('settings/company', [SettingController::class, 'updateCompany'])->name('settings.company');
    Route::post('settings/theme', [SettingController::class, 'updateTheme'])->name('settings.theme');
    Route::post('settings/devices', [SettingController::class, 'storeDevice'])->name('settings.devices.store');
    Route::post('settings/devices/{device}/regenerate', [SettingController::class, 'regenerateDeviceKey'])->name('settings.devices.regenerate');
    // Optional: Device management could be added under settings or a dedicated controller later

    // Notifications
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
});

// IoT Attendance API (stateless) - protected by device API key middleware
// Note: Keep this lightweight and separate from auth middleware
Route::middleware('device.api')->group(function () {
    Route::post('api/attendance/ingest', [AttendanceIngestController::class, 'ingest'])->name('api.attendance.ingest');
});

// Profile Routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
