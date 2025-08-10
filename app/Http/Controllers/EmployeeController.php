<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use Inertia\Response;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Employee::query();

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('employee_id', 'like', "%{$search}%");
            });
        }
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        if ($department = $request->query('department')) {
            $query->where(function ($q) use ($department) {
                $q->where('department', $department)
                  ->orWhere('department_id', $department);
            });
        }

        $employees = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'filters' => $request->only('search','status','department'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Employees/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'employee_id' => ['nullable','string','max:50'],
            'name' => ['required','string','max:191'],
            'email' => ['nullable','email','max:191'],
            'phone' => ['nullable','string','max:50'],
            'department' => ['nullable','string','max:191'],
            'department_id' => ['nullable','integer'],
            'designation' => ['nullable','string','max:191'],
            'salary' => ['nullable','numeric'],
            'hire_date' => ['nullable','date'],
            'status' => ['required','string','max:50'],
            'address' => ['nullable','string'],
            'emergency_contact' => ['nullable','string','max:191'],
            'nid' => ['nullable','string','max:50'],
            'education' => ['nullable','string'],
            'experience' => ['nullable','string'],
            'skills' => ['nullable','string'],
            'notes' => ['nullable','string'],
        ]);

        // map UI field names to DB columns
        $mapped = [
            ...$data,
            'join_date' => $data['hire_date'] ?? null,
            'nid_number' => $data['nid'] ?? null,
        ];
        unset($mapped['hire_date'], $mapped['nid']);

        Employee::create($mapped);

        return redirect()->route('employees.index')->with('success', 'Employee created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Employee $employee): Response
    {
        return Inertia::render('Employees/Show', [
            'employee' => $employee,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Employee $employee): Response
    {
        return Inertia::render('Employees/Edit', [
            'employee' => $employee,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Employee $employee)
    {
        $data = $request->validate([
            'employee_id' => ['nullable','string','max:50'],
            'name' => ['required','string','max:191'],
            'email' => ['nullable','email','max:191'],
            'phone' => ['nullable','string','max:50'],
            'department' => ['nullable','string','max:191'],
            'department_id' => ['nullable','integer'],
            'designation' => ['nullable','string','max:191'],
            'salary' => ['nullable','numeric'],
            'hire_date' => ['nullable','date'],
            'status' => ['required','string','max:50'],
            'address' => ['nullable','string'],
            'emergency_contact' => ['nullable','string','max:191'],
            'nid' => ['nullable','string','max:50'],
            'education' => ['nullable','string'],
            'experience' => ['nullable','string'],
            'skills' => ['nullable','string'],
            'notes' => ['nullable','string'],
        ]);
        $mapped = [
            ...$data,
            'join_date' => $data['hire_date'] ?? null,
            'nid_number' => $data['nid'] ?? null,
        ];
        unset($mapped['hire_date'], $mapped['nid']);

        $employee->update($mapped);
        return redirect()->route('employees.index')->with('success', 'Employee updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $employee)
    {
        $employee->delete();
        return redirect()->back()->with('success', 'Employee deleted');
    }
}
