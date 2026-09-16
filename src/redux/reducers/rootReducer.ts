import { combineReducers } from '@reduxjs/toolkit';
import editableProductDetailsSlice from './editableProductDetailsSlice';
import metalPricesSlice from './metalPricesSlice';
import popupModalSlice from './popupModalSlice';
import productsSlice from './productsSlice';

export const rootReducer = combineReducers({
  metalPrices: metalPricesSlice,
  products: productsSlice,
  popupModal: popupModalSlice,
  editableProduct: editableProductDetailsSlice,
});

export type RootReducer = typeof rootReducer;
