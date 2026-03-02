import {
  INGREDIENT_TYPES,
  ORDER_STATUSES,
  type OrderRequest,
  type User,
} from '@/utils/types';

export const mockIngredient = {
  _id: 'ingredient_1',
  name: 'Test Bun',
  type: INGREDIENT_TYPES.BUN,
  proteins: 20,
  fat: 50,
  carbohydrates: 30,
  calories: 100,
  price: 100,
  image: '/image.jpg',
  image_mobile: '/image_mobile.jpg',
  image_large: '/image_large.jpg',
  __v: 0,
};

export const mockIngredients = [mockIngredient];

export const mockOrder = {
  name: 'order_1',
  ingredients: ['ingredient_1'],
  status: ORDER_STATUSES.DONE,
  number: 12345,
  createdAt: '2026-02-28',
  updatedAt: '2026-02-28',
};

export const mockOrdersResponse = {
  success: true,
  orders: [mockOrder],
  total: 100,
  totalToday: 10,
};

export const mockCurrentOrder = {
  name: 'order_2',
  ingredients: ['ingredient_2'],
  status: ORDER_STATUSES.PENDING,
  number: 123456,
  createdAt: '2026-02-28',
  updatedAt: '2026-02-28',
};

export const mockOrderRequest: OrderRequest = { ingredients: ['ingredient_1'] };

export const mockUser: User = {
  email: 'test@test.com',
  name: 'Test User',
};
