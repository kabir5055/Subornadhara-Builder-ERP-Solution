import React, { useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@components';
import { LineChart, BarChart, DoughnutChart } from '@components';
import { formatCurrency, formatDate } from '@utils/formatters';
import { BuildingOfficeIcon, UserGroupIcon, CurrencyDollarIcon, ChartBarIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function Dashboard({ stats, monthlySales = [], recentBookings = [], topProjects = [], incomeExpense = [], unsoldByProject = [], moduleSummary = {}, projectStatusSummary = {}, todayAttendance = null }) {
    const monthLabels = useMemo(() => Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('en', { month: 'short' })), []);

    const salesDataset = useMemo(() => {
        const monthMap = Object.fromEntries(monthLabels.map((_, i) => [i + 1, { count: 0, revenue: 0 }]))
        monthlySales.forEach(m => { monthMap[m.month] = { count: m.count || 0, revenue: m.revenue || 0 } });
        return {
            labels: monthLabels,
            revenue: Object.values(monthMap).map(m => m.revenue),
            count: Object.values(monthMap).map(m => m.count),
        };
    }, [monthlySales, monthLabels]);

    const incomeExpenseDataset = useMemo(() => {
        const monthMap = Object.fromEntries(monthLabels.map((_, i) => [i + 1, { income: 0, expense: 0 }]));
        incomeExpense.forEach(m => { monthMap[m.month] = { income: m.income || 0, expense: m.expense || 0 }; });
        return {
            labels: monthLabels,
            income: Object.values(monthMap).map(m => m.income),
            expense: Object.values(monthMap).map(m => m.expense),
        };
    }, [incomeExpense, monthLabels]);

    const projectAvailability = useMemo(() => {
        const labels = unsoldByProject.map(p => p.name);
        const available = unsoldByProject.map(p => p.available_units);
        const sold = unsoldByProject.map(p => p.sold_units);
        return { labels, available, sold };
    }, [unsoldByProject]);

    const moduleSummaryData = useMemo(() => {
        const labels = Object.keys(moduleSummary);
        const values = Object.values(moduleSummary);
        const colors = ['#6366F1', '#22C55E', '#F59E0B', '#EF4444', '#0EA5E9', '#A855F7'];
        return {
            labels,
            datasets: [{
                data: values,
                backgroundColor: labels.map((_, i) => colors[i % colors.length] + '99'),
                borderColor: labels.map((_, i) => colors[i % colors.length]),
                borderWidth: 1,
            }],
        };
    }, [moduleSummary]);

    const projectStatusData = useMemo(() => {
        const labels = Object.keys(projectStatusSummary);
        const values = Object.values(projectStatusSummary);
        const colors = ['#0EA5E9', '#F59E0B', '#22C55E', '#EF4444'];
        return {
            labels,
            datasets: [{
                data: values,
                backgroundColor: labels.map((_, i) => colors[i % colors.length] + '99'),
                borderColor: labels.map((_, i) => colors[i % colors.length]),
                borderWidth: 1,
            }],
        };
    }, [projectStatusSummary]);

    const statCards = [
        { title: 'Total Projects', value: stats?.total_projects || 0, icon: BuildingOfficeIcon, color: 'from-blue-500 to-blue-600' },
        { title: 'Active Clients', value: stats?.active_clients || 0, icon: UserGroupIcon, color: 'from-green-500 to-green-600' },
        { title: 'Total Revenue', value: formatCurrency(stats?.total_revenue || 0), icon: CurrencyDollarIcon, color: 'from-purple-500 to-purple-600' },
        { title: 'Units Sold', value: stats?.sold_units || 0, icon: ChartBarIcon, color: 'from-orange-500 to-orange-600' },
    ];

    return (
        <AppLayout>
            <Head title="Dashboard - Subornadhara Builder ERP" />

            {/* Header */}
            <div className="mb-8">
                <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
                    <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold">Welcome to Subornadhara Builder</h1>
                                <p className="text-blue-100">Real Estate Development Management System</p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 border-0" onClick={() => window.location.href = route('reports.index')}>View Reports</Button>
                                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={() => window.location.href = route('projects.create')}>Quick Actions</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((s, i) => (
                    <Card key={i} className={`bg-gradient-to-br ${s.color} border-0 text-white shadow-lg`}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white/80 text-sm">{s.title}</p>
                                    <p className="text-2xl md:text-3xl font-bold mt-1">{s.value}</p>
                                </div>
                                <s.icon className="h-10 w-10 text-white/25" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Sales Trend (This Year)</CardTitle></CardHeader>
                    <CardContent>
                        <LineChart
                            labels={salesDataset.labels}
                            datasets={[
                                { label: 'Revenue', data: salesDataset.revenue, borderColor: '#6366F1', backgroundColor: 'rgba(99,102,241,0.15)' },
                                { label: 'Bookings', data: salesDataset.count, borderColor: '#22C55E', backgroundColor: 'rgba(34,197,94,0.15)' },
                            ]}
                            height={320}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Income vs Expense</CardTitle></CardHeader>
                    <CardContent>
                        <BarChart
                            labels={incomeExpenseDataset.labels}
                            datasets={[
                                { label: 'Income', data: incomeExpenseDataset.income, backgroundColor: 'rgba(34,197,94,0.6)' },
                                { label: 'Expense', data: incomeExpenseDataset.expense, backgroundColor: 'rgba(239,68,68,0.6)' },
                            ]}
                            height={320}
                            stacked={false}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* All Modules Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <Card>
                    <CardHeader><CardTitle>All Modules</CardTitle></CardHeader>
                    <CardContent>
                        <DoughnutChart labels={moduleSummaryData.labels} datasets={moduleSummaryData.datasets} height={300} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Project Status</CardTitle></CardHeader>
                    <CardContent>
                        <DoughnutChart labels={projectStatusData.labels} datasets={projectStatusData.datasets} height={300} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Today’s Attendance</CardTitle></CardHeader>
                    <CardContent>
                        {todayAttendance ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                                        <div className="text-sm text-green-700">Present</div>
                                        <div className="text-2xl font-bold text-green-800">{todayAttendance.present}</div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                                        <div className="text-sm text-red-700">Absent</div>
                                        <div className="text-2xl font-bold text-red-800">{todayAttendance.absent}</div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                                        <div className="text-sm text-yellow-700">Late</div>
                                        <div className="text-2xl font-bold text-yellow-800">{todayAttendance.late}</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-700 mb-2">Latest Check-ins</div>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {(todayAttendance.details || []).map((a) => (
                                            <div key={a.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                                                <div>
                                                    <div className="font-medium text-gray-900">{a.employee.name}</div>
                                                    <div className="text-xs text-gray-600">{a.employee.department || '—'}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-gray-800">{a.check_in ? new Date(a.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</div>
                                                    {a.is_late && <div className="text-xs text-yellow-700">Late</div>}
                                                </div>
                                            </div>
                                        ))}
                                        {(!todayAttendance.details || todayAttendance.details.length === 0) && (
                                            <div className="text-center text-gray-500 py-4">No check-ins yet.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500">No data</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Projects Availability + Recent Bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <Card className="lg:col-span-1">
                    <CardHeader><CardTitle>Project Availability</CardTitle></CardHeader>
                    <CardContent>
                        <BarChart
                            labels={projectAvailability.labels}
                            datasets={[
                                { label: 'Available', data: projectAvailability.available, backgroundColor: 'rgba(59,130,246,0.6)' },
                                { label: 'Sold', data: projectAvailability.sold, backgroundColor: 'rgba(234,179,8,0.6)' },
                            ]}
                            height={300}
                            stacked={true}
                            options={{ scales: { x: { ticks: { maxRotation: 0, minRotation: 0 } } } }}
                        />
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Recent Bookings</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentBookings?.map((b, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="font-medium">{b.client?.name || 'N/A'}</TableCell>
                                        <TableCell>{b.project?.name || 'N/A'}</TableCell>
                                        <TableCell>{formatCurrency(b.total_amount || 0)}</TableCell>
                                        <TableCell>{formatDate(b.booking_date || b.created_at)}</TableCell>
                                    </TableRow>
                                ))}
                                {(!recentBookings || recentBookings.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan="4" className="text-center text-gray-500 py-8">No recent bookings</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Unsold Projects Quick Book */}
            <div className="mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Unsold Projects — Quick Booking</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {unsoldByProject?.map((p) => (
                                <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div>
                                        <div className="font-semibold text-gray-900">{p.name}</div>
                                        <div className="text-sm text-gray-600">Available: {p.available_units} • Sold: {p.sold_units}</div>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => { window.location.href = `${route('sales.create')}?project_id=${p.id}`; }}
                                    >
                                        Book now
                                    </Button>
                                </div>
                            ))}
                            {(!unsoldByProject || unsoldByProject.length === 0) && (
                                <div className="text-center text-gray-500 py-8">All projects are sold out or no data.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Booking Shortcuts */}
            <div className="mb-12">
                <Card>
                    <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Button variant="outline" className="h-20 flex-col" onClick={() => window.location.href = route('projects.create')}>
                                <BuildingOfficeIcon className="h-6 w-6 mb-2" /> New Project
                            </Button>
                            <Button variant="outline" className="h-20 flex-col" onClick={() => window.location.href = route('clients.create')}>
                                <UserGroupIcon className="h-6 w-6 mb-2" /> Add Client
                            </Button>
                            <Button variant="outline" className="h-20 flex-col" onClick={() => window.location.href = route('sales.create')}>
                                <CurrencyDollarIcon className="h-6 w-6 mb-2" /> Record Sale
                            </Button>
                            <Button variant="outline" className="h-20 flex-col" onClick={() => window.location.href = route('reports.index')}>
                                <ChartBarIcon className="h-6 w-6 mb-2" /> View Reports
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
