import { combineReducers } from "@reduxjs/toolkit";
import cartSlice from "./cartSlice";
import metalPricesSlice from "./metalPricesSlice";
import productsSlice from "./productsSlice";
import authReducer from "./authSlice";
import popupModalSlice from "./popupModalSlice";

export const rootReducer = combineReducers({
  metalPrices: metalPricesSlice,
  cart: cartSlice,
  products: productsSlice,
  auth: authReducer,
  popupModal: popupModalSlice
});
