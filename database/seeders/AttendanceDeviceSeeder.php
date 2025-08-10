<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\AttendanceDevice;

class AttendanceDeviceSeeder extends Seeder
{
    public function run(): void
    {
        if (AttendanceDevice::count() > 0) {
            return; // idempotent
        }

        AttendanceDevice::create([
            'name' => 'Main Gate Device',
            'serial' => 'DEV-' . Str::upper(Str::random(8)),
            'api_key' => Str::random(40),
            'ip' => '127.0.0.1',
            'timezone' => config('app.timezone', 'UTC'),
            'active' => true,
        ]);
    }
}
