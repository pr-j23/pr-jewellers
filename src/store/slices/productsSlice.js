import { createSlice } from "@reduxjs/toolkit";
import { mockProducts } from "../../mockData";

const initialState = {
  items: mockProducts,
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setProducts, setLoading, setError } = productsSlice.actions;
export const selectAllProducts = (state) => state.products.items;
export const selectProductsByCategory = (state, category) =>
  state.products.items.filter((product) => product.category === category);
export const selectProductById = (state, productId) =>
  state.products.items.find((product) => product.id === productId);

export default productsSlice.reducer;
