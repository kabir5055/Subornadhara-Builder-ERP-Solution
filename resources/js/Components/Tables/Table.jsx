import React from 'react';

export const Table = ({ children, className = '' }) => {
    return (
        <div className="overflow-x-auto">
            <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
                {children}
            </table>
        </div>
    );
};

export const TableHeader = ({ children }) => {
    return (
        <thead className="bg-gray-50">
            {children}
        </thead>
    );
};

export const TableBody = ({ children }) => {
    return (
        <tbody className="bg-white divide-y divide-gray-200">
            {children}
        </tbody>
    );
};

export const TableRow = ({ children, onClick, className = '' }) => {
    const rowClasses = `${onClick ? 'cursor-pointer hover:bg-gray-50' : ''} ${className}`;

    return (
        <tr onClick={onClick} className={rowClasses}>
            {children}
        </tr>
    );
};

export const TableHead = ({ children, sortable, onSort, className = '' }) => {
    const headClasses = `px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${sortable ? 'cursor-pointer hover:bg-gray-100' : ''} ${className}`;

    return (
        <th onClick={sortable ? onSort : undefined} className={headClasses}>
            <div className="flex items-center space-x-1">
                <span>{children}</span>
                {sortable && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                )}
            </div>
        </th>
    );
};

export const TableCell = ({ children, className = '' }) => {
    return (
        <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}>
            {children}
        </td>
    );
};

export const ActionCell = ({ children }) => {
    return (
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex justify-end space-x-2">
                {children}
            </div>
        </td>
    );
};
