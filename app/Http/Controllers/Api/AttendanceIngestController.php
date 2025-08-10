<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\Employee;
use Carbon\Carbon;

class AttendanceIngestController extends Controller
{
    public function ingest(Request $request)
    {
        $data = $request->validate([
            'employee_code' => 'required|string',
            'timestamp' => 'required|date',
            'type' => 'required|in:in,out',
            'location' => 'nullable|string|max:255',
        ]);

        // Map employee_code to employee record
        $employee = Employee::where('employee_id', $data['employee_code'])->first();
        if (!$employee) {
            return response()->json(['error' => 'Employee not found'], 404);
        }

        $dt = Carbon::parse($data['timestamp']);
        $date = $dt->copy()->startOfDay();

        $attendance = Attendance::firstOrCreate([
            'employee_id' => $employee->id,
            'date' => $date,
        ], [
            'status' => 'absent',
            'total_hours' => 0,
            'is_late' => false,
        ]);

        if ($data['type'] === 'in') {
            if (!$attendance->check_in) {
                $attendance->check_in = $dt;
                $attendance->status = 'present';
                $attendance->is_late = $dt->gt(Carbon::parse('09:00', $dt->timezone));
            }
        } else {
            // out
            if (!$attendance->check_out || $dt->gt($attendance->check_out)) {
                $attendance->check_out = $dt;
                if ($attendance->check_in) {
                    $attendance->total_hours = $attendance->check_in->diffInMinutes($attendance->check_out) / 60;
                }
            }
        }

        if ($request->filled('location')) {
            $attendance->location = $request->string('location');
        }

        $attendance->save();

        return response()->json([
            'success' => true,
            'attendance_id' => $attendance->id,
        ]);
    }
}
