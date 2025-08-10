import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    Bars3Icon,
    BellIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function Navbar({ sidebarOpen, setSidebarOpen, user }) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleLogout = () => {
        const logoutUrl = typeof window !== 'undefined' && window.route ? window.route('logout') : '/logout';
        router.post(logoutUrl);
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Left side */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </button>

                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="hidden lg:block p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </button>
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <Link href={typeof window !== 'undefined' && window.route ? window.route('notifications.index') : '/notifications'} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative">
                        <BellIcon className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                            3
                        </span>
                    </Link>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
                        >
                            <UserCircleIcon className="w-8 h-8 text-gray-600" />
                            {user && (
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium text-gray-900">{user.name || 'Admin User'}</p>
                                    <p className="text-xs text-gray-500">{user.role || 'Administrator'}</p>
                                </div>
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                <div className="py-1">
                                    <Link
                                        href={typeof window !== 'undefined' && window.route ? window.route('profile.edit') : '/profile'}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setShowProfileMenu(false)}
                                    >
                                        <Cog6ToothIcon className="w-4 h-4 mr-3" />
                                        Profile Settings
                                    </Link>
                                    <hr className="border-gray-200" />
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
