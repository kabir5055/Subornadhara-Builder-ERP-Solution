import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    ArrowLeftIcon,
    BuildingOfficeIcon,
    MapPinIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    PencilIcon,
    TrashIcon,
    PlusIcon,
    HomeIcon,
    UserGroupIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

export default function Show({ project, units = [] }) {
    const [activeTab, setActiveTab] = useState('overview');

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            router.delete(window.route('projects.destroy', { project: project.id }));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'ongoing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'on-hold': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getUnitStatusColor = (status) => {
        switch (status) {
            case 'available': return 'bg-green-100 text-green-800 border-green-200';
            case 'booked': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'sold': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'reserved': return 'bg-purple-100 text-purple-800 border-purple-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const tabs = [
        { id: 'overview', name: 'Overview', icon: ChartBarIcon },
        { id: 'units', name: 'Units', icon: HomeIcon },
        { id: 'clients', name: 'Clients', icon: UserGroupIcon },
    ];

    return (
        <AppLayout>
            <Head title={`Project: ${project.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center space-x-3">
                            <Link
                                href={window.route('projects.index')}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                                <p className="mt-2 text-sm text-gray-600">
                                    Project details and management
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex space-x-3">
                        <Link
                            href={window.route('projects.edit', { project: project.id })}
                            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                        >
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700"
                        >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Delete
                        </button>
                    </div>
                </div>

                {/* Project Summary Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-xl font-semibold text-gray-900">{project.name}</h2>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                                    {project.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center">
                                <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <span className="text-sm font-medium text-gray-600">Location</span>
                            </div>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{project.location}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center">
                                <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <span className="text-sm font-medium text-gray-600">Start Date</span>
                            </div>
                            <p className="mt-1 text-lg font-semibold text-gray-900">
                                {new Date(project.start_date).toLocaleDateString()}
                            </p>
                        </div>

                        {project.end_date && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center">
                                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                                    <span className="text-sm font-medium text-gray-600">End Date</span>
                                </div>
                                <p className="mt-1 text-lg font-semibold text-gray-900">
                                    {new Date(project.end_date).toLocaleDateString()}
                                </p>
                            </div>
                        )}

                        {project.budget && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center">
                                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                                    <span className="text-sm font-medium text-gray-600">Budget</span>
                                </div>
                                <p className="mt-1 text-lg font-semibold text-gray-900">
                                    ${Number(project.budget).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>

                    {project.description && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-medium text-gray-600 mb-2">Description</h3>
                            <p className="text-gray-900">{project.description}</p>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-6">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <Icon className="h-5 w-5 mr-2" />
                                        {tab.name}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-blue-50 rounded-lg p-6">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <HomeIcon className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-blue-600">Total Units</p>
                                                <p className="text-2xl font-bold text-blue-900">{units.length}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 rounded-lg p-6">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <HomeIcon className="h-6 w-6 text-green-600" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-green-600">Available Units</p>
                                                <p className="text-2xl font-bold text-green-900">
                                                    {units.filter(unit => unit.status === 'available').length}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 rounded-lg p-6">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-yellow-100 rounded-lg">
                                                <HomeIcon className="h-6 w-6 text-yellow-600" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-yellow-600">Sold Units</p>
                                                <p className="text-2xl font-bold text-yellow-900">
                                                    {units.filter(unit => unit.status === 'sold').length}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Units Tab */}
                        {activeTab === 'units' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium text-gray-900">Project Units</h3>
                                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700">
                                        <PlusIcon className="h-4 w-4 mr-2" />
                                        Add Units
                                    </button>
                                </div>

                                {units.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {units.map((unit) => (
                                            <div key={unit.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">Unit {unit.unit_number}</h4>
                                                        <p className="text-sm text-gray-600">Floor {unit.floor}</p>
                                                    </div>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getUnitStatusColor(unit.status)}`}>
                                                        {unit.status}
                                                    </span>
                                                </div>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-600">Type: {unit.unit_type}</p>
                                                    <p className="text-sm text-gray-600">Area: {unit.area} sq ft</p>
                                                    {unit.price && (
                                                        <p className="text-sm font-medium text-gray-900">${Number(unit.price).toLocaleString()}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <HomeIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No units found</h3>
                                        <p className="mt-1 text-sm text-gray-500">Get started by adding units to this project.</p>
                                        <button className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700">
                                            <PlusIcon className="h-4 w-4 mr-2" />
                                            Add Units
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Clients Tab */}
                        {activeTab === 'clients' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Associated Clients</h3>
                                <div className="text-center py-8">
                                    <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
                                    <p className="mt-1 text-sm text-gray-500">Clients will appear here when they book or purchase units.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
