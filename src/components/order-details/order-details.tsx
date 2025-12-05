import donePng from '@/images/done.png';

import { Modal } from '@components/modal/modal';

import styles from './order-details.module.css';

type OrderDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
};
export const OrderDetails: React.FC<OrderDetailsProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.order_details}>
        <p className="text text_type_digits-large mb-8">034536</p>
        <p className="text text_type_main-medium mb-15">идентификатор заказа</p>
        <img src={donePng} alt="Done" className={`${styles.image} mb-15`} />
        <p className="text text_type_main-default mb-2">Ваш заказ начали готовить</p>
        <p className="text text_type_main-default text_color_inactive mb-15">
          Дождитесь готовности на орбитальной станции
        </p>
      </div>
    </Modal>
  );
};
