# Subornadhara Builder ERP - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a comprehensive ERP (Enterprise Resource Planning) system for **Subornadhara Builder Ltd.**, a real estate development company. The system is built using Laravel 12 with Inertia.js and Blade for a modern, SPA-like experience.

## Technology Stack

- **Backend**: Laravel 12 (latest stable version)
- **Frontend**: Inertia.js with Blade + Tailwind CSS (no Vue or React)
- **Database**: MySQL with Eloquent ORM
- **Authentication**: Laravel Breeze with role-based access (Admin, Staff, Agent)
- **UI Framework**: Tailwind CSS + Hero Icons + Lucida icons
- **Charts**: Chart.js for dashboards
- **PDF/Excel Export**: Laravel Excel + DomPDF

## ERP Modules

The system includes the following modules, each with full CRUD operations:

1. **Project Management** - Projects, Units, Floors, Status, Progress
2. **Client Management** - Clients, Contacts, KYC docs, Follow-up Notes
3. **Sales Management** - Booking, Payments, Invoices, Installments
4. **Finance** - Income/Expense Tracking, Ledger, Due Summary
5. **Employee & HR** - Staff Records, Attendance, Salary, Promotions
6. **Inventory/Materials** - Product/Material Entry, Stock, Suppliers
7. **Reporting Module** - PDF, Excel & Chart-based dashboard
8. **Notification System** - Project updates, dues, client alerts
9. **Settings Module** - General Config, Branding, User Roles & Permissions

## Code Style Guidelines

- Use **Laravel best practices** and follow PSR-12 coding standards
- **Inertia.js patterns** for frontend with Blade templates
- **Resource controllers** for all CRUD operations
- **Form Request classes** for validation
- **Eloquent relationships** properly defined
- **Database migrations** with proper foreign key constraints
- **Model factories and seeders** for test data
- **Policy classes** for authorization
- **Service classes** for complex business logic

## Frontend Guidelines

- Use **Tailwind CSS** classes for styling
- **Responsive design** with mobile-first approach
- **Modern card-based layouts** with soft shadows and gradients
- **Inertia.js** for SPA-like navigation without page reloads
- **Hero Icons** for UI elements
- **Chart.js** for data visualization

## Database Guidelines

- Use **descriptive table and column names**
- **Proper indexing** for performance
- **Foreign key constraints** for data integrity
- **Soft deletes** where appropriate
- **Timestamps** on all tables

## Security Guidelines

- **Role-based access control** using Spatie Laravel Permission
- **CSRF protection** on all forms
- **Input validation** and sanitization
- **SQL injection prevention** using Eloquent ORM
- **File upload security** with proper validation

## Performance Guidelines

- **Eager loading** to prevent N+1 queries
- **Pagination** for large datasets
- **Database indexing** for frequently queried columns
- **Caching** for frequently accessed data
- **Image optimization** for uploaded files

When generating code for this project, please:

1. Follow Laravel conventions and best practices
2. Use Inertia.js patterns for frontend interactions
3. Implement proper error handling and validation
4. Include proper documentation and comments
5. Consider security and performance implications
6. Use responsive Tailwind CSS classes
7. Implement proper role-based access control
