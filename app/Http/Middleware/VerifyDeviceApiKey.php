<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\AttendanceDevice;

class VerifyDeviceApiKey
{
    public function handle(Request $request, Closure $next)
    {
        $apiKey = $request->header('X-Device-Key') ?? $request->get('api_key');
        if (!$apiKey) {
            return response()->json(['error' => 'Device API key missing'], 401);
        }

        $device = AttendanceDevice::where('api_key', $apiKey)->where('active', true)->first();
        if (!$device) {
            return response()->json(['error' => 'Invalid device'], 401);
        }

        // Attach device to request for controller usage
        $request->attributes->set('device', $device);
        $device->forceFill(['last_seen' => now(), 'ip' => $request->ip()])->save();

        return $next($request);
    }
}
