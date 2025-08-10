import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@components';
import { formatCurrency } from '@utils/formatters';

export default function InstallmentsWizard({ booking, suggestedPlan = [] }) {
  const [rows, setRows] = useState(suggestedPlan);
  const total = rows.reduce((s, r) => s + Number(r.amount || 0), 0);
  const { data, setData, post, processing } = useForm({ schedule: rows });

  const addRow = () => setRows([...rows, { label: 'New Installment', due_date: new Date().toISOString().slice(0,10), amount: 0 }]);
  const updateRow = (i, key, value) => {
    const next = [...rows];
    next[i] = { ...next[i], [key]: value };
    setRows(next);
    setData('schedule', next);
  };
  const removeRow = (i) => { const next = rows.filter((_, idx) => idx !== i); setRows(next); setData('schedule', next); };

  const submit = (e) => { e.preventDefault(); post(route('bookings.installments.store', { booking: booking.id })); };

  return (
    <AppLayout>
      <Head title={`Installments — Booking #${booking.id}`} />
      <Card>
        <CardHeader>
          <CardTitle>Installment Plan for Unit {booking.unit_number} — Total {formatCurrency(booking.total_amount)}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <input className="border rounded-md p-2 w-full" value={r.label} onChange={(e)=>updateRow(i,'label',e.target.value)} />
                    </TableCell>
                    <TableCell>
                      <input type="date" className="border rounded-md p-2" value={r.due_date} onChange={(e)=>updateRow(i,'due_date',e.target.value)} />
                    </TableCell>
                    <TableCell>
                      <input type="number" step="0.01" className="border rounded-md p-2 w-40" value={r.amount} onChange={(e)=>updateRow(i,'amount',e.target.value)} />
                    </TableCell>
                    <TableCell>
                      <Button type="button" variant="danger" onClick={()=>removeRow(i)}>Remove</Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan="2" className="text-right font-semibold">Total</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(total)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="flex justify-between">
              <Button type="button" variant="secondary" onClick={addRow}>Add Installment</Button>
              <Button type="submit" loading={processing}>Save Schedule</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
