import { api } from '@/utils/api';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { Order, OrderRequest } from '@/utils/types';

export const createOrder = createAsyncThunk<Order, OrderRequest>(
  'order/createOrder',
  api.createOrder
);
