export const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const fullPath = new URL(url, import.meta.env.VITE_API_URL).toString();
  const response = await fetch(fullPath, options);

  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};
