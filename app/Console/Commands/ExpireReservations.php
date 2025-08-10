<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Reservation;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ExpireReservations extends Command
{
    protected $signature = 'reservations:expire';
    protected $description = 'Expire active reservations past their expiry time and free units';

    public function handle(): int
    {
        $now = Carbon::now();
        $expired = 0;
        DB::transaction(function () use ($now, &$expired) {
            $toExpire = Reservation::where('status', 'active')
                ->where('expires_at', '<=', $now)
                ->lockForUpdate()
                ->get();

            foreach ($toExpire as $res) {
                $res->update(['status' => 'expired']);
                if ($res->unit && $res->unit->status === 'reserved') {
                    $res->unit->update(['status' => 'available']);
                }
                $expired++;
            }
        });

        $this->info("Expired {$expired} reservations.");
        return Command::SUCCESS;
    }
}
