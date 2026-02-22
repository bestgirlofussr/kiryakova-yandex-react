import { getIngredientsMap } from '@/services/burger-ingredients/reducer';
import { useAppSelector } from '@/services/store';
import { useMemo } from 'react';

import type { Order, TIngredient } from '@/utils/types';

export const useOrderIngredients = (
  order: Order | null | undefined
): { ingredients: TIngredient[]; totalPrice: number } => {
  const allIngredients = useAppSelector(getIngredientsMap);

  const ingredients = useMemo(() => {
    if (!order) return [];

    return order.ingredients.map((it) => allIngredients[it]).filter((it) => !!it);
  }, [allIngredients, order]);

  const totalPrice = useMemo(() => {
    if (!ingredients.length) return 0;

    return ingredients.reduce((acc, item) => acc + item.price, 0);
  }, [ingredients]);

  return { ingredients, totalPrice };
};
