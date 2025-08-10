<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class ResetAndSeed extends Command
{
    protected $signature = 'app:reset-seed {--force : Force the operation to run in production} {--seed-class= : Seed a specific class instead of DatabaseSeeder}';

    protected $description = 'Drop all tables, run all migrations, and seed the database in one go (safe and idempotent)';

    public function handle(): int
    {
        $this->info('Resetting database (fresh migrate) and seeding...');

        // Ensure using file sessions to avoid sessions table collision
        if (config('session.driver') === 'database') {
            $this->warn('Temporarily switching session driver to file for this run to avoid sessions table conflicts...');
            putenv('SESSION_DRIVER=file');
            $_ENV['SESSION_DRIVER'] = 'file';
            $_SERVER['SESSION_DRIVER'] = 'file';
        }

        // Clear caches
        Artisan::call('config:clear');
        Artisan::call('cache:clear');
        Artisan::call('route:clear');
        Artisan::call('view:clear');

        // Fresh migrate
        $this->call('migrate:fresh', [
            '--force' => $this->option('force'),
        ]);

        // Seed
        $seedClass = $this->option('seed-class');
        if ($seedClass) {
            $this->call('db:seed', [
                '--class' => $seedClass,
                '--no-interaction' => true,
                '--force' => $this->option('force'),
            ]);
        } else {
            $this->call('db:seed', [
                '--no-interaction' => true,
                '--force' => $this->option('force'),
            ]);
        }

        $this->info('Database reset and seeding completed.');

        return self::SUCCESS;
    }
}
