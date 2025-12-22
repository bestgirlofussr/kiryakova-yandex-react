import { Button, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo } from 'react';

import { ConstructorBunSlot } from '@components/constructor-bun-slot/constructor-bun-slot';
import { ConstructorIngredients } from '@components/constructor-ingredients/constructor-ingredients';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { Price } from '@components/ui/price/price';
import {
  getBun,
  getIngredients,
  resetConstructor,
} from '@services/burger-constructor/reducer';
import { createOrder } from '@services/order/actions';
import {
  getError,
  getLoading,
  getOrderDetails,
  resetOrderDetails,
} from '@services/order/reducer';
import { useAppDispatch, useAppSelector } from '@services/store';
import { INGREDIENT_TYPES } from '@utils/types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): React.JSX.Element => {
  const bun = useAppSelector(getBun);
  const selectedIngredients = useAppSelector(getIngredients);
  const order = useAppSelector(getOrderDetails);
  const loading = useAppSelector(getLoading);
  const error = useAppSelector(getError);

  const dispatch = useAppDispatch();

  const canOrder = useMemo(
    () => !!bun && selectedIngredients.some((it) => it.type === INGREDIENT_TYPES.MAIN),
    [bun, selectedIngredients]
  );

  const orderCost = useMemo(() => {
    return (
      (bun?.price ?? 0) * 2 +
      selectedIngredients.reduce((acc, item) => acc + item.price, 0)
    );
  }, [selectedIngredients, bun]);

  const sendOrder = useCallback(async () => {
    if (!bun || loading) return;
    const ingredientsIds = [
      bun._id, // Булка сверху
      ...selectedIngredients.map((it) => it._id),
      bun._id, // Булка снизу
    ];

    await dispatch(createOrder({ ingredients: ingredientsIds }));
    dispatch(resetConstructor());
  }, [bun, loading, selectedIngredients]);

  return loading ? (
    <Preloader />
  ) : (
    <section className={styles.burger_constructor}>
      <div className={`${styles.ingredients_container} mb-10 pl-4`}>
        <ConstructorBunSlot
          item={bun}
          extraClass={`${styles.ingredient} mr-4 ml-8`}
          position="top"
          postfix="(верх)"
        />

        <ConstructorIngredients />

        <ConstructorBunSlot
          item={bun}
          extraClass={`${styles.ingredient} ml-8 mr-4`}
          position="bottom"
          postfix="(низ)"
        />
      </div>
      <div className={`${styles.order_cost} pl-4 pr-4`}>
        <Price className="mr-10" cost={orderCost} size="medium" />

        <Button onClick={() => void sendOrder()} htmlType="button" disabled={!canOrder}>
          Оформить заказ
        </Button>
      </div>
      {!!order && (
        <Modal isOpen={!!order} onClose={() => dispatch(resetOrderDetails())}>
          <OrderDetails order={order} />
        </Modal>
      )}
      {!!error && (
        <Modal isOpen={!!error} onClose={() => dispatch(resetOrderDetails())}>
          <div className={styles.error}>
            <p className="text text_type_main-default">
              Произошла ошибка при отправке заказа: {error.message}
            </p>
          </div>
        </Modal>
      )}
    </section>
  );
};
