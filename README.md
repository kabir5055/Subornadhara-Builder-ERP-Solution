# Subornadhara Builder Ltd. ERP System

A comprehensive Enterprise Resource Planning (ERP) system built specifically for **Subornadhara Builder Ltd.**, a real estate development company. This modern, full-stack application streamlines business operations across multiple departments with an intuitive user interface and powerful backend functionality.

## 🏢 Company Overview

**Subornadhara Builder Ltd.** is a leading real estate development company specializing in residential and commercial projects in Dhaka, Bangladesh. This ERP system is designed to manage all aspects of the real estate business from project planning to client management and financial tracking.

## 🚀 Technology Stack

- **Backend Framework**: Laravel 12 (Latest)
- **Frontend**: Inertia.js with React & JSX
- **Styling**: Tailwind CSS with custom gradients
- **Database**: MySQL 8.0+
- **Authentication**: Laravel Breeze with Role-based Access
- **Icons**: Hero Icons
- **Charts**: Chart.js integration
- **Build Tool**: Vite with React plugin
- **Package Manager**: Composer & NPM

## ✨ Core Features

### 🏗️ **Project Management Module**
- Complete project lifecycle management
- Project status tracking (Planning, Ongoing, Completed)
- Progress monitoring with percentage completion
- Unit management and availability tracking
- Financial performance per project
- Document and image attachments

### 👥 **Client Management Module**
- Comprehensive client database
- Individual and corporate client support
- KYC document management (NID, Bank details)
- Client communication history
- Follow-up scheduling and reminders
- Client categorization and segmentation

### 💰 **Sales & Booking Module**
- Unit booking and reservation system
- Payment plan management
- Sales target tracking
- Commission calculation
- Booking documentation
- Payment schedule automation

### 📊 **Finance & Accounting Module**
- Complete financial transaction tracking
- Project-wise revenue and expense management
- Payment collection monitoring
- Financial reporting and analytics
- Budget planning and tracking
- Automated invoice generation

### 👨‍💼 **Human Resources Module**
- Employee database management
- Attendance tracking system
- Payroll management
- Department and designation hierarchy
- Employee performance tracking
- Leave management system

### 📦 **Inventory Management Module**
- Construction materials inventory
- Supplier management
- Purchase order tracking
- Stock level monitoring
- Material cost analysis
- Vendor performance evaluation

### 📈 **Reporting & Analytics Module**
- Real-time dashboard with KPIs
- Financial reports (P&L, Balance Sheet)
- Sales performance analysis
- Project progress reports
- Employee productivity reports
- Custom report generation

### 🔔 **Notification System**
- Real-time system notifications
- Email notifications for important events
- Follow-up reminders
- Payment due alerts
- Project milestone notifications
- System activity logs

### ⚙️ **Settings & Configuration**
- Role-based access control
- User permission management
- System configuration options
- Company profile management
- Backup and maintenance tools
- Audit trail logging

## 🔐 User Roles & Permissions

### **Administrator**
- Full system access
- User management
- System configuration
- All module permissions
- Report generation and export

### **Staff Member**
- Client management
- Sales operations
- Basic reporting
- Limited financial access

### **Sales Agent**
- Client database access
- Lead management
- Basic reporting
- Limited system access

## 🛠️ Installation & Setup

### Prerequisites
- PHP 8.2 or higher
- Composer 2.0+
- Node.js 18+ & NPM
- MySQL 8.0+
- Git

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd subornadhara_erp
   ```

2. **Install PHP Dependencies**
   ```bash
   composer install
   ```

3. **Install Node Dependencies**
   ```bash
   npm install
   ```

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database Setup**
   - Create MySQL database
   - Update `.env` file with database credentials
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=subornadhara_erp
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

6. **Run Migrations & Seeders**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

7. **Build Frontend Assets**
   ```bash
   npm run build
   ```

8. **Start Development Server**
   ```bash
   php artisan serve
   ```

9. **Access the Application**
   - URL: `http://127.0.0.1:8000`
   - Admin: `admin@subornadhara.com` / `admin123`
   - Staff: `staff@subornadhara.com` / `staff123`
   - Agent: `agent@subornadhara.com` / `agent123`

## 📊 Sample Data

The system comes with comprehensive sample data:
- **100 Clients** with realistic Bangladeshi names and contact information
- **50 Employees** across different departments and designations
- **25 Projects** representing various real estate developments
- **Role-based Users** with appropriate permissions
- **Financial Transactions** with realistic amounts and dates

## 🎨 UI/UX Design

### Design Philosophy
- **Modern Gradient Design**: Beautiful gradient backgrounds and elements
- **Responsive Layout**: Mobile-first approach with Tailwind CSS
- **Intuitive Navigation**: Clear sidebar navigation with active states
- **Professional Color Scheme**: Blue and purple gradients with clean whites
- **Accessibility**: WCAG compliant with proper contrast ratios

