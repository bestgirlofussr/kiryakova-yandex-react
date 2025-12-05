import { Price } from '@/components/ui/price/price';
import {
  Button,
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useState } from 'react';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { OrderDetails } from '@components/order-details/order-details';
import { INGREDIENT_TYPES, type TIngredient, type WithUniqueId } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  selectedIngredients: WithUniqueId<TIngredient>[];
  deleteIngredient: (uniqueId: string) => void;
};

export const BurgerConstructor = ({
  selectedIngredients,
  deleteIngredient,
}: TBurgerConstructorProps): React.JSX.Element => {
  const [createOrderModalIsOpen, setCreateOrderModalIsOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);

  const bun = useMemo(
    () => selectedIngredients.find((it) => it.type == INGREDIENT_TYPES.BUN),
    [selectedIngredients]
  );

  const canOrder = useMemo(
    () => !!bun && selectedIngredients.some((it) => it.type === INGREDIENT_TYPES.MAIN),
    [bun, selectedIngredients]
  );

  const sortedIngredients = useMemo(
    () => selectedIngredients.filter((it) => it.type != INGREDIENT_TYPES.BUN),
    [selectedIngredients]
  );

  const orderCost = useMemo(() => {
    if (bun) {
      return (
        bun.price * 2 + sortedIngredients.reduce((acc, item) => acc + item.price, 0)
      );
    }
    return 0;
  }, [sortedIngredients, bun]);

  const createOrder = (): void => {
    setCreateOrderModalIsOpen(true);
  };

  const handleDelete =
    (id: string) =>
    (e: React.MouseEvent<HTMLButtonElement>): void => {
      e.stopPropagation();
      deleteIngredient(id);
    };

  return (
    <section className={styles.burger_constructor}>
      <div className={`${styles.ingredients_container} mb-10 pl-4`}>
        {!!bun && (
          <>
            <div
              className={styles.ingredient_wrapper}
              onClick={() => setSelectedIngredient(bun)}
            >
              <ConstructorElement
                extraClass={`${styles.ingredient} mr-4 mb-4 ml-8`}
                type="top"
                isLocked={true}
                text={`${bun.name} (верх)`}
                price={bun.price}
                thumbnail={bun.image_mobile}
              />
            </div>
            <div className={`${styles.ingredients_wrapper} pr-4`}>
              {sortedIngredients.map((ingredient) => (
                <div
                  className={`${styles.ingredient_drag} mb-4`}
                  key={ingredient.uniqueId}
                >
                  <DragIcon type="secondary" />
                  <div
                    className={styles.ingredient_wrapper}
                    onClick={() => setSelectedIngredient(ingredient)}
                  >
                    <ConstructorElement
                      extraClass={`${styles.ingredient} ml-2`}
                      text={ingredient.name}
                      price={ingredient.price}
                      thumbnail={ingredient.image_mobile}
                      handleClose={handleDelete(ingredient.uniqueId) as () => void}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div
              className={styles.ingredient_wrapper}
              onClick={() => setSelectedIngredient(bun)}
            >
              <ConstructorElement
                extraClass={`${styles.ingredient} ml-8 mr-4`}
                type="bottom"
                isLocked={true}
                text={`${bun.name} (низ)`}
                price={bun.price}
                thumbnail={bun.image_mobile}
              />
            </div>
          </>
        )}
      </div>

      <div className={`${styles.order_cost} pl-4 pr-4`}>
        <Price className="mr-10" cost={orderCost} size="medium" />

        <Button onClick={createOrder} htmlType="button" disabled={!canOrder}>
          Оформить заказ
        </Button>
      </div>
      {createOrderModalIsOpen && (
        <OrderDetails
          isOpen={createOrderModalIsOpen}
          onClose={() => setCreateOrderModalIsOpen(false)}
        />
      )}

      {!!selectedIngredient && (
        <IngredientDetails
          onClose={() => setSelectedIngredient(null)}
          ingredient={selectedIngredient}
        />
      )}
    </section>
  );
};
