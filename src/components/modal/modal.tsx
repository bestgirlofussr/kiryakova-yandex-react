import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import styles from './modal.module.css';

type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  header?: string;
  headerClass?: string;
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  header,
  headerClass = 'text text_type_main-large',
}) => {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return (): void => document.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className={styles.modal} data-testid="modal">
        <div className={styles.header}>
          <h2 className={headerClass}>{header}</h2>
          <CloseIcon type="primary" className={styles.closeButton} onClick={onClose} />
        </div>
        {children}
      </div>
      <ModalOverlay onClose={onClose} />
    </>,
    document.getElementById('react-modal')!
  );
};
