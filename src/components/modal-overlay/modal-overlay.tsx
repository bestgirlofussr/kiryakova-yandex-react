import styles from './modal-overlay.module.css';

type ModalOverlayProps = {
  onClose: () => void;
};

export const ModalOverlay: React.FC<ModalOverlayProps> = ({ onClose }) => {
  const handleOverlayClick = (e: React.MouseEvent): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return <div className={styles.modal_overlay} onClick={handleOverlayClick} />;
};
