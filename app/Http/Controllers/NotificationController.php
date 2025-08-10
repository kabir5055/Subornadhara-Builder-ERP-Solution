<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Display notifications list (stub)
     */
    public function index()
    {
        return Inertia::render('Notifications/Index', [
            'notifications' => [],
        ]);
    }
}
