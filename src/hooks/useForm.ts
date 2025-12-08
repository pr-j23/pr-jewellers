import { useState, useCallback } from 'react';
import type React from 'react';

type ValidationRule<TValues extends Record<string, unknown>, TKey extends keyof TValues> = (
  value: TValues[TKey],
  values: TValues
) => string | null;

export type ValidationRules<TValues extends Record<string, unknown>> = Partial<{
  [K in keyof TValues]: ValidationRule<TValues, K>;
}>;

type FormErrors<TValues extends Record<string, unknown>> = Partial<Record<keyof TValues, string | null>>;
type TouchedState<TValues extends Record<string, unknown>> = Partial<Record<keyof TValues, boolean>>;

type SubmitHandler<TValues extends Record<string, unknown>> = (
  values: TValues
) => Promise<unknown> | void;

export const useForm = <TValues extends Record<string, unknown>>(
  initialValues: TValues,
  validationRules: ValidationRules<TValues> = {}
) => {
  const [values, setValues] = useState<TValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors<TValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<TouchedState<TValues>>({});

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const target = event.target;
      const { name, value, type } = target;
      const fieldName = name as keyof TValues;
      let processedValue: unknown = value;

      if (type === 'number') {
        processedValue = value === '' ? '' : Number(value);
        if (typeof processedValue === 'number' && processedValue < 0) {
          processedValue = 0;
        }
      } else if (type === 'checkbox' && 'checked' in target) {
        processedValue = target.checked;
      }

      setValues(prev => ({ ...prev, [fieldName]: processedValue } as TValues));

      if (errors[fieldName]) {
        setErrors(prev => ({ ...prev, [fieldName]: null }));
      }

      if (!touched[fieldName]) {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
      }
    },
    [errors, touched]
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const fieldName = event.target.name as keyof TValues;
      setTouched(prev => ({ ...prev, [fieldName]: true }));

      const rule = validationRules[fieldName];
      if (rule) {
        const error = rule(values[fieldName], values);
        if (error) {
          setErrors(prev => ({ ...prev, [fieldName]: error }));
        } else if (errors[fieldName]) {
          setErrors(prev => ({ ...prev, [fieldName]: null }));
        }
      }
    },
    [values, validationRules, errors]
  );

  const validateForm = useCallback(() => {
    const newErrors: FormErrors<TValues> = {};
    let isValid = true;

    (Object.keys(validationRules) as Array<keyof TValues>).forEach(field => {
      const rule = validationRules[field];
      if (rule) {
        const error = rule(values[field], values);
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
    (submitFn: SubmitHandler<TValues>) => {
      return async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const allTouched = Object.keys(values).reduce((acc, key) => {
          acc[key as keyof TValues] = true;
          return acc;
        }, {} as TouchedState<TValues>);
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
    isValid: Object.values(errors).every(error => !error),
  };
};

export default useForm;
