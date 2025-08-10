import React from 'react';
import {
    CheckCircleIcon,
    XCircleIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export const Alert = ({
    type = 'info',
    title,
    message,
    onClose,
    className = ''
}) => {
    const alertConfig = {
        success: {
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            textColor: 'text-green-800',
            iconColor: 'text-green-400',
            icon: CheckCircleIcon
        },
        error: {
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            textColor: 'text-red-800',
            iconColor: 'text-red-400',
            icon: XCircleIcon
        },
        warning: {
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            textColor: 'text-yellow-800',
            iconColor: 'text-yellow-400',
            icon: ExclamationTriangleIcon
        },
        info: {
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-800',
            iconColor: 'text-blue-400',
            icon: InformationCircleIcon
        }
    };

    const config = alertConfig[type];
    const Icon = config.icon;

    return (
        <div className={`rounded-md ${config.bgColor} border ${config.borderColor} p-4 ${className}`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    <Icon className={`h-5 w-5 ${config.iconColor}`} />
                </div>
                <div className="ml-3 flex-1">
                    {title && (
                        <h3 className={`text-sm font-medium ${config.textColor}`}>
                            {title}
                        </h3>
                    )}
                    {message && (
                        <div className={`${title ? 'mt-2' : ''} text-sm ${config.textColor}`}>
                            {message}
                        </div>
                    )}
                </div>
                {onClose && (
                    <div className="ml-auto pl-3">
                        <div className="-mx-1.5 -my-1.5">
                            <button
                                type="button"
                                onClick={onClose}
                                className={`inline-flex rounded-md p-1.5 ${config.textColor} hover:${config.bgColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${config.bgColor} focus:ring-${config.iconColor}`}
                            >
                                <XCircleIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Toast = ({ type, title, message, onClose }) => {
    return (
        <div className="fixed top-4 right-4 z-50 w-96">
            <Alert
                type={type}
                title={title}
                message={message}
                onClose={onClose}
                className="shadow-lg"
            />
        </div>
    );
};
