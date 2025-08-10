import React from 'react';

export const Input = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    className = '',
    ...props
}) => {
    const inputClasses = `
        block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
        placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500
        ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
        ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''}
        ${className}
    `;

    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className={inputClasses.trim()}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export const TextArea = ({
    label,
    placeholder,
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    rows = 3,
    className = '',
    ...props
}) => {
    const textareaClasses = `
        block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
        placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-vertical
        ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
        ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''}
        ${className}
    `;

    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                rows={rows}
                className={textareaClasses.trim()}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export const Select = ({
    label,
    value,
    onChange,
    options = [],
    placeholder,
    error,
    required = false,
    disabled = false,
    className = '',
    ...props
}) => {
    const selectClasses = `
        block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm
        focus:outline-none focus:ring-blue-500 focus:border-blue-500
        ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
        ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''}
        ${className}
    `;

    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className={selectClasses.trim()}
                {...props}
            >
                {placeholder && (
                    <option value="">{placeholder}</option>
                )}
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};
