<?php

return [
    'groups' => [
        'web' => [
            'dashboard',
            'projects.*',
            'clients.*',
            'sales.*',
            'finance.*',
            'employees.*',
            'inventory.*',
            'attendance.*',
            'salaries.*',
            'reports.*',
            'settings.*',
            'notifications.*',
            'login',
            'register',
            'password.*',
            'verification.*',
            'profile.*'
        ],
    ],
    'except' => ['_debugbar.*', 'horizon.*'],
    'only' => [],
    'url' => env('APP_URL'),
];
