import { combineReducers } from '@reduxjs/toolkit';
import cartSlice from './cartSlice';
import editableProductDetailsSlice from './editableProductDetailsSlice';
import metalPricesSlice from './metalPricesSlice';
import popupModalSlice from './popupModalSlice';
import productsSlice from './productsSlice';

export const rootReducer = combineReducers({
  metalPrices: metalPricesSlice,
  cart: cartSlice,
  products: productsSlice,
  popupModal: popupModalSlice,
  editableProduct: editableProductDetailsSlice,
});
