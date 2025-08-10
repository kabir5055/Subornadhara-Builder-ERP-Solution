import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Button,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell
} from '@components';
import { formatCurrency, formatDate } from '@utils/formatters';
import {
    BuildingOfficeIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

export default function Dashboard({ stats, monthlySales, recentBookings, topProjects }) {
    const statsData = [
        {
            title: 'Total Projects',
            value: stats?.total_projects || 0,
            icon: BuildingOfficeIcon,
            color: 'from-blue-500 to-blue-600',
            change: '+12%'
        },
        {
            title: 'Active Clients',
            value: stats?.total_clients || 0,
            icon: UserGroupIcon,
            color: 'from-green-500 to-green-600',
            change: '+8%'
        },
        {
            title: 'Total Revenue',
            value: formatCurrency(stats?.total_revenue || 0),
            icon: CurrencyDollarIcon,
            color: 'from-purple-500 to-purple-600',
            change: '+15%'
        },
        {
            title: 'Monthly Sales',
            value: stats?.monthly_sales || 0,
            icon: ChartBarIcon,
            color: 'from-orange-500 to-orange-600',
            change: '+5%'
        }
    ];

    return (
        <AppLayout>
            <Head title="Dashboard - Subornadhara Builder ERP" />

            {/* Header Section */}
            <div className="mb-8">
                <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
                    <CardContent className="p-8">
                        <h1 className="text-4xl font-bold mb-2">Welcome to Subornadhara Builder</h1>
                        <p className="text-blue-100 text-lg">Real Estate Development Management System</p>
                        <div className="mt-6 flex space-x-4">
                            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 border-0">
                                View Reports
                            </Button>
                            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                                Quick Actions
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsData.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <Card key={index} className={`bg-gradient-to-br ${stat.color} border-0 text-white shadow-lg hover:shadow-xl transition-shadow`}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                                        <p className="text-white/60 text-sm mt-2">{stat.change} from last month</p>
                                    </div>
                                    <div className="text-white/20">
                                        <IconComponent className="h-12 w-12" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Bookings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Bookings</CardTitle>
                    </CardHeader>
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
                                {recentBookings?.map((booking, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">
                                            {booking.client?.name || 'N/A'}
                                        </TableCell>
                                        <TableCell>{booking.project?.name || 'N/A'}</TableCell>
                                        <TableCell>{formatCurrency(booking.total_amount)}</TableCell>
                                        <TableCell>{formatDate(booking.booking_date)}</TableCell>
                                    </TableRow>
                                ))}
                                {(!recentBookings || recentBookings.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan="4" className="text-center text-gray-500 py-8">
                                            No recent bookings found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Top Projects */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topProjects?.map((project, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{project.name}</h4>
                                        <p className="text-sm text-gray-600">{project.location}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-green-600">
                                            {formatCurrency(project.total_sales || 0)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {project.units_sold || 0} units sold
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {(!topProjects || topProjects.length === 0) && (
                                <div className="text-center text-gray-500 py-8">
                                    No project data available
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Button
                                variant="outline"
                                className="h-20 flex-col"
                                onClick={() => window.location.href = route('projects.create')}
                            >
                                <BuildingOfficeIcon className="h-6 w-6 mb-2" />
                                New Project
                            </Button>
                            <Button
                                variant="outline"
                                className="h-20 flex-col"
                                onClick={() => window.location.href = route('clients.create')}
                            >
                                <UserGroupIcon className="h-6 w-6 mb-2" />
                                Add Client
                            </Button>
                            <Button
                                variant="outline"
                                className="h-20 flex-col"
                                onClick={() => window.location.href = route('sales.create')}
                            >
                                <CurrencyDollarIcon className="h-6 w-6 mb-2" />
                                Record Sale
                            </Button>
                            <Button
                                variant="outline"
                                className="h-20 flex-col"
                                onClick={() => window.location.href = route('reports.index')}
                            >
                                <ChartBarIcon className="h-6 w-6 mb-2" />
                                View Reports
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
