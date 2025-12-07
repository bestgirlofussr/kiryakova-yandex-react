import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import type React from 'react';

import styles from './price.module.css';

type PriceProps = {
  cost: number | string;
  size?: 'default' | 'medium';
  className?: string;
};

// TODO: разобраться почему размер иконки не меняется
export const Price: React.FC<PriceProps> = ({
  cost,
  size = 'default',
  className = '',
}) => {
  const textSizeClass = {
    default: 'text_type_digits-default',
    medium: 'text_type_digits-medium',
  }[size];

  const iconSizeClass = {
    default: 'icon_default', // 24px
    medium: 'icon_medium', // 36px
  }[size];

  return (
    <div className={`${styles.price} text ${textSizeClass} ${className}`}>
      {cost}
      <CurrencyIcon type="primary" className={`ml-2 ${iconSizeClass}`} />
    </div>
  );
};
