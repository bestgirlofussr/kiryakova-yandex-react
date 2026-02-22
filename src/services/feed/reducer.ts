import {
  WEB_SOCKET_STATUSES,
  type Order,
  type OrdersResponse,
  type WebsocketStatus,
} from '@/utils/types';
import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

export type FeedOrdersStore = {
  status: WebsocketStatus;
  orders: Order[];
  connectionError: string | null;
  total: number;
  totalToday: number;
};

const initialState: FeedOrdersStore = {
  status: WEB_SOCKET_STATUSES.OFFLINE,
  orders: [],
  connectionError: null,
  total: 0,
  totalToday: 0,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    wsConnecting: (state) => {
      state.status = WEB_SOCKET_STATUSES.CONNECTING;
    },
    wsOpen: (state) => {
      state.status = WEB_SOCKET_STATUSES.ONLINE;
      state.connectionError = null;
    },
    wsClose: (state) => {
      state.status = WEB_SOCKET_STATUSES.OFFLINE;
    },
    wsError: (state, action: PayloadAction<string>) => {
      state.connectionError = action.payload;
    },
    wsMessage: (state, action: PayloadAction<OrdersResponse>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
  },
  selectors: {
    getOrders: (state) => state.orders,
    getWebsocketStatus: (state) => state.status,
    getTotal: (state) => state.total,
    getTotalToday: (state) => state.totalToday,
  },
});

export const { wsConnecting, wsOpen, wsClose, wsError, wsMessage } = feedSlice.actions;
export const { getOrders, getWebsocketStatus, getTotal, getTotalToday } =
  feedSlice.selectors;
