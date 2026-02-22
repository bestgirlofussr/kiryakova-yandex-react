import { createAction } from '@reduxjs/toolkit';

export const wsConnect = createAction<string, 'PROFILE_FEED_CONNECT'>(
  'PROFILE_FEED_CONNECT'
);

export const wsDisconnect = createAction('PROFILE_FEED_DISCONNECT');
