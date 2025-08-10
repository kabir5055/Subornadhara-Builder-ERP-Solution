import { useState, useEffect } from 'react';

// Custom hook for managing form state
export const useForm = (initialValues = {}, validationRules = {}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouchedFields] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const setValue = (name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const setError = (name, error) => {
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const setTouched = (name) => {
        setTouchedFields(prev => ({ ...prev, [name]: true }));
    };

    const validate = () => {
        const newErrors = {};

        Object.keys(validationRules).forEach(fieldName => {
            const rules = validationRules[fieldName];
            const value = values[fieldName];

            if (rules.required && (!value || value.toString().trim() === '')) {
                newErrors[fieldName] = `${fieldName} is required`;
                return;
            }

            if (rules.min && value && value.toString().length < rules.min) {
                newErrors[fieldName] = `${fieldName} must be at least ${rules.min} characters`;
                return;
            }

            if (rules.max && value && value.toString().length > rules.max) {
                newErrors[fieldName] = `${fieldName} must not exceed ${rules.max} characters`;
                return;
            }

            if (rules.email && value && !/\S+@\S+\.\S+/.test(value)) {
                newErrors[fieldName] = `${fieldName} must be a valid email`;
                return;
            }

            if (rules.phone && value && !/^(\+88)?01[0-9]{9}$/.test(value.replace(/\s/g, ''))) {
                newErrors[fieldName] = `${fieldName} must be a valid phone number`;
                return;
            }

            if (rules.custom && typeof rules.custom === 'function') {
                const customError = rules.custom(value, values);
                if (customError) {
                    newErrors[fieldName] = customError;
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const reset = () => {
        setValues(initialValues);
        setErrors({});
        setTouchedFields({});
        setIsSubmitting(false);
    };

    return {
        values,
        errors,
        touched,
        isSubmitting,
        setValue,
        setError,
        setTouched,
        setIsSubmitting,
        validate,
        reset
    };
};

// Custom hook for API calls
export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const makeRequest = async (apiCall) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiCall();
            setLoading(false);
            return response;
        } catch (err) {
            setError(err.message || 'An error occurred');
            setLoading(false);
            throw err;
        }
    };

    return { loading, error, makeRequest };
};

// Custom hook for debounced search
export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// Custom hook for local storage
export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('Error storing value in localStorage:', error);
        }
    };

    return [storedValue, setValue];
};
