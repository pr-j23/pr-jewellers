import { combineReducers } from '@reduxjs/toolkit';
import metalPricesSlice from './metalPricesSlice';
import popupModalSlice from './popupModalSlice';
import productsSlice from './productsSlice';

export const rootReducer = combineReducers({
  metalPrices: metalPricesSlice,
  products: productsSlice,
  popupModal: popupModalSlice,
});

export type RootReducer = typeof rootReducer;
