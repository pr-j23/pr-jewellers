import { combineReducers } from "@reduxjs/toolkit";
import cartSlice from "./slices/cartSlice";
import metalPricesSlice from "./slices/metalPricesSlice";
import productsSlice from "./slices/productsSlice";
import authReducer from "./slices/authSlice";

export const rootReducer = combineReducers({
  metalPrices: metalPricesSlice,
  cart: cartSlice,
  products: productsSlice,
  auth: authReducer,
});
