import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';

import { wsConnect, wsDisconnect } from './feed/actions';
import { wsClose, wsConnecting, wsError, wsMessage, wsOpen } from './feed/reducer';
import { socketMiddleware } from './middleware/socket-middleware';
import {
  wsConnect as wsProfileConnect,
  wsDisconnect as wsProfileDisconnect,
} from './profile-feed/actions';
import {
  wsClose as wsProfileClose,
  wsConnecting as wsProfileConnecting,
  wsError as wsProfileError,
  wsMessage as wsProfileMessage,
  wsOpen as wsProfileOpen,
} from './profile-feed/reducer';
import rootReducer from './rootReducer';

import type { RootState } from './rootReducer';

const feedMiddleware = socketMiddleware(
  {
    connect: wsConnect,
    disconnect: wsDisconnect,
    onConnecting: wsConnecting,
    onOpen: wsOpen,
    onClose: wsClose,
    onError: wsError,
    onMessage: wsMessage,
  },
  true
);

const profileFeedMiddleware = socketMiddleware(
  {
    connect: wsProfileConnect,
    disconnect: wsProfileDisconnect,
    onConnecting: wsProfileConnecting,
    onOpen: wsProfileOpen,
    onClose: wsProfileClose,
    onError: wsProfileError,
    onMessage: wsProfileMessage,
  },
  true
);

const store = configureStore({
  reducer: rootReducer,
  // devTools: true
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(feedMiddleware, profileFeedMiddleware);
  },
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
