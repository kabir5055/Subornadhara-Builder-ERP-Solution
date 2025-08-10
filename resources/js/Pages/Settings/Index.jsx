import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ settings = {}, devices = [] }) {
  const [name, setName] = useState(settings.company?.name || '');
  const [color, setColor] = useState(settings.theme?.color || 'blue');
  const [busy, setBusy] = useState(false);

  const submitCompany = (e) => {
    e.preventDefault();
    setBusy(true);
    router.post(window.route('settings.company'), { name }, { onFinish: () => setBusy(false) });
  };

  const submitTheme = (e) => {
    e.preventDefault();
    setBusy(true);
    router.post(window.route('settings.theme'), { color }, { onFinish: () => setBusy(false) });
  };

  const [deviceName, setDeviceName] = useState('');
  const [deviceSerial, setDeviceSerial] = useState('');
  const [creating, setCreating] = useState(false);

  const createDevice = (e) => {
    e.preventDefault();
    setCreating(true);
    router.post(window.route('settings.devices.store'), { name: deviceName, serial: deviceSerial }, {
      onFinish: () => setCreating(false)
    });
  };

  return (
    <AppLayout>
      <Head title="Settings" />
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form onSubmit={submitCompany} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Company</h2>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border-gray-300 rounded-lg" placeholder="Company name" />
            <button type="submit" disabled={busy} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
          </form>

          <form onSubmit={submitTheme} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Theme</h2>
            <select value={color} onChange={(e) => setColor(e.target.value)} className="w-full border-gray-300 rounded-lg">
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="purple">Purple</option>
              <option value="orange">Orange</option>
            </select>
            <button type="submit" disabled={busy} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Apply</button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Attendance Devices</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Serial</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">API Key</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Last Seen</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {devices.map((d) => (
                  <tr key={d.id}>
                    <td className="px-4 py-2">{d.name}</td>
                    <td className="px-4 py-2 font-mono text-xs">{d.serial}</td>
                    <td className="px-4 py-2 font-mono text-xs">{d.api_key}</td>
                    <td className="px-4 py-2">{d.active ? 'Active' : 'Inactive'}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{d.last_seen || '-'}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => router.post(window.route('settings.devices.regenerate', { device: d.id }))}
                        className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Regenerate API Key
                      </button>
                    </td>
                  </tr>
                ))}
                {devices.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-gray-500" colSpan={5}>No devices yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <form onSubmit={createDevice} className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
            <input value={deviceName} onChange={(e) => setDeviceName(e.target.value)} placeholder="Device name" className="border-gray-300 rounded-lg" />
            <input value={deviceSerial} onChange={(e) => setDeviceSerial(e.target.value)} placeholder="Serial (optional)" className="border-gray-300 rounded-lg" />
            <button type="submit" disabled={creating} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add Device</button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
