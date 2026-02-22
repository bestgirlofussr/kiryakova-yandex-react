import { api } from '@/utils/api';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { Order, OrderInfo, OrderRequest } from '@/utils/types';

export const createOrder = createAsyncThunk<OrderInfo, OrderRequest>(
  'order/createOrder',
  api.createOrder
);

export const fetchOrder = createAsyncThunk<Order, { number: number }>(
  'order/fetchOrder',
  api.getOrder
);
