import { OrderList } from '@/components/order-list/order-list';
import { LabeledGrid } from '@/components/ui/labeled-grid/labeled-grid';
import { wsConnect, wsDisconnect } from '@/services/feed/actions';
import {
  getOrders,
  getTotal,
  getTotalToday,
  getWebsocketStatus,
} from '@/services/feed/reducer';
import { useAppDispatch, useAppSelector } from '@/services/store';
import { ORDER_STATUSES, WEB_SOCKET_STATUSES } from '@/utils/types';
import { useEffect, useMemo } from 'react';

import styles from './feed.module.css';

const BASE_URL = import.meta.env.VITE_API_WSS_URL as string;

export const Feed = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(getOrders);
  const total = useAppSelector(getTotal);
  const totalToday = useAppSelector(getTotalToday);
  const connectStatus = useAppSelector(getWebsocketStatus);

  useEffect(() => {
    if (connectStatus !== WEB_SOCKET_STATUSES.ONLINE)
      dispatch(wsConnect(`${BASE_URL}/orders/all`));
    return (): void => {
      dispatch(wsDisconnect());
    };
  }, []);

  const doneOrders = useMemo(
    () => orders.filter((it) => it.status === ORDER_STATUSES.DONE).slice(0, 10),
    [orders]
  );

  const pendingOrders = useMemo(
    () => orders.filter((it) => it.status === ORDER_STATUSES.PENDING).slice(0, 10),
    [orders]
  );

  return (
    <>
      <h1 className={`${styles.title} text_type_main-large mt-10 mb-5 pl-5`}>
        Лента заказов
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <OrderList className={styles.orders} orders={orders} />
        <section className="ml-15">
          <div className={`${styles.statuses} mb-15`}>
            <LabeledGrid label="Готовы:">
              {doneOrders.map((it) => (
                <p
                  key={it.number}
                  className="text text_type_main-small text_color_success"
                >
                  {it.number}
                </p>
              ))}
            </LabeledGrid>
            <LabeledGrid label="В работе:">
              {pendingOrders.map((it) => (
                <p key={it.number} className="text text_type_main-small">
                  {it.number}
                </p>
              ))}
            </LabeledGrid>
          </div>
          <p className="text text_type_main-medium mb-6">Выполнено за все время:</p>
          <p className="text text_type_digits-large mb-6">{total}</p>
          <p className="text text_type_main-medium mb-6">Выполнено за сегодня:</p>
          <p className="text text_type_digits-large">{totalToday}</p>
        </section>
      </main>
    </>
  );
};
