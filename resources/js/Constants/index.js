// Application constants

export const API_ENDPOINTS = {
    DASHBOARD: '/api/dashboard',
    PROJECTS: '/api/projects',
    CLIENTS: '/api/clients',
    SALES: '/api/sales',
    EMPLOYEES: '/api/employees',
    ATTENDANCE: '/api/attendance',
    FINANCE: '/api/finance',
    INVENTORY: '/api/inventory',
    REPORTS: '/api/reports',
    SETTINGS: '/api/settings'
};

export const PAYMENT_STATUS = {
    PENDING: 'pending',
    PARTIAL: 'partial',
    PAID: 'paid',
    OVERDUE: 'overdue'
};

export const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled'
};

export const SALE_STATUS = {
    BOOKED: 'booked',
    SOLD: 'sold',
    CANCELLED: 'cancelled'
};

export const PROJECT_STATUS = {
    PLANNING: 'planning',
    ONGOING: 'ongoing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

export const EMPLOYEE_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    TERMINATED: 'terminated'
};

export const USER_ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    EMPLOYEE: 'employee',
    AGENT: 'agent'
};

export const PAYMENT_METHODS = {
    CASH: 'cash',
    BANK_TRANSFER: 'bank_transfer',
    CHECK: 'check',
    ONLINE: 'online'
};

export const UNIT_TYPES = {
    STUDIO: 'Studio',
    ONE_BEDROOM: '1 Bedroom',
    TWO_BEDROOM: '2 Bedroom',
    THREE_BEDROOM: '3 Bedroom',
    FOUR_BEDROOM: '4 Bedroom',
    PENTHOUSE: 'Penthouse'
};

export const NOTIFICATION_TYPES = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error'
};

export const DATE_FORMATS = {
    SHORT: 'MMM DD, YYYY',
    LONG: 'MMMM DD, YYYY',
    NUMERIC: 'MM/DD/YYYY',
    ISO: 'YYYY-MM-DD'
};

export const PAGINATION = {
    DEFAULT_PER_PAGE: 15,
    OPTIONS: [10, 15, 25, 50, 100]
};

export const FILE_UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: {
        IMAGES: ['image/jpeg', 'image/png', 'image/gif'],
        DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        EXCEL: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
    }
};
