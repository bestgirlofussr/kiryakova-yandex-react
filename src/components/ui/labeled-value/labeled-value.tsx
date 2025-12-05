import type React from 'react';

import styles from './labeled-value.module.css';

type LabeledValueProps = {
  label: string;
  value?: string | number;
};

export const LabeledValue: React.FC<LabeledValueProps> = ({ label, value }) => {
  const textClass =
    typeof value === 'number' ? 'text_type_digits-default' : 'text_type_main-default';

  return (
    <div className={styles.labeled_value}>
      <p className="text text_type_main-small text_color_inactive">{label}</p>
      <p className={`${textClass} text text_type_main-default text_color_inactive`}>
        {value}
      </p>
    </div>
  );
};
