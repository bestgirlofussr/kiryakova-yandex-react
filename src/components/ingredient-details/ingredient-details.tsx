import { LabeledValue } from '@/components/ui/labeled-value/labeled-value';
import { getIngredientsMap } from '@/services/burger-ingredients/reducer';
import { useAppSelector } from '@/services/store';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import styles from './ingredient-details.module.css';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams();

  const ingredients = useAppSelector(getIngredientsMap);
  const ingredient = useMemo(() => ingredients[id ?? ''], [ingredients, id]);

  return ingredient ? (
    <div className={styles.ingredient_details}>
      <img
        src={ingredient.image_large}
        alt={`${ingredient.name}.`}
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
  ) : (
    <></>
  );
};
