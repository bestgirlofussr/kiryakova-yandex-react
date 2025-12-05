import { Modal } from '@components/modal/modal';

import { LabeledValue } from '../ui/labeled-value/labeled-value';

import type { TIngredient } from '@/utils/types';

import styles from './ingredient-details.module.css';

type IngredientDetailsProps = {
  onClose: () => void;
  ingredient: TIngredient;
};
export const IngredientDetails: React.FC<IngredientDetailsProps> = ({
  onClose,
  ingredient,
}) => {
  return (
    <Modal isOpen={!!ingredient} onClose={onClose} header="Детали ингредиента">
      <div className={styles.ingredient_details}>
        <img
          src={ingredient.image_large}
          alt="Ingredient"
          className={`${styles.image} mb-4`}
        />
        <p className={`${styles.name} text text_type_main-medium mb-8`}>
          {ingredient.name}
        </p>
        <div className={styles.nutrition_props}>
          <LabeledValue label="Калории, ккал" value={ingredient.calories} />
          <LabeledValue label="Белки, г" value={ingredient.proteins} />
          <LabeledValue label="Жиры, г" value={ingredient.fat} />
          <LabeledValue label="Углеводы, г" value={ingredient.carbohydrates} />
        </div>
      </div>
    </Modal>
  );
};
