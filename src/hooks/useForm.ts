import { useCallback, useState } from 'react';

// expect a function that expects type of field, return error message when wrong else null
type Validator<T> = (value: T[keyof T]) => string | null;

// Note T is the Form Type, K is the key of each field in the form
export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validators?: Partial<{ [K in keyof T]: Validator<T> }>,
) => {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  // Memoize these functions to avoid new function instances which is expensive the larger the form
  // prevents the entire form from re-rendering on every keystroke in one field.
  const setValue = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const touch = useCallback(<K extends keyof T>(key: K) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const getError = useCallback(
    <K extends keyof T>(key: K): string | null => {
      if (!validators || !validators[key]) return null;
      if (!touched[key]) return null;
      return validators[key](values[key]);
    },
    [validators, touched, values],
  );

  const isInvalid = useCallback(
    <K extends keyof T>(key: K): boolean => !!getError(key),
    [getError],
  );

  const submit = useCallback(() => {
    // Mark all fields as touched
    Object.keys(values).forEach((k) =>
      setTouched((prev) => ({ ...prev, [k]: true })),
    );

    // check all validations and return false if one fails
    return !Object.keys(values).some(
      (k) => validators && validators[k as keyof T]?.(values[k as keyof T]),
    );
  }, [values, validators]);

  return {
    values,
    setValue,
    touch,
    getError,
    isInvalid,
    submit,
  };
};
