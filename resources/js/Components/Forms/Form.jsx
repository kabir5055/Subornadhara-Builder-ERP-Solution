import React from 'react';
import { Button } from '../UI/Button';

export const Form = ({ children, onSubmit, className = '' }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
            {children}
        </form>
    );
};

export const FormGroup = ({ children, className = '' }) => {
    return (
        <div className={`space-y-2 ${className}`}>
            {children}
        </div>
    );
};

export const FormRow = ({ children, className = '' }) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
            {children}
        </div>
    );
};

export const FormActions = ({ children, align = 'right', className = '' }) => {
    const alignClass = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end'
    };

    return (
        <div className={`flex ${alignClass[align]} space-x-3 pt-4 ${className}`}>
            {children}
        </div>
    );
};

export const SubmitButton = ({ children, loading, ...props }) => {
    return (
        <Button type="submit" loading={loading} {...props}>
            {children || 'Submit'}
        </Button>
    );
};

export const CancelButton = ({ children, onClick, ...props }) => {
    return (
        <Button variant="outline" type="button" onClick={onClick} {...props}>
            {children || 'Cancel'}
        </Button>
    );
};
