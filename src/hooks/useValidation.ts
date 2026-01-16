import { useState, useCallback } from 'react';

import type { ChangeEvent } from 'react';

type ValidationErrors = Record<string, string>;

const validators: Record<string, (value: string) => string | null> = {
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value.trim()) {
      return 'Email обязателен';
    }
    if (!emailRegex.test(value)) {
      return 'Некорректный формат email';
    }
    return null;
  },
  password: (value: string) => {
    if (!value.trim()) {
      return 'Пароль обязателен';
    }
    if (value.length < 6) {
      return 'Минимум 6 символов';
    }
    return null;
  },
  name: (value: string) => {
    if (!value.trim()) {
      return 'Имя обязательно';
    }
    if (value.length < 2) {
      return 'Минимум 2 символа';
    }
    return null;
  },

  code: (value: string) => {
    if (!value.trim()) {
      return 'Код из письма обязателен';
    }
    return null;
  },
};

export function useValidation(initialErrors: ValidationErrors = {}): {
  errors: ValidationErrors;
  validate: (e: ChangeEvent<HTMLInputElement>) => void;
  hasErrors: () => boolean;
} {
  const [errors, setErrors] = useState<ValidationErrors>(initialErrors);

  const setError = useCallback((name: string, error: string | null) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error ?? '',
    }));
  }, []);

  const validate = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const validator = validators[name];

      if (validator) {
        const error = validator(value);
        setError(name, error);
      }
    },
    [setError]
  );

  const hasErrors = useCallback(() => {
    return Object.values(errors).some((error) => error.length > 0);
  }, [errors]);

  return {
    errors,
    validate,
    hasErrors,
  };
}
