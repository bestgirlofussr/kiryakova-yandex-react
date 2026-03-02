import { mockOrdersResponse } from '@/__tests__/mocks';
import { WEB_SOCKET_STATUSES } from '@/utils/types';
import { describe, it, expect } from 'vitest';

import {
  profileFeedSlice,
  initialState,
  wsConnecting,
  wsOpen,
  wsClose,
  wsError,
  wsMessage,
} from './reducer';

describe('ProfileFeed store and actions', () => {
  it('should return the initial state', () => {
    expect(profileFeedSlice.reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle wsConnecting action', () => {
    const newState = profileFeedSlice.reducer(initialState, wsConnecting());
    expect(newState).toEqual({
      ...initialState,
      status: WEB_SOCKET_STATUSES.CONNECTING,
    });
  });

  it('should handle wsOpen action', () => {
    const newState = profileFeedSlice.reducer(initialState, wsOpen());
    expect(newState).toEqual({
      ...initialState,
      status: WEB_SOCKET_STATUSES.ONLINE,
      connectionError: null,
    });
  });

  it('should handle wsClose action', () => {
    const newState = profileFeedSlice.reducer(initialState, wsClose());
    expect(newState).toEqual({
      ...initialState,
      status: WEB_SOCKET_STATUSES.OFFLINE,
    });
  });

  it('should handle wsError action', () => {
    const newState = profileFeedSlice.reducer(
      initialState,
      wsError('Connection failed')
    );
    expect(newState).toEqual({
      ...initialState,
      connectionError: 'Connection failed',
    });
  });

  it('should handle wsMessage action', () => {
    const newState = profileFeedSlice.reducer(
      initialState,
      wsMessage(mockOrdersResponse)
    );
    expect(newState).toEqual({
      ...initialState,
      orders: mockOrdersResponse.orders,
    });
  });
});
