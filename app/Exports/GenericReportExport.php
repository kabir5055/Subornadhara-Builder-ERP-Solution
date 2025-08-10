<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class GenericReportExport implements FromArray, WithHeadings, WithTitle
{
    protected string $title;
    protected array $headings;
    protected array $rows;

    public function __construct(string $title, array $headings, array $rows)
    {
        $this->title = $title;
        $this->headings = $headings;
        $this->rows = $rows;
    }

    public function headings(): array
    {
        return $this->headings;
    }

    public function array(): array
    {
        // Ensure rows align to headings order
        $keys = array_flip($this->headings);
        return array_map(function ($row) use ($keys) {
            $row = (array) $row;
            $filtered = array_intersect_key($row, $keys);
            // Fill missing keys as empty strings to keep column count stable
            $aligned = [];
            foreach ($this->headings as $h) {
                $aligned[] = $filtered[$h] ?? '';
            }
            return $aligned;
        }, $this->rows);
    }

    public function title(): string
    {
        return $this->title;
    }
}
