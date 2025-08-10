import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function Index({ filters = {} }) {
  const [type, setType] = useState(filters.type || 'hr');
  const [processing, setProcessing] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    setProcessing(true);
    router.post(window.route('reports.generate'), { type }, {
      preserveScroll: true,
      onFinish: () => setProcessing(false),
    });
  };

  return (
    <AppLayout>
      <Head title="Reports" />

      <div className="space-y-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="mt-2 text-sm text-gray-600">Generate and export ERP reports.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleGenerate} className="flex items-center gap-4">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="hr">HR</option>
              <option value="sales">Sales</option>
              <option value="finance">Finance</option>
              <option value="inventory">Inventory</option>
              <option value="projects">Projects</option>
            </select>
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors"
            >
              <DocumentTextIcon className="w-5 h-5 mr-2" /> Generate
            </button>
            <Link
              href={`${window.route('reports.export', { type })}`}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-colors"
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" /> Export
            </Link>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
