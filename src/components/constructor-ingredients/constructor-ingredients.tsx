import { useCallback } from 'react';
import { useDrop } from 'react-dnd';

import { ConstructorIngredient } from '@components/constructor-ingredient/constructor-ingredient';
import {
  getIngredients,
  deleteIngredient,
  addIngredient,
  moveIngredient,
} from '@services/burger-constructor/reducer';
import { useAppDispatch, useAppSelector } from '@services/store';

import type { TIngredient } from '@utils/types';

import styles from './constructor-ingredients.module.css';

export const ConstructorIngredients: React.FC = () => {
  const selectedIngredients = useAppSelector(getIngredients);
  const dispatch = useAppDispatch();

  const [{ isOver }, drop] = useDrop({
    accept: 'ingredient',
    drop(ingredient: TIngredient) {
      dispatch(addIngredient(ingredient));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleRef = useCallback(
    (node: HTMLDivElement | null) => {
      drop(node);
    },
    [drop]
  );

  const handleDelete =
    (id: string) =>
    (e: React.MouseEvent<HTMLButtonElement>): void => {
      e.stopPropagation();
      dispatch(deleteIngredient(id));
    };

  return (
    <div
      className={`${styles.ingredients_wrapper} ${isOver ? styles.ingredients_drop : ''} pr-4 mt-4 mb-4`}
      ref={handleRef}
    >
      {selectedIngredients.length > 0 ? (
        selectedIngredients.map((ingredient) => (
          <ConstructorIngredient
            className="mb-4"
            key={ingredient.uniqueId}
            ingredient={ingredient}
            handleDelete={() => handleDelete(ingredient.uniqueId) as () => void}
            handleMove={(sourceId, targetId) =>
              dispatch(moveIngredient({ sourceId, targetId }))
            }
          />
        ))
      ) : (
        <div
          className={`${styles.ingredient_placeholer} ${isOver ? styles.placeholder_drop : ''}`}
        >
          <p className="text text_type_main-default">Выберите начинку</p>
        </div>
      )}
    </div>
  );
};
