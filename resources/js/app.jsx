import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { route } from 'ziggy-js';
import { Ziggy } from './ziggy';

const appName = import.meta.env.VITE_APP_NAME || 'Subornadhara Builder ERP';

// Expose Ziggy and route globally and use Ziggy definitions for all URLs
window.Ziggy = typeof window !== 'undefined' && window.Ziggy ? window.Ziggy : Ziggy;
window.route = (name, params = {}, absolute = false) => {
    const z = (typeof window !== 'undefined' && window.Ziggy) ? window.Ziggy : Ziggy;
    try {
        return route(name, params, absolute, z);
    } catch (e) {
        console.warn('Ziggy route not found:', name, e?.message);
        return '#';
    }
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        if (!el) {
            console.error('❌ Inertia.js mount element not found');
            return;
        }

        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4F46E5',
    },
});
