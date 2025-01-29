import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartSlice from "./cartSlice";
import metalPricesSlice from "./metalPricesSlice";
import popupModalSlice from "./popupModalSlice";
import productsSlice from "./productsSlice";

export const rootReducer = combineReducers({
  metalPrices: metalPricesSlice,
  cart: cartSlice,
  products: productsSlice,
  auth: authReducer,
  popupModal: popupModalSlice,
});
