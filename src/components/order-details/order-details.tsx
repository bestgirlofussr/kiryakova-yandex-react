import donePng from '@/images/done.png';

import type { Order } from '@utils/types';

import styles from './order-details.module.css';
type OrderDetailsProps = {
  order: Order;
};
export const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  return (
    <div className={styles.order_details}>
      <p className="text text_type_digits-large mb-8">{order.number}</p>
      <p className="text text_type_main-medium mb-15">идентификатор заказа</p>
      <img
        src={donePng}
        alt="Галочка успешного заказа."
        className={`${styles.image} mb-15`}
      />
      <p className="text text_type_main-default mb-2">Ваш заказ начали готовить</p>
      <p className="text text_type_main-default text_color_inactive mb-15">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};
