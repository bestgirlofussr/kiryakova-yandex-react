import { OrderCard } from '@/components/order-card/order-card';
import { getIngredientsMap } from '@/services/burger-ingredients/reducer';
import { useAppSelector } from '@/services/store';
import { useMemo } from 'react';
import { Link, useLocation, useMatch } from 'react-router-dom';

import type { Order } from '@/utils/types';

type OrderListProps = {
  orders: Order[];
  className?: string;
};

export const OrderList: React.FC<OrderListProps> = ({ className, orders }) => {
  const location = useLocation();
  const ingredients = useAppSelector(getIngredientsMap);

  const showStatus = !!useMatch('/profile/orders');

  // убираем заказы, которые нельзя отобразить
  const correctOrders = useMemo(
    () => orders.filter((it) => it.ingredients.every((id) => id in ingredients)),
    [ingredients, orders]
  );

  return (
    <section className={`${className} container`}>
      <div className="wrapper">
        {correctOrders.map((order) => (
          <Link
            className="link"
            to={`./${order.number}`}
            key={order.number}
            state={{ backgroundLocation: location }}
          >
            <OrderCard
              key={order.number}
              order={order}
              showStatus={showStatus}
              className="mb-4"
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default OrderList;
