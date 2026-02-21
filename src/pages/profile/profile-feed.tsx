import { OrderList } from '@/components/order-list/order-list';
import { wsConnect, wsDisconnect } from '@/services/profile-feed/actions';
import { getOrders, getWebsocketStatus } from '@/services/profile-feed/reducer';
import { useAppDispatch, useAppSelector } from '@/services/store';
import { WEB_SOCKET_STATUSES } from '@/utils/types';
import { useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_WSS_URL as string;

export const ProfileFeed = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(getOrders);
  const connectStatus = useAppSelector(getWebsocketStatus);
  useEffect(() => {
    if (connectStatus !== WEB_SOCKET_STATUSES.ONLINE)
      dispatch(wsConnect(`${BASE_URL}/orders/all`));
    return (): void => {
      dispatch(wsDisconnect());
    };
  }, []);
  return <OrderList className="mt-10" orders={orders} />;
};
