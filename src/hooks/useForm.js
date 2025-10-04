import { useState, useCallback } from 'react';

/**
 * Custom hook for form handling with validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation functions for each field
 * @returns {Object} Form state and handlers
 */
export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  const handleChange = useCallback(
    ({ target }) => {
      const { name, value, type, checked } = target;

      // Handle different input types
      let processedValue = value;

      if (type === 'number') {
        processedValue = value === '' ? '' : Number(value);
        // Prevent negative values if needed
        if (typeof processedValue === 'number' && processedValue < 0) {
          processedValue = 0;
        }
      } else if (type === 'checkbox') {
        processedValue = checked;
      }

      setValues(prev => ({ ...prev, [name]: processedValue }));

      // Clear error when field is edited
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }

      // Mark field as touched
      if (!touched[name]) {
        setTouched(prev => ({ ...prev, [name]: true }));
      }
    },
    [errors, touched]
  );

  const handleBlur = useCallback(
    ({ target: { name } }) => {
      setTouched(prev => ({ ...prev, [name]: true }));

      // Validate on blur
      if (validationRules[name]) {
        const error = validationRules[name](values[name], values);
        if (error) {
          setErrors(prev => ({ ...prev, [name]: error }));
        }
      }
    },
    [values, validationRules]
  );

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      if (validationRules[field]) {
        const error = validationRules[field](values[field], values);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  const handleSubmit = useCallback(
    submitFn => {
      return async e => {
        e.preventDefault();

        // Mark all fields as touched
        const allTouched = Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {});
        setTouched(allTouched);

        const isValid = validateForm();
        if (!isValid) return;

        setIsSubmitting(true);
        try {
          await submitFn(values);
        } catch (error) {
          console.error('Form submission error:', error);
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    [values, validateForm]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    isValid: Object.keys(errors).length === 0,
  };
};

export default useForm;
