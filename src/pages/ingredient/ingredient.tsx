import { IngredientDetails } from '@/components/ingredient-details/ingredient-details';

import styles from './ingredient.module.css';

export const Ingredient = (): React.JSX.Element => {
  return (
    <main className={styles.ingredient}>
      <h2 className={`text text_type_main-large ${styles.header}`}>
        Детали ингредиента
      </h2>
      <IngredientDetails />
    </main>
  );
};
