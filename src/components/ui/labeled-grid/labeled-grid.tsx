import type React from 'react';

import styles from './labeled-grid.module.css';

type LabeledGridrops = {
  label: string;
  children: React.ReactNode;
};

export const LabeledGrid: React.FC<LabeledGridrops> = ({ label, children }) => {
  return (
    <div>
      <p className="text text_type_main-medium mb-6">{label}</p>
      <div className={styles.labeled_grid}>{children}</div>
    </div>
  );
};
