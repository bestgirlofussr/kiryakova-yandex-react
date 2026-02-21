import { useOrderIngredients } from '@/hooks/useOrderIngredients';
import { useOrderStatus } from '@/hooks/useOrderStatus';
import { fetchOrder } from '@/services/order/actions';
import { getOrderError, getOrderLoading, resetOrder } from '@/services/order/reducer';
import { useAppDispatch, useAppSelector } from '@/services/store';
import { FormattedDate, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Modal } from '@components/modal/modal';
import { Price } from '@components/ui/price/price';

import type { TIngredient } from '@/utils/types';

import styles from './order-composition.module.css';

type OrderCompositionProps = {
  showHeader?: boolean;
  className?: string;
};

export const OrderComposition: React.FC<OrderCompositionProps> = ({
  showHeader,
  className,
}) => {
  const { number } = useParams();
  const orderNumber = useMemo(() => Number(number), [number]);

  const dispatch = useAppDispatch();
  const loading = useAppSelector(getOrderLoading);
  const error = useAppSelector(getOrderError);

  const order = useAppSelector((store) => {
    let order = store.feed.orders.find((it) => it.number === orderNumber);
    if (order) {
      return order;
    }
    order = store['profile-feed'].orders.find((it) => it.number === orderNumber);
    if (order) {
      return order;
    }
    return store.order.currentOrder;
  });

  useEffect(() => {
    if (!order) void dispatch(fetchOrder({ number: orderNumber }));
  }, [order, number]);

  const { ingredients, totalPrice } = useOrderIngredients(order);

  const status = useOrderStatus(order?.status ?? '');

  const uniqueIngredients = useMemo(() => {
    const group: Record<string, TIngredient[]> = {};
    for (const item of ingredients) {
      group[item._id] ||= [];
      group[item._id].push(item);
    }
    return group;
  }, [ingredients]);

  return (
    <>
      {loading && <Preloader />}
      {order && (
        <div className={`${styles.order_composition} ${className}`}>
          {showHeader && (
            <p className={`${styles.number} text text_type_digits-default mb-10`}>
              #{order.number}
            </p>
          )}
          <p className="text text_type_main-medium mb-3">{order.name}</p>
          <p className={`${status.class} text text_type_main-default mb-15`}>
            {status.name}
          </p>
          <p className="text text_type_main-medium mb-6">Состав:</p>
          <ul className={`${styles.ingredients} mb-10`}>
            {Object.entries(uniqueIngredients).map(([key, values]) => (
              <li key={key} className={`${styles.ingredient} mb-4`}>
                <div className="gradient_container">
                  <div className="gradient_wrapper">
                    <img
                      src={values[0].image_mobile}
                      alt={`${values[0].name}.`}
                      className={styles.ingredient_img}
                    />
                  </div>
                </div>

                <p
                  className={`${styles.ingredient_name} text text_type_main-default ml-4`}
                >
                  {values[0].name}
                </p>
                <Price cost={`${values.length} x ${values[0].price}`} className="pl-4" />
              </li>
            ))}
          </ul>
          <div className={styles.footer}>
            <FormattedDate
              className="text text_type_main-default text_color_inactive"
              date={new Date(order.createdAt)}
            />
            <Price cost={totalPrice} className="pl-6" />
          </div>
        </div>
      )}
      {!!error && (
        <Modal isOpen={!!error} onClose={() => dispatch(resetOrder())}>
          <div className="error">
            <p className="text text_type_main-default">
              Произошла ошибка при загрузке заказа: {error.message}
            </p>
          </div>
        </Modal>
      )}
    </>
  );
};
