<?php

namespace App\Imports;

use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Collection;

class GenericTableImport implements ToCollection, WithHeadingRow
{
    public function __construct(private string $table) {}

    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $data = $row->toArray();
            // Skip empty rows
            if (!array_filter($data, fn($v) => $v !== null && $v !== '')) continue;
            DB::table($this->table)->insert($data);
        }
    }
}
