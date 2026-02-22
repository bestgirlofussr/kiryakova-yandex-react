import { OrderComposition } from '@/components/order-composition/order-composition';
import { fetchOrder } from '@/services/order/actions';
import { useAppDispatch } from '@/services/store';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import styles from './order.module.css';

export const Order = (): React.JSX.Element => {
  const { number } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(fetchOrder({ number: Number(number) }));
  }, []);

  return (
    <main className={styles.order}>
      <OrderComposition showHeader={true} />
    </main>
  );
};
