import React, { useEffect, useState } from 'react';

export default function RouteDebug() {
    const [routeStatus, setRouteStatus] = useState('checking...');
    const [testRoutes, setTestRoutes] = useState({});

    useEffect(() => {
        // Check if route function is available
        if (typeof window !== 'undefined' && window.route) {
            setRouteStatus('✅ Route function is available');

            // Test some common routes
            const tests = {
                dashboard: window.route('dashboard'),
                'projects.index': window.route('projects.index'),
                'clients.index': window.route('clients.index'),
                login: window.route('login'),
            };
            setTestRoutes(tests);
        } else {
            setRouteStatus('❌ Route function not available');
        }
    }, []);

    return (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border max-w-xs z-50">
            <h3 className="font-bold text-sm mb-2">Route Debug</h3>
            <p className="text-xs mb-2">{routeStatus}</p>
            {Object.keys(testRoutes).length > 0 && (
                <div className="text-xs">
                    <p className="font-semibold mb-1">Test Routes:</p>
                    {Object.entries(testRoutes).map(([name, url]) => (
                        <div key={name} className="mb-1">
                            <span className="text-blue-600">{name}:</span> {url}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
