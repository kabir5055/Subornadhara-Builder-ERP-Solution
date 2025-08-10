import React from 'react';
import { Head } from '@inertiajs/react';

export default function Test() {
    React.useEffect(() => {
        console.log('🔍 Test component mounted');
        console.log('🔍 window.route available:', typeof window.route);
        console.log('🔍 window.Ziggy available:', typeof window.Ziggy);

        if (window.route) {
            try {
                const loginUrl = window.route('login');
                console.log('🔍 Login route test:', loginUrl);
            } catch (error) {
                console.error('🔍 Route test failed:', error);
            }
        }
    }, []);

    return (
        <>
            <Head title="Test Page" />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Page</h1>
                    <p className="text-gray-600">Check browser console for debugging info</p>
                    <div className="mt-4">
                        <button
                            onClick={() => {
                                if (window.route) {
                                    const url = window.route('dashboard');
                                    console.log('Dashboard URL:', url);
                                } else {
                                    console.log('Route function not available');
                                }
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Test Route Function
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
