import { useParams } from 'react-router-dom';

import { Modal } from '@components/modal/modal';
import { OrderComposition } from '@components/order-composition/order-composition';

type ModalProps = {
  onClose: () => void;
};

export const OrderCompositionModal: React.FC<ModalProps> = ({ onClose }) => {
  const { number } = useParams();

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      header={`#${number}`}
      headerClass="text text_type_digits-default"
    >
      <OrderComposition className="mt-5" />
    </Modal>
  );
};
