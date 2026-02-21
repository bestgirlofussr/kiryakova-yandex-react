import { getIngredients } from '@/services/burger-ingredients/reducer';
import { useAppSelector } from '@/services/store';
import { INGREDIENT_TYPES, type Order, type TIngredient } from '@/utils/types';
import { useMemo } from 'react';

export const useOrderIngredients = (
  order: Order | null | undefined
): { ingredients: TIngredient[]; totalPrice: number } => {
  const allIngredients = useAppSelector(getIngredients);

  const sortedIngredients = useMemo(() => {
    if (!order) return [];

    const types = [INGREDIENT_TYPES.BUN, INGREDIENT_TYPES.SAUCE, INGREDIENT_TYPES.MAIN];

    return allIngredients
      .filter((it) => order.ingredients.includes(it._id))
      .sort((a, b) => {
        const indexA = types.indexOf(a.type);
        const indexB = types.indexOf(b.type);
        return indexA - indexB;
      });
  }, [allIngredients, order]);

  const totalPrice = useMemo(() => {
    if (!sortedIngredients.length) return 0;

    const bunPrice =
      sortedIngredients.find((it) => it.type === INGREDIENT_TYPES.BUN)?.price ?? 0;

    const fillingPrice = sortedIngredients
      .filter((it) => it.type !== INGREDIENT_TYPES.BUN)
      .reduce((acc, item) => acc + item.price, 0);

    return bunPrice * 2 + fillingPrice;
  }, [sortedIngredients]);

  return { ingredients: sortedIngredients, totalPrice };
};
