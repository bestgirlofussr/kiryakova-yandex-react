import { ORDER_STATUSES } from '@/utils/types';
import { useMemo } from 'react';

export const useOrderStatus = (status: string): { class: string; name: string } => {
  return useMemo(() => {
    switch (status) {
      case ORDER_STATUSES.CREATED:
        return { class: '', name: 'Создан' };
      case ORDER_STATUSES.PENDING:
        return { class: '', name: 'Готовится' };
      case ORDER_STATUSES.DONE:
        return { class: 'text_color_success', name: 'Выполнен' };
      case ORDER_STATUSES.CANCELED:
        return { class: 'text_color_error', name: 'Отменён' };
      default:
        return { class: '', name: '' };
    }
  }, [status]);
};
