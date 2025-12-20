import { createAsyncThunk } from '@reduxjs/toolkit';

import type { Order } from '@utils/types';

type OrderRequest = {
  ingredients: string[];
};

type OrderResponse = {
  success: boolean;
  name: string;
  order: { number: number };
};

export const createOrder = createAsyncThunk<Order, OrderRequest>(
  'order/createOrder',
  async (orderData) => {
    try {
      const url = new URL('orders', import.meta.env.VITE_API_URL).toString();

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}`);
      }

      const parsedResponse = (await response.json()) as OrderResponse;
      return { ...parsedResponse.order, name: parsedResponse.name };
    } catch (error) {
      console.error('Fetch ошибка:', error);
      throw error;
    }
  }
);
