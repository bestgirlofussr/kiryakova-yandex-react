import { Counter } from '@krgaa/react-developer-burger-ui-components';
import { useCallback } from 'react';
import { useDrag } from 'react-dnd';

import { Price } from '@components/ui/price/price';
import { getBun, getIngredients } from '@services/burger-constructor/reducer';
import { setSelectedIngredient } from '@services/burger-ingredient/reducer';
import { useAppDispatch, useAppSelector } from '@services/store';
import { INGREDIENT_TYPES, type TIngredient } from '@utils/types';

import type React from 'react';

import styles from './burger-ingredient.module.css';

type IngredientItemProps = {
  item: TIngredient;
};

export const BurgerIngredient: React.FC<IngredientItemProps> = ({ item }) => {
  const selectedIngredients = useAppSelector(getIngredients);
  const selectedBun = useAppSelector(getBun);

  const dispatch = useAppDispatch();

  const getIngredientCount = useCallback(
    (ingredientId: string) => {
      if (selectedBun?._id === ingredientId) {
        return 2;
      }
      return selectedIngredients.filter((item) => item._id === ingredientId).length;
    },
    [selectedBun, selectedIngredients]
  );

  const renderCounter = useCallback((count: number) => {
    return count > 0 ? <Counter count={count} /> : null;
  }, []);

  const [{ isDragging }, drag] = useDrag(
    {
      type: item.type === INGREDIENT_TYPES.BUN ? 'bun' : 'ingredient',
      item,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    },
    [item]
  );

  const dragAndClickRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        drag(node);
      }
    },
    [drag]
  );

  return (
    <div
      className={`${styles.ingredient} ${isDragging ? styles.dragging : ''}`}
      onClick={() => dispatch(setSelectedIngredient(item))}
      role="button"
      ref={dragAndClickRef}
    >
      {renderCounter(getIngredientCount(item._id))}
      <img src={item.image} alt={`${item.name}.`} className={`${styles.image} mb-1`} />
      <Price className="mb-1" cost={item.price} />
      <div className="text text_type_main-default">{item.name}</div>
    </div>
  );
};
