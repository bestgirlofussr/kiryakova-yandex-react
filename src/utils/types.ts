export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type WithUniqueId<T> = T & { uniqueId: string };

export const INGREDIENT_TYPES = {
  BUN: 'bun' as const,
  SAUCE: 'sauce' as const,
  MAIN: 'main' as const,
} as const;

export type IngredientType = (typeof INGREDIENT_TYPES)[keyof typeof INGREDIENT_TYPES];

export type Order = {
  number: number;
  name: string;
};

export type OrderRequest = {
  ingredients: string[];
};

export type OrderResponse = {
  success: boolean;
  name: string;
  order: { number: number };
};

export type User = {
  email: string;
  name: string;
};
