import { api } from '@/utils/api';

import type { RootState } from '../rootReducer';
import type {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  Middleware,
} from '@reduxjs/toolkit';

export type TWsActionTypes<T> = {
  connect: ActionCreatorWithPayload<string>;
  disconnect: ActionCreatorWithoutPayload;
  sendMessage?: ActionCreatorWithPayload<unknown>;
  onConnecting: ActionCreatorWithoutPayload;
  onOpen: ActionCreatorWithoutPayload;
  onClose: ActionCreatorWithoutPayload;
  onError: ActionCreatorWithPayload<string>;
  onMessage: ActionCreatorWithPayload<T>;
};

const RECONNECT_PERIOD = 3000;

export const socketMiddleware = <T>(
  wsActions: TWsActionTypes<T>,
  withTokenRefresh = false
): Middleware<object, RootState> => {
  return (store) => {
    let socket: WebSocket | null = null;
    const {
      connect,
      sendMessage,
      onOpen,
      onClose,
      onError,
      onMessage,
      onConnecting,
      disconnect,
    } = wsActions;
    let isConnected = false;
    let reconnectTimer = 0;
    let url = '';

    return (next) => (action) => {
      const { dispatch } = store;

      if (connect.match(action)) {
        url = action.payload;
        socket = new WebSocket(url);
        isConnected = true;
        dispatch(onConnecting());

        socket.onopen = (): void => {
          dispatch(onOpen());
        };

        socket.onerror = (): void => {
          dispatch(onError('Error'));
        };

        socket.onmessage = (event: MessageEvent<string>): void => {
          const { data } = event;

          try {
            const parsedData = JSON.parse(data) as T;

            if (
              withTokenRefresh &&
              typeof parsedData === 'object' &&
              parsedData !== null &&
              'message' in parsedData &&
              parsedData.message === 'Invalid or missing token'
            ) {
              api
                .refreshToken()
                .then((refreshData) => {
                  const wssUrl = new URL(url);
                  wssUrl.searchParams.set(
                    'token',
                    refreshData.accessToken.replace('Bearer ', '')
                  );
                  dispatch(connect(wssUrl.toString()));
                })
                .catch((err) => {
                  dispatch(onError((err as { message: string }).message));
                });

              // закрываем старое соединение
              dispatch(disconnect());

              return;
            }

            dispatch(onMessage(parsedData));
          } catch (error) {
            dispatch(onError((error as { message: string }).message));
          }
        };

        socket.onclose = (): void => {
          dispatch(onClose());

          if (isConnected) {
            reconnectTimer = window.setTimeout(() => {
              dispatch(connect(url));
            }, RECONNECT_PERIOD);
          }
        };
      }

      if (socket && sendMessage?.match(action)) {
        try {
          socket.send(JSON.stringify(action.payload));
        } catch (error) {
          dispatch(onError((error as { message: string }).message));
        }
      }

      if (socket && disconnect.match(action)) {
        clearTimeout(reconnectTimer);
        isConnected = false;
        reconnectTimer = 0;
        socket.close();
        socket = null;
      }

      next(action);
    };
  };
};
