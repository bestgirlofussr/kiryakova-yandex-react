// services/api/index.ts
import { LOCAL_STORAGE_KEYS } from './constants';

import type { Order, OrderRequest, OrderResponse, TIngredient, User } from './types';

const BASE_URL = import.meta.env.VITE_API_URL;

type RefreshResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

type ApiResponse<T = unknown> = {
  success?: boolean;
  data?: T;
  message?: string;
  order?: Order;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  [key: string]: unknown;
};

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const checkResponse = async <T>(res: Response): Promise<T> => {
  const data = (await res.json()) as Promise<T>;

  if (!res.ok) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    throw new Error((data as any)?.message ?? `Ошибка ${res.status}`);
  }
  return data;
};

const refreshToken = async (): Promise<RefreshResponse> => {
  const response = await fetch(`${BASE_URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({
      token: localStorage.getItem(LOCAL_STORAGE_KEYS.refreshToken) ?? '',
    }),
  });

  const refreshData: RefreshResponse = await checkResponse<RefreshResponse>(response);

  if (!refreshData.success) throw new Error('Refresh token failed');

  localStorage.setItem(LOCAL_STORAGE_KEYS.refreshToken, refreshData.refreshToken);
  const accessToken = refreshData.accessToken?.split('Bearer ')[1] ?? '';
  localStorage.setItem(LOCAL_STORAGE_KEYS.accessToken, accessToken);
  return refreshData;
};

export const fetchWithRefresh = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    return await checkResponse<T>(
      await fetch(url, {
        ...options,
        headers: {
          ...(options.headers as Record<string, string>),
          'Content-Type': 'application/json',
        },
      })
    );
  } catch (err) {
    const error = err as { message?: string };
    if (error.message === 'jwt expired') {
      const refreshData = await refreshToken();
      return await checkResponse<T>(
        await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${refreshData.accessToken}`,
          } as Record<string, string>,
        })
      );
    }
    console.log(err);
    throw err;
  }
};

export const getIngredients = async (): Promise<TIngredient[]> => {
  const response = await fetchWithRefresh<{ data: TIngredient[] }>(
    `${BASE_URL}/ingredients`
  );
  return response.data;
};

export const createOrder = async (orderData: OrderRequest): Promise<Order> => {
  const response = await fetchWithRefresh<OrderResponse>(`${BASE_URL}/orders`, {
    method: 'POST',
    body: JSON.stringify(orderData),
    //TODO проверить надо ли
    headers: { ...getAuthHeaders() },
  });
  return { ...response.order, name: response.name };
};

export const register = async (data: {
  email: string;
  password: string;
  name: string;
}): Promise<User> => {
  const response = await fetchWithRefresh<ApiResponse<User>>(
    `${BASE_URL}/auth/register`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );

  if (!response.success) throw new Error('Регистрация не удалась');

  const accessToken = response.accessToken?.split('Bearer ')[1] ?? '';
  localStorage.setItem(LOCAL_STORAGE_KEYS.accessToken, accessToken);
  localStorage.setItem(LOCAL_STORAGE_KEYS.refreshToken, response.refreshToken!);

  return response.user!;
};

export const login = async (data: {
  email: string;
  password: string;
}): Promise<User> => {
  const response = await fetchWithRefresh<ApiResponse<User>>(`${BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.success) throw new Error('Ошибка входа');

  const accessToken = response.accessToken?.split('Bearer ')[1] ?? '';
  localStorage.setItem(LOCAL_STORAGE_KEYS.accessToken, accessToken);
  localStorage.setItem(LOCAL_STORAGE_KEYS.refreshToken, response.refreshToken!);

  return response.user!;
};

export const getUser = async (): Promise<User> => {
  const response = await fetchWithRefresh<ApiResponse<User>>(`${BASE_URL}/auth/user`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return response.user!;
};

export const logout = async (): Promise<void> => {
  await fetchWithRefresh(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    body: JSON.stringify({
      token: localStorage.getItem(LOCAL_STORAGE_KEYS.refreshToken) ?? '',
    }),
  });
  localStorage.removeItem(LOCAL_STORAGE_KEYS.accessToken);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.refreshToken);
};

export const forgotPassword = async (data: { email: string }): Promise<void> => {
  const response = await fetchWithRefresh<ApiResponse>(`${BASE_URL}/password-reset`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!response.success) throw new Error(response.message ?? 'Ошибка восстановления');

  localStorage.setItem(LOCAL_STORAGE_KEYS.forgotPassword, 'true');
};

export const resetPassword = async (data: {
  password: string;
  code: string;
}): Promise<void> => {
  const response = await fetchWithRefresh<ApiResponse>(
    `${BASE_URL}/password-reset/reset`,
    {
      method: 'POST',
      body: JSON.stringify({
        password: data.password,
        token: data.code,
      }),
    }
  );
  if (!response.success) throw new Error(response.message ?? 'Ошибка сброса пароля');

  localStorage.removeItem(LOCAL_STORAGE_KEYS.forgotPassword);
};

export const updateUser = async (data: {
  email?: string;
  password?: string;
  name?: string;
}): Promise<User> => {
  const response = await fetchWithRefresh<ApiResponse<User>>(`${BASE_URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.success)
    throw new Error(response.message ?? 'Ошибка обновления данных пользователя');

  return response.user!;
};

export const isTokenExists = (): boolean =>
  !!localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken);

export const api = {
  getIngredients,
  createOrder,
  register,
  login,
  getUser,
  logout,
  forgotPassword,
  resetPassword,
  updateUser,
  isTokenExists,
};
