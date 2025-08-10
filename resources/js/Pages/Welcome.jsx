import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    BuildingOfficeIcon,
    ChartBarIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    ArrowRightIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function Welcome({ canLogin, canRegister, laravelVersion, phpVersion }) {
    const features = [
        {
            icon: BuildingOfficeIcon,
            title: 'Project Management',
            description: 'Comprehensive project tracking, unit management, and progress monitoring for all your real estate developments.'
        },
        {
            icon: UserGroupIcon,
            title: 'Client Management',
            description: 'Complete client database with KYC documentation, follow-up tracking, and relationship management.'
        },
        {
            icon: CurrencyDollarIcon,
            title: 'Sales & Finance',
            description: 'Booking management, payment tracking, invoicing, and complete financial oversight for your business.'
        },
        {
            icon: ChartBarIcon,
            title: 'Advanced Reporting',
            description: 'Real-time dashboards, comprehensive reports, and data visualization for informed decision making.'
        }
    ];

    const benefits = [
        'Complete ERP solution tailored for real estate development',
        'Modern, responsive design with intuitive user interface',
        'Role-based access control for Admin, Staff, and Agents',
        'Real-time notifications and alerts system',
        'Comprehensive reporting with PDF and Excel exports',
        'Secure data management with backup and recovery'
    ];

    return (
        <>
            <Head title="Welcome to Subornadhara Builder ERP" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                {/* Navigation */}
                <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo */}
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">SB</span>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Subornadhara Builder</h1>
                                    <p className="text-xs text-gray-600">Enterprise Resource Planning</p>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            {canLogin && (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={typeof window !== 'undefined' && window.route ? route('login') : '/login'}
                                        className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                                    >
                                        Login
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={typeof window !== 'undefined' && window.route ? route('register') : '/register'}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                        >
                                            Register
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div className="text-center">
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Subornadhara Builder
                                </span>
                                <br />
                                <span className="text-gray-800">ERP System</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                                Comprehensive Enterprise Resource Planning solution designed specifically for
                                real estate development companies. Streamline your projects, manage clients,
                                track finances, and grow your business with our modern, intuitive platform.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {canLogin && (
                                    <Link
                                        href={typeof window !== 'undefined' && window.route ? route('login') : '/login'}
                                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                    >
                                        Get Started
                                        <ArrowRightIcon className="w-5 h-5 ml-2" />
                                    </Link>
                                )}
                                <button className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-xl border border-gray-200 hover:border-gray-300 transition-all duration-200">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
                        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
                        <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl"></div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-20 bg-white/50 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                Powerful Features for Real Estate Development
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Everything you need to manage your real estate development business
                                efficiently and effectively in one integrated platform.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                    Why Choose Subornadhara Builder ERP?
                                </h2>
                                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                    Built specifically for real estate development companies, our ERP system
                                    provides all the tools you need to manage projects, clients, sales,
                                    and finances in one integrated platform.
                                </p>
                                <div className="space-y-4">
                                    {benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
                                    <h3 className="text-2xl font-bold mb-6">System Specifications</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-blue-100">Laravel Version:</span>
                                            <span className="font-semibold">{laravelVersion}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-blue-100">PHP Version:</span>
                                            <span className="font-semibold">{phpVersion}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-blue-100">Frontend:</span>
                                            <span className="font-semibold">React + Inertia.js</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-blue-100">UI Framework:</span>
                                            <span className="font-semibold">Tailwind CSS</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-blue-100">Database:</span>
                                            <span className="font-semibold">MySQL</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Ready to Transform Your Business?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                            Join the digital transformation of real estate development.
                            Start managing your projects, clients, and finances more efficiently today.
                        </p>
                        {canLogin && (
                            <Link
                                href={typeof window !== 'undefined' && window.route ? route('login') : '/login'}
                                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                            >
                                Access Your Dashboard
                                <ArrowRightIcon className="w-5 h-5 ml-2" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">SB</span>
                                    </div>
                                    <span className="text-xl font-bold">Subornadhara Builder</span>
                                </div>
                                <p className="text-gray-400 leading-relaxed">
                                    Comprehensive ERP solution for real estate development companies.
                                    Streamline your operations and grow your business.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                                <ul className="space-y-2 text-gray-400">
                                    <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                                <div className="space-y-2 text-gray-400">
                                    <p>Email: info@subornadhara.com</p>
                                    <p>Phone: +880 1XXX-XXXXXX</p>
                                    <p>Address: Dhaka, Bangladesh</p>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                            <p>&copy; 2025 Subornadhara Builder Ltd. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
