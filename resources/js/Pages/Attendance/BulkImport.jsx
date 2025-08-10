import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function BulkImport() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!file) return;
    setProcessing(true);
    router.post(
      window.route('attendance.bulk-import'),
      { file },
      {
        forceFormData: true,
        preserveScroll: true,
        onFinish: () => setProcessing(false),
      }
    );
  };

  return (
    <AppLayout>
      <Head title="Attendance - Bulk Import" />
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Bulk Import Attendance</h1>
        <form onSubmit={submit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select file (CSV, XLSX)</label>
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
          </div>
          <button type="submit" disabled={!file || processing} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
            {processing ? 'Importing...' : 'Import'}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
