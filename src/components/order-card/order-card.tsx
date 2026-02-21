import { useOrderIngredients } from '@/hooks/useOrderIngredients';
import { useOrderStatus } from '@/hooks/useOrderStatus';
import { FormattedDate } from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import { Price } from '@components/ui/price/price';

import type { Order } from '@utils/types';

import styles from './order-card.module.css';
type OrderCardProps = {
  order: Order;
  showStatus?: boolean;
  className?: string;
};
export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  showStatus,
  className,
}) => {
  const { ingredients, totalPrice } = useOrderIngredients(order);

  const ingredientStack = useMemo(() => ingredients.slice(0, 6), [ingredients]);

  const ingredientOverflow = useMemo(
    () => Math.max(ingredients.length - 6, 0),
    [ingredients]
  );

  const status = useOrderStatus(order.status);

  return (
    <div className={`${styles.order_card} ${className}`}>
      <div className={`${styles.order_details} mb-6`}>
        <p className="text text_type_digits-default">#{order.number}</p>
        <FormattedDate
          className="text text_type_main-default text_color_inactive"
          date={new Date(order.createdAt)}
        />
      </div>
      <div className="mb-6">
        <p className="text text_type_main-medium">{order.name}</p>
        {showStatus && (
          <p className={`text text_type_main-default pt-2 ${status.class}`}>
            {status.name}
          </p>
        )}
      </div>
      <div className={styles.order_details}>
        <ul className={styles.order_stack}>
          {ingredientStack.map((ingredient, index) => (
            <li
              key={ingredient._id}
              className={`${styles.ingredient_wrapper} gradient_container`}
            >
              <div className="gradient_wrapper">
                <img
                  src={ingredient.image_mobile}
                  alt={`${ingredient.name}.`}
                  className={styles.ingredient_img}
                />
                {ingredientOverflow > 0 && index === ingredientStack.length - 1 && (
                  <div
                    className={`${styles.ingredient_overflow} text text_type_main-default`}
                  >
                    +{ingredientOverflow}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        <Price cost={totalPrice} className="pl-6" />
      </div>
    </div>
  );
};
