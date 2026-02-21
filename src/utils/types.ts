export type TIngredient = {
  _id: string;
  name: string;
  type: IngredientType;
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

export const ORDER_STATUSES = {
  DONE: 'done' as const,
  CREATED: 'created' as const,
  PENDING: 'pending' as const,
  CANCELED: 'canceled' as const,
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];

export type OrderInfo = {
  number: number;
  name: string;
};

export type Order = OrderInfo & {
  status: OrderStatus;
  ingredients: string[];
  createdAt: string;
  updatedAt: string;
};

export type OrderRequest = {
  ingredients: string[];
};

export type OrderResponse = {
  success: boolean;
  name: string;
  order: { number: number };
};

export type OrdersResponse = {
  success: boolean;
  orders: Order[];
  total: number;
  totalToday: number;
};

export type User = {
  email: string;
  name: string;
};

export const WEB_SOCKET_STATUSES = {
  CONNECTING: 'CONNECTING...' as const,
  ONLINE: 'ONLINE' as const,
  OFFLINE: 'OFFLINE' as const,
} as const;

export type WebsocketStatus =
  (typeof WEB_SOCKET_STATUSES)[keyof typeof WEB_SOCKET_STATUSES];
