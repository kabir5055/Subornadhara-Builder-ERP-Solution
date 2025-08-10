import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    ArrowLeftIcon,
    BuildingOfficeIcon,
    MapPinIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        location: '',
        start_date: '',
        end_date: '',
        budget: '',
        status: 'planning',
        total_units: '',
        floors: '',
        images: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(window.route('projects.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset('images');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Create Project" />

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
                                <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
                                <p className="mt-2 text-sm text-gray-600">
                                    Add a new real estate development project
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Project Information</h2>
                        <p className="text-sm text-gray-500">Fill in the details for the new project</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Project Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Project Name *
                                </label>
                                <div className="relative">
                                    <BuildingOfficeIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={`pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.name ? 'border-red-300' : ''
                                        }`}
                                        placeholder="Enter project name"
                                    />
                                </div>
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Location */}
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                    Location *
                                </label>
                                <div className="relative">
                                    <MapPinIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        id="location"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        className={`pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.location ? 'border-red-300' : ''
                                        }`}
                                        placeholder="Enter project location"
                                    />
                                </div>
                                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                            </div>

                            {/* Start Date */}
                            <div>
                                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date *
                                </label>
                                <div className="relative">
                                    <CalendarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        id="start_date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className={`pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.start_date ? 'border-red-300' : ''
                                        }`}
                                    />
                                </div>
                                {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
                            </div>

                            {/* End Date */}
                            <div>
                                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Expected End Date
                                </label>
                                <div className="relative">
                                    <CalendarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        id="end_date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        className={`pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.end_date ? 'border-red-300' : ''
                                        }`}
                                    />
                                </div>
                                {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                            </div>

                            {/* Budget */}
                            <div>
                                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                                    Budget
                                </label>
                                <div className="relative">
                                    <CurrencyDollarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="number"
                                        id="budget"
                                        value={data.budget}
                                        onChange={(e) => setData('budget', e.target.value)}
                                        className={`pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.budget ? 'border-red-300' : ''
                                        }`}
                                        placeholder="Enter project budget"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget}</p>}
                            </div>

                            {/* Status */}
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                    Status *
                                </label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className={`block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.status ? 'border-red-300' : ''
                                    }`}
                                >
                                    <option value="planning">Planning</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                    <option value="on-hold">On Hold</option>
                                </select>
                                {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                            </div>

                            {/* Total Units */}
                            <div>
                                <label htmlFor="total_units" className="block text-sm font-medium text-gray-700 mb-2">
                                    Total Units
                                </label>
                                <input
                                    type="number"
                                    id="total_units"
                                    value={data.total_units}
                                    onChange={(e) => setData('total_units', e.target.value)}
                                    className={`block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.total_units ? 'border-red-300' : ''
                                    }`}
                                    placeholder="Number of units"
                                    min="0"
                                />
                                {errors.total_units && <p className="mt-1 text-sm text-red-600">{errors.total_units}</p>}
                            </div>

                            {/* Floors */}
                            <div>
                                <label htmlFor="floors" className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Floors
                                </label>
                                <input
                                    type="number"
                                    id="floors"
                                    value={data.floors}
                                    onChange={(e) => setData('floors', e.target.value)}
                                    className={`block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.floors ? 'border-red-300' : ''
                                    }`}
                                    placeholder="Number of floors"
                                    min="0"
                                />
                                {errors.floors && <p className="mt-1 text-sm text-red-600">{errors.floors}</p>}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <div className="relative">
                                <DocumentTextIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                                <textarea
                                    id="description"
                                    rows={4}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className={`pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.description ? 'border-red-300' : ''
                                    }`}
                                    placeholder="Enter project description..."
                                />
                            </div>
                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                        </div>

                        {/* Images */}
                        <div>
                            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                                Project Images
                            </label>
                            <input
                                id="images"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => setData('images', Array.from(e.target.files))}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
                            {Array.isArray(data.images) && data.images.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {data.images.map((file, idx) => (
                                        <span key={idx} className="text-xs px-2 py-1 bg-gray-100 rounded border border-gray-200">
                                            {file.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                            <Link
                                href={window.route('projects.index')}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Creating...' : 'Create Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
