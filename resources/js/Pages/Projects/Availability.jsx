import React, { useMemo, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Modal, Input, Select } from '@components';

export default function Availability({ project, floors = [], units = [], clients = [] }) {
    const [filter, setFilter] = useState({ floor: 'all', type: 'all', status: 'all' });
    const [bookingUnit, setBookingUnit] = useState(null);
    const [reserveUnit, setReserveUnit] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({ client_id: '', booking_date: new Date().toISOString().slice(0,10), notes: '' });
    const reserveForm = useForm({ client_id: '', hours: 24, notes: '' });

    const filtered = useMemo(() => {
        return units.filter(u =>
            (filter.floor === 'all' || u.floor === filter.floor) &&
            (filter.type === 'all' || u.type === filter.type) &&
            (filter.status === 'all' || u.status === filter.status)
        );
    }, [units, filter]);

    const openBook = (u) => { setBookingUnit(u); };
    const closeBook = () => { setBookingUnit(null); reset(); };
    const submit = (e) => {
        e.preventDefault();
        post(route('projects.units.book', { project: project.id, unit: bookingUnit.id }), { onSuccess: closeBook });
    };

    const doReserve = (e) => {
        e.preventDefault();
        reserveForm.post(route('projects.units.reserve', { project: project.id, unit: reserveUnit.id }), {
            onSuccess: () => { setReserveUnit(null); reserveForm.reset(); }
        });
    };

    const unreserve = (u) => {
        reserveForm.post(route('projects.units.unreserve', { project: project.id, unit: u.id }));
    };

    return (
        <AppLayout>
            <Head title={`Availability — ${project.name}`} />
            <div className="mb-6">
                <Card>
                    <CardHeader><CardTitle>{project.name} — Flats Availability</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                            <select className="border rounded-md p-2" value={filter.floor} onChange={(e) => setFilter({ ...filter, floor: e.target.value })}>
                                <option value="all">All Floors</option>
                                {floors.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                            <select className="border rounded-md p-2" value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
                                <option value="all">All Types</option>
                                <option value="apartment">Apartment</option>
                                <option value="duplex">Duplex</option>
                                <option value="penthouse">Penthouse</option>
                                <option value="studio">Studio</option>
                            </select>
                            <select className="border rounded-md p-2" value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                                <option value="all">All Status</option>
                                <option value="available">Available</option>
                                <option value="reserved">Reserved</option>
                                <option value="booked">Booked</option>
                                <option value="sold">Sold</option>
                            </select>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Unit</TableHead>
                                    <TableHead>Floor</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Size (sqft)</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map(u => (
                                    <TableRow key={u.id}>
                                        <TableCell className="font-medium">{u.unit_number}</TableCell>
                                        <TableCell>{u.floor}</TableCell>
                                        <TableCell className="capitalize">{u.type}</TableCell>
                                        <TableCell>{u.size_sqft}</TableCell>
                                        <TableCell>{new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT' }).format(u.price)}</TableCell>
                                        <TableCell className="capitalize">{u.status}</TableCell>
                                        <TableCell>
                                            {u.status === 'available' ? (
                                                <div className="flex gap-2">
                                                    <Button onClick={() => openBook(u)} size="sm">Book</Button>
                                                    <Button onClick={() => setReserveUnit(u)} size="sm" variant="outline">Reserve</Button>
                                                </div>
                                            ) : u.status === 'reserved' ? (
                                                <div className="flex gap-2">
                                                    <Button onClick={() => unreserve(u)} size="sm" variant="outline">Unreserve</Button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">N/A</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filtered.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan="7" className="text-center text-gray-500 py-8">No units found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <Modal open={!!bookingUnit} onClose={closeBook} title={`Book Unit ${bookingUnit?.unit_number}`}>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Client</label>
                        <select className="w-full border rounded-md p-2" value={data.client_id} onChange={(e)=>setData('client_id', e.target.value)}>
                          <option value="">Select client</option>
                          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        {errors.client_id && <p className="text-red-600 text-sm mt-1">{errors.client_id}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Booking Date</label>
                        <input type="date" className="w-full border rounded-md p-2" value={data.booking_date} onChange={(e)=>setData('booking_date', e.target.value)} />
                        {errors.booking_date && <p className="text-red-600 text-sm mt-1">{errors.booking_date}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Notes</label>
                        <textarea className="w-full border rounded-md p-2" rows="3" value={data.notes} onChange={(e)=>setData('notes', e.target.value)} />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={closeBook}>Cancel</Button>
                        <Button type="submit" loading={processing}>Confirm Booking</Button>
                    </div>
                </form>
            </Modal>

            <Modal open={!!reserveUnit} onClose={() => setReserveUnit(null)} title={`Reserve Unit ${reserveUnit?.unit_number}`}>
                <form onSubmit={doReserve} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Client</label>
                        <select className="w-full border rounded-md p-2" value={reserveForm.data.client_id} onChange={(e)=>reserveForm.setData('client_id', e.target.value)}>
                          <option value="">Select client</option>
                          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        {reserveForm.errors.client_id && <p className="text-red-600 text-sm mt-1">{reserveForm.errors.client_id}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Hours</label>
                        <input type="number" min="1" className="w-full border rounded-md p-2" value={reserveForm.data.hours} onChange={(e)=>reserveForm.setData('hours', e.target.value)} />
                        {reserveForm.errors.hours && <p className="text-red-600 text-sm mt-1">{reserveForm.errors.hours}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Notes</label>
                        <textarea className="w-full border rounded-md p-2" rows="3" value={reserveForm.data.notes} onChange={(e)=>reserveForm.setData('notes', e.target.value)} />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={() => setReserveUnit(null)}>Cancel</Button>
                        <Button type="submit" loading={reserveForm.processing}>Confirm Reserve</Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
