import {
  WEB_SOCKET_STATUSES,
  type OrdersResponse,
  type Order,
  type WebsocketStatus,
} from '@/utils/types';
import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

export type ProfileOrdersStore = {
  status: WebsocketStatus;
  orders: Order[];
  connectionError: string | null;
};

export const initialState: ProfileOrdersStore = {
  status: WEB_SOCKET_STATUSES.OFFLINE,
  orders: [],
  connectionError: null,
};

export const profileFeedSlice = createSlice({
  name: 'profile-feed',
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
    },
  },
  selectors: {
    getOrders: (state) => state.orders,
    getWebsocketStatus: (state) => state.status,
  },
});

export const { wsConnecting, wsOpen, wsClose, wsError, wsMessage } =
  profileFeedSlice.actions;
export const { getOrders, getWebsocketStatus } = profileFeedSlice.selectors;
