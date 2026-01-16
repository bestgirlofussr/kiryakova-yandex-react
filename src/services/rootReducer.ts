import { combineSlices } from '@reduxjs/toolkit';

import { constructorSlice } from './burger-constructor/reducer';
import { ingredientSlice } from './burger-ingredient/reducer';
import { ingredientsSlice } from './burger-ingredients/reducer';
import { orderSlice } from './order/reducer';
import { userSlice } from './user/reducer';

const rootReducer = combineSlices(
  ingredientsSlice,
  ingredientSlice,
  constructorSlice,
  orderSlice,
  userSlice
);
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
