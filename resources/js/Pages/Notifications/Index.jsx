import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ notifications = [] }) {
  return (
    <AppLayout>
      <Head title="Notifications" />
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {notifications.length === 0 ? (
            <p className="text-gray-600">No notifications yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {notifications.map((n) => (
                <li key={n.id} className="py-3">{n.message}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