### Key Design Elements
- Gradient sidebar with smooth transitions
- Professional dashboard with statistical cards
- Clean forms with proper validation
- Interactive tables with sorting and filtering
- Modern button styles and hover effects
- Responsive grid layouts

## 🚦 API Endpoints

### Authentication
- `POST /login` - User authentication
- `POST /logout` - User logout
- `GET /dashboard` - Main dashboard

### Projects
- `GET /projects` - List all projects
- `POST /projects` - Create new project
- `GET /projects/{id}` - View project details
- `PUT /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project

### Clients
- `GET /clients` - List all clients
- `POST /clients` - Create new client
- `GET /clients/{id}` - View client details
- `PUT /clients/{id}` - Update client
- `DELETE /clients/{id}` - Delete client

### Sales
- `GET /sales/bookings` - List all bookings
- `POST /sales/bookings` - Create new booking
- `GET /sales/payments` - List all payments
- `POST /sales/payments` - Record payment

### Finance
- `GET /finance/transactions` - List transactions
- `POST /finance/transactions` - Create transaction
- `GET /finance/reports` - Financial reports

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with sidebar navigation
- **Tablet**: Adapted layout with collapsible sidebar
- **Mobile**: Mobile-optimized interface with bottom navigation
- **Touch Devices**: Touch-friendly buttons and form elements

## 🔒 Security Features

- **Authentication**: Laravel Breeze with secure password hashing
- **Authorization**: Role-based access control with Spatie Permissions
- **CSRF Protection**: Laravel's built-in CSRF protection
- **SQL Injection Prevention**: Eloquent ORM with parameter binding
- **XSS Prevention**: Blade template escaping
- **Session Security**: Secure session configuration

## 📈 Performance Optimization

- **Database Indexing**: Optimized database queries with proper indexing
- **Asset Optimization**: Vite build system with asset minification
- **Caching**: Laravel's caching system for improved performance
- **Lazy Loading**: Image and component lazy loading
- **Code Splitting**: Automatic code splitting with Vite

## 🧪 Testing

### Running Tests
```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature

# Run tests with coverage
php artisan test --coverage
```

### Test Coverage
- Unit tests for models and services
- Feature tests for API endpoints
- Browser tests for UI functionality
- Database tests for migrations and seeders

## 📚 Documentation

### Code Documentation
- Comprehensive inline comments
- PHPDoc blocks for all methods
- README files for each module
- API documentation with examples

### User Documentation
- User manual with screenshots
- Video tutorials for key features
- FAQ section for common issues
- Technical support documentation

## 🚀 Deployment

### Production Deployment
1. **Server Requirements**
   - Ubuntu 20.04+ or CentOS 8+
   - Apache 2.4+ or Nginx 1.18+
   - PHP 8.2+ with required extensions
   - MySQL 8.0+ or PostgreSQL 12+

2. **Environment Setup**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd subornadhara_erp
   
   # Install dependencies
   composer install --optimize-autoloader --no-dev
   npm install && npm run build
   
   # Configure environment
   cp .env.example .env
   php artisan key:generate
   php artisan migrate --force
   php artisan db:seed --force
   
   # Set permissions
   chmod -R 755 storage bootstrap/cache
   chown -R www-data:www-data storage bootstrap/cache
   ```

3. **Web Server Configuration**
   ```apache
   # Apache Virtual Host
   <VirtualHost *:80>
       ServerName yourdomain.com
       DocumentRoot /var/www/subornadhara_erp/public
       
       <Directory /var/www/subornadhara_erp/public>
           AllowOverride All
           Require all granted
       </Directory>
   </VirtualHost>
   ```

### Docker Deployment
```dockerfile
# Dockerfile included for containerized deployment
# Use docker-compose for easy deployment
docker-compose up -d
```

## 🔧 Maintenance

### Regular Maintenance Tasks
- **Database Backup**: Automated daily backups
- **Log Rotation**: Automatic log file management
- **Security Updates**: Regular framework and dependency updates
- **Performance Monitoring**: System performance tracking
- **Data Cleanup**: Automated cleanup of old records

### Monitoring
- **Error Tracking**: Integrated error logging and reporting
- **Performance Metrics**: Response time and database query monitoring
- **User Activity**: Audit logs for user actions
- **System Health**: Server resource monitoring

## 👨‍💻 Development Team

**Developed by**: GitHub Copilot AI Assistant  
**For**: Subornadhara Builder Ltd.  
**Framework**: Laravel 12 with Modern Frontend Stack  
**Completion Date**: August 2025  

## 📄 License

This ERP system is proprietary software developed exclusively for Subornadhara Builder Ltd. All rights reserved.

## 📞 Support

For technical support or feature requests:
- **Email**: support@subornadhara.com
- **Phone**: +880-123-456-789
- **Website**: https://subornadhara.com

---

**© 2025 Subornadhara Builder Ltd. - All Rights Reserved**

*Built with ❤️ using Laravel 12, Inertia.js, React, and Tailwind CSS*

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
