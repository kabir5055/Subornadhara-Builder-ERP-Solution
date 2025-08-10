import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    BuildingOfficeIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    CogIcon,
    DocumentTextIcon,
    BellIcon,
    ArchiveBoxIcon,
    UserIcon
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Dashboard', href: 'dashboard', icon: HomeIcon },
    { name: 'Projects', href: 'projects.index', icon: BuildingOfficeIcon },
    { name: 'Clients', href: 'clients.index', icon: UserGroupIcon },
    { name: 'Sales', href: 'sales.index', icon: CurrencyDollarIcon },
    { name: 'Finance', href: 'finance.index', icon: ChartBarIcon },
    { name: 'Employees', href: 'employees.index', icon: UserIcon },
    { name: 'Inventory', href: 'inventory.index', icon: ArchiveBoxIcon },
    { name: 'Reports', href: 'reports.index', icon: DocumentTextIcon },
    { name: 'Settings', href: 'settings.index', icon: CogIcon },
];

export default function Sidebar({ isOpen, setIsOpen }) {
    const { url } = usePage();

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 h-full bg-white shadow-2xl z-50 transition-all duration-300
                ${isOpen ? 'w-64' : 'w-20'}
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo */}
                <div className="flex items-center justify-center h-16 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">SB</span>
                        </div>
                        {isOpen && (
                            <span className="text-xl font-bold text-gray-800">
                                Subornadhara
                            </span>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="mt-8 px-4">
                    <ul className="space-y-2">
                        {navigation.map((item) => {
                            const ziggyRoute = typeof window !== 'undefined' && window.Ziggy && window.Ziggy.routes ? window.Ziggy.routes[item.href] : null;
                            const uri = ziggyRoute ? ziggyRoute.uri : item.href.replace('.', '/');
                            const baseSegment = `/${uri.split('/')[0]}`; // first path segment as section base
                            const isActive = url === '/' && item.href === 'dashboard' ? true : url.startsWith(baseSegment);
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={typeof window !== 'undefined' && window.route ? window.route(item.href) : `/${item.href.replace('.', '/')}`}
                                        className={`
                                            flex items-center px-4 py-3 text-sm font-medium rounded-xl
                                            transition-all duration-200 group
                                            ${isActive
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                                            }
                                        `}
                                    >
                                        <item.icon className={`
                                            ${isOpen ? 'mr-3' : 'mx-auto'}
                                            h-6 w-6 transition-colors duration-200
                                            ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'}
                                        `} />
                                        {isOpen && (
                                            <span className="transition-opacity duration-300">
                                                {item.name}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                {isOpen && (
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                            <p className="text-xs text-gray-600 text-center">
                                © 2025 Subornadhara Builder Ltd.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
