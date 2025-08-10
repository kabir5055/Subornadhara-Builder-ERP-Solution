<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Schema;
use App\Models\AttendanceDevice;
use Illuminate\Support\Str;
use App\Models\Setting;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $devices = Schema::hasTable('attendance_devices')
            ? AttendanceDevice::orderByDesc('id')->get(['id','name','serial','api_key','active','last_seen'])
            : collect();

        return Inertia::render('Settings/Index', [
            'settings' => [
                'company' => [
                    'name' => Setting::getValue('company_name', config('app.name')),
                ],
                'theme' => [
                    'color' => Setting::getValue('theme_color', 'blue'),
                ],
            ],
            'devices' => $devices,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Update company settings (stub)
     */
    public function updateCompany(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
    Setting::setValue('company_name', $request->string('name'), 'string', 'company', 'Company name');
    return back()->with('success', 'Company settings updated');
    }

    /**
     * Update theme settings (stub)
     */
    public function updateTheme(Request $request)
    {
        $request->validate([
            'color' => 'required|string',
        ]);
    Setting::setValue('theme_color', $request->string('color'), 'string', 'theme', 'Theme color');
    return back()->with('success', 'Theme updated');
    }

    /**
     * Create a new attendance device and generate api_key
     */
    public function storeDevice(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'serial' => 'nullable|string|max:255',
        ]);

        $device = AttendanceDevice::create([
            'name' => $data['name'],
            'serial' => $data['serial'] ?: 'DEV-' . Str::upper(Str::random(8)),
            'api_key' => Str::random(40),
            'active' => true,
        ]);

        return back()->with('success', 'Device created: ' . $device->name);
    }

    /**
     * Regenerate API key for a device
     */
    public function regenerateDeviceKey(AttendanceDevice $device)
    {
        $device->update(['api_key' => Str::random(40)]);
        return back()->with('success', 'API key regenerated for: ' . $device->name);
    }
}
