import { useState, useCallback } from 'react';

import type { ChangeEvent } from 'react';

type FormValues = Record<string, string | number | boolean>;

type TForm<T extends FormValues = Record<string, string>> = {
  values: T;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  setValues: React.Dispatch<React.SetStateAction<T>>;
};

export function useForm<T extends FormValues = Record<string, string>>(
  initialValues: T = {} as T
): TForm<T> {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }) as T);
  }, []);

  return { values, handleChange, setValues };
}
