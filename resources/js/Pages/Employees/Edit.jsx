import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Edit({ employee }) {
    // Mock employee data if not provided
    const mockEmployee = employee || {
        id: 1,
        employee_id: 'EMP-001',
        name: 'Fatima Rahman',
        email: 'fatima.rahman@subornadhara.com',
        phone: '01711-123456',
        department: 'Sales',
        designation: 'Sales Manager',
        salary: 85000.00,
        hire_date: '2023-01-15',
        status: 'active',
        address: 'House 25, Road 12, Dhanmondi, Dhaka',
        emergency_contact: '01911-654321',
        nid: '1234567890123',
        education: 'MBA in Marketing, University of Dhaka\nBBA in Business Administration, North South University',
        experience: '5+ years in real estate sales and customer relationship management. Previously worked at Square Habitat and Sheltech Properties.',
        skills: 'Client Relationship Management, Sales Strategy, Property Valuation, Team Leadership, Market Analysis',
        notes: 'Top performer in sales team. Excellent communication skills and client relationship management.',
        photo: null,
    };

    const { data, setData, put, processing, errors } = useForm({
        employee_id: mockEmployee.employee_id || '',
        name: mockEmployee.name || '',
        email: mockEmployee.email || '',
        phone: mockEmployee.phone || '',
        department: mockEmployee.department || '',
        designation: mockEmployee.designation || '',
        salary: mockEmployee.salary || '',
        hire_date: mockEmployee.hire_date || '',
        status: mockEmployee.status || 'active',
        address: mockEmployee.address || '',
        emergency_contact: mockEmployee.emergency_contact || '',
        nid: mockEmployee.nid || '',
        education: mockEmployee.education || '',
        experience: mockEmployee.experience || '',
        skills: mockEmployee.skills || '',
        notes: mockEmployee.notes || '',
        photo: null,
    });

    const departments = [
        'Sales',
        'Engineering',
        'Finance',
        'HR',
        'Admin',
        'Marketing',
        'Operations',
        'Legal',
        'IT'
    ];

    const designationsByDepartment = {
        'Sales': ['Sales Manager', 'Sales Executive', 'Sales Representative', 'Sales Coordinator'],
        'Engineering': ['Civil Engineer', 'Architect', 'Site Engineer', 'Project Engineer', 'Structural Engineer'],
        'Finance': ['Finance Manager', 'Accounts Manager', 'Accountant', 'Accounts Officer', 'Finance Officer'],
        'HR': ['HR Manager', 'HR Officer', 'HR Executive', 'Recruitment Officer'],
        'Admin': ['Admin Manager', 'Office Manager', 'Admin Officer', 'Secretary'],
        'Marketing': ['Marketing Manager', 'Marketing Executive', 'Digital Marketing Specialist', 'Content Creator'],
        'Operations': ['Operations Manager', 'Operations Officer', 'Site Supervisor', 'Quality Controller'],
        'Legal': ['Legal Manager', 'Legal Officer', 'Legal Advisor'],
        'IT': ['IT Manager', 'System Administrator', 'Software Developer', 'IT Support']
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('employees.update', mockEmployee.id));
    };

    const generateEmployeeId = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const random = Math.floor(Math.random() * 100).toString().padStart(3, '0');
        const empId = `EMP-${year}${month}-${random}`;
        setData('employee_id', empId);
    };

    const handleDepartmentChange = (department) => {
        setData('department', department);
        // Only reset designation if it doesn't exist in the new department
        if (data.designation && designationsByDepartment[department] && !designationsByDepartment[department].includes(data.designation)) {
            setData('designation', '');
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const calculateTenure = (hireDate) => {
        const hire = new Date(hireDate);
        const now = new Date();
        const diffTime = Math.abs(now - hire);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);

        if (years > 0) {
            return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
        } else {
            return `${months} month${months > 1 ? 's' : ''}`;
        }
    };

    return (
        <AppLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Employee - {mockEmployee.name}
                    </h2>
                </div>
            }
        >
            <Head title={`Edit Employee - ${mockEmployee.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Current Employee Info */}
                                <div className="md:col-span-2 mb-6">
                                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Current Employee Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-blue-700 font-medium">ID:</span> {mockEmployee.employee_id}
                                            </div>
                                            <div>
                                                <span className="text-blue-700 font-medium">Department:</span> {mockEmployee.department}
                                            </div>
                                            <div>
                                                <span className="text-blue-700 font-medium">Designation:</span> {mockEmployee.designation}
                                            </div>
                                            <div>
                                                <span className="text-blue-700 font-medium">Tenure:</span> {calculateTenure(mockEmployee.hire_date)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Basic Information */}
                                <div className="md:col-span-2">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Employee ID
                                    </label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={data.employee_id}
                                            onChange={(e) => setData('employee_id', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g., EMP-2024-001"
                                        />
                                        <button
                                            type="button"
                                            onClick={generateEmployeeId}
                                            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                                        >
                                            Generate
                                        </button>
                                    </div>
                                    {errors.employee_id && <p className="mt-1 text-sm text-red-600">{errors.employee_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Employee full name"
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="employee@subornadhara.com"
                                        required
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="01711-123456"
                                        required
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        National ID (NID)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nid}
                                        onChange={(e) => setData('nid', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="1234567890123"
                                    />
                                    {errors.nid && <p className="mt-1 text-sm text-red-600">{errors.nid}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Emergency Contact
                                    </label>
                                    <input
                                        type="text"
                                        value={data.emergency_contact}
                                        onChange={(e) => setData('emergency_contact', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="01911-654321"
                                    />
                                    {errors.emergency_contact && <p className="mt-1 text-sm text-red-600">{errors.emergency_contact}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address
                                    </label>
                                    <textarea
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="House/Flat, Road, Area, City"
                                    />
                                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                </div>

                                {/* Job Information */}
                                <div className="md:col-span-2 mt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Information</h3>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Department *
                                    </label>
                                    <select
                                        value={data.department}
                                        onChange={(e) => handleDepartmentChange(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Designation *
                                    </label>
                                    <select
                                        value={data.designation}
                                        onChange={(e) => setData('designation', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        disabled={!data.department}
                                        required
                                    >
                                        <option value="">Select Designation</option>
                                        {data.department && designationsByDepartment[data.department]?.map(designation => (
                                            <option key={designation} value={designation}>{designation}</option>
                                        ))}
                                    </select>
                                    {errors.designation && <p className="mt-1 text-sm text-red-600">{errors.designation}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Monthly Salary (BDT) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.salary}
                                        onChange={(e) => setData('salary', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Monthly salary amount"
                                        required
                                    />
                                    {data.salary && (
                                        <p className="mt-1 text-sm text-gray-500">
                                            Preview: {formatCurrency(parseFloat(data.salary || 0))}
                                        </p>
                                    )}
                                    {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hire Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.hire_date}
                                        onChange={(e) => setData('hire_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                    {errors.hire_date && <p className="mt-1 text-sm text-red-600">{errors.hire_date}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Employment Status *
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="on_leave">On Leave</option>
                                        <option value="probation">Probation</option>
                                    </select>
                                    {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                                </div>

                                {/* Professional Information */}
                                <div className="md:col-span-2 mt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information (Optional)</h3>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Education
                                    </label>
                                    <textarea
                                        value={data.education}
                                        onChange={(e) => setData('education', e.target.value)}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Educational background and qualifications"
                                    />
                                    {errors.education && <p className="mt-1 text-sm text-red-600">{errors.education}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Experience
                                    </label>
                                    <textarea
                                        value={data.experience}
                                        onChange={(e) => setData('experience', e.target.value)}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Previous work experience"
                                    />
                                    {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Skills
                                    </label>
                                    <textarea
                                        value={data.skills}
                                        onChange={(e) => setData('skills', e.target.value)}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Key skills and competencies"
                                    />
                                    {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Update Profile Photo
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('photo', e.target.files[0])}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.photo && <p className="mt-1 text-sm text-red-600">{errors.photo}</p>}
                                    <p className="mt-1 text-sm text-gray-500">Leave empty to keep current photo</p>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notes
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Additional notes about the employee..."
                                    />
                                    {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                                </div>

                                {/* Updated Employee Preview */}
                                {data.name && data.department && data.designation && (
                                    <div className="md:col-span-2 mt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Updated Employee Preview</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-600">Name</p>
                                                    <p className="font-medium">{data.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Department</p>
                                                    <p className="font-medium">{data.department}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Designation</p>
                                                    <p className="font-medium">{data.designation}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Salary</p>
                                                    <p className="font-medium text-green-600">
                                                        {formatCurrency(parseFloat(data.salary || 0))}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Status</p>
                                                    <p className="font-medium capitalize">{data.status.replace('_', ' ')}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Employee ID</p>
                                                    <p className="font-medium font-mono">{data.employee_id}</p>
                                                </div>
                                            </div>
                                            {(data.salary !== String(mockEmployee.salary) || data.department !== mockEmployee.department) && (
                                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                                    <div className="text-sm text-yellow-800">
                                                        <strong>Changes detected:</strong>
                                                        {data.salary !== String(mockEmployee.salary) && (
                                                            <span className="block">• Salary: {formatCurrency(mockEmployee.salary)} → {formatCurrency(parseFloat(data.salary || 0))}</span>
                                                        )}
                                                        {data.department !== mockEmployee.department && (
                                                            <span className="block">• Department: {mockEmployee.department} → {data.department}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Edit History */}
                                <div className="md:col-span-2 mt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit History</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Original Hire Date</p>
                                                <p className="font-medium">{new Date(mockEmployee.hire_date).toLocaleDateString('en-GB')}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Last Modified</p>
                                                <p className="font-medium">{new Date().toLocaleDateString('en-GB')}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Current Tenure</p>
                                                <p className="font-medium">{calculateTenure(mockEmployee.hire_date)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Employee Since</p>
                                                <p className="font-medium">{new Date(mockEmployee.created_at || Date.now()).toLocaleDateString('en-GB')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 mt-8">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {processing ? 'Updating Employee...' : 'Update Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
