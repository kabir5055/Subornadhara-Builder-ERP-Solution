import React, { useRef, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ArrowDownTrayIcon, ArrowUpTrayIcon, DocumentArrowDownIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function ActionBar({ baseRouteName, moduleSlug }) {
  const fileRef = useRef();
  const [busy, setBusy] = useState(false);
  const [showOpts, setShowOpts] = useState(false);
  const [columns, setColumns] = useState('');
  const [limit, setLimit] = useState('100');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [dateCol, setDateCol] = useState('created_at');
  const [sortBy, setSortBy] = useState('');
  const [sortDir, setSortDir] = useState('desc');
  const [format, setFormat] = useState('xlsx');
  const [paper, setPaper] = useState('a4');
  const [orientation, setOrientation] = useState('portrait');

  const handleImport = (e) => {
    e.preventDefault();
    if (!fileRef.current?.files?.length) return;
    const formData = new FormData();
    formData.append('file', fileRef.current.files[0]);
    setBusy(true);
    router.post(window.route(`${baseRouteName}.import`), formData, {
      forceFormData: true,
      onFinish: () => setBusy(false),
    });
  };

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (columns.trim()) params.set('columns', columns.trim());
    if (limit) params.set('limit', limit);
    if (dateFrom) params.set('date_from', dateFrom);
    if (dateTo) params.set('date_to', dateTo);
    if (dateCol) params.set('date_column', dateCol);
    if (sortBy) params.set('sort_by', sortBy);
    if (sortDir) params.set('sort_dir', sortDir);
    if (format) params.set('format', format);
    if (paper) params.set('paper', paper);
    if (orientation) params.set('orientation', orientation);
    return params.toString();
  };

  const exportHref = () => {
    const base = window.route(`${baseRouteName}.export`);
    const q = buildQuery();
    return q ? `${base}?${q}` : base;
  };

  const pdfHref = () => {
    const base = window.route(`${baseRouteName}.pdf`);
    const q = buildQuery();
    return q ? `${base}?${q}` : base;
  };

  const reset = () => {
    setColumns('');
    setLimit('100');
    setDateFrom('');
    setDateTo('');
    setDateCol('created_at');
    setSortBy('');
    setSortDir('desc');
    setFormat('xlsx');
    setPaper('a4');
    setOrientation('portrait');
  };

  return (
    <div className="flex items-center gap-2">
      <form onSubmit={handleImport} className="flex items-center gap-2">
        <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv,.txt" className="hidden" id={`imp-${moduleSlug}`} />
        <label htmlFor={`imp-${moduleSlug}`} className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded-md text-sm cursor-pointer hover:bg-gray-50">
          <ArrowUpTrayIcon className="w-4 h-4" /> Import
        </label>
        <button type="submit" disabled={busy} className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50">
          Upload
        </button>
      </form>

      <button type="button" onClick={() => setShowOpts(!showOpts)} className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded-md text-sm hover:bg-gray-50">
        <AdjustmentsHorizontalIcon className="w-4 h-4" /> Options
      </button>

      <a href={exportHref()} className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">
        <ArrowDownTrayIcon className="w-4 h-4" /> Export
      </a>

      <a href={pdfHref()} className="inline-flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded-md text-sm hover:bg-slate-800">
        <DocumentArrowDownIcon className="w-4 h-4" /> PDF
      </a>

      {showOpts && (
        <div className="absolute mt-48 z-20 bg-white border rounded-lg shadow-lg p-4 w-[680px]">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Columns (CSV)</label>
              <input value={columns} onChange={(e) => setColumns(e.target.value)} placeholder="id,name,created_at" className="w-full border rounded px-2 py-1 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Limit</label>
              <input type="number" min="1" value={limit} onChange={(e) => setLimit(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Date From</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Date To</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Date Column</label>
              <input value={dateCol} onChange={(e) => setDateCol(e.target.value)} placeholder="created_at" className="w-full border rounded px-2 py-1 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Sort By</label>
                <input value={sortBy} onChange={(e) => setSortBy(e.target.value)} placeholder="created_at" className="w-full border rounded px-2 py-1 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Sort Dir</label>
                <select value={sortDir} onChange={(e) => setSortDir(e.target.value)} className="w-full border rounded px-2 py-1 text-sm">
                  <option value="desc">desc</option>
                  <option value="asc">asc</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Export Format</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full border rounded px-2 py-1 text-sm">
                <option value="xlsx">XLSX</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">PDF Paper</label>
                <select value={paper} onChange={(e) => setPaper(e.target.value)} className="w-full border rounded px-2 py-1 text-sm">
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Orientation</label>
                <select value={orientation} onChange={(e) => setOrientation(e.target.value)} className="w-full border rounded px-2 py-1 text-sm">
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-3">
            <button type="button" onClick={reset} className="px-3 py-1.5 border rounded text-sm">Reset</button>
            <button type="button" onClick={() => setShowOpts(false)} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
