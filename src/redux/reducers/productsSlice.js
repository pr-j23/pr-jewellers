import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Actions for managing product state
    fetchProductsRequest: state => {
      state.loading = true;
      state.error = null; // Clear previous errors
    },
    fetchProductsSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload; // Update state with fetched products
    },
    fetchProductsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload; // Store the error message
    },
    setProducts: (state, action) => {
      state.items = action.payload; // Manually update products
    },
    setLoading: (state, action) => {
      state.loading = action.payload; // Update loading state
    },
    setError: (state, action) => {
      state.error = action.payload; // Update error state
    },
  },
});

// Exporting actions for dispatching
export const {
  fetchProductsRequest,
  fetchProductsSuccess,
  fetchProductsFailure,
  setProducts,
  setLoading,
  setError,
} = productsSlice.actions;

// Selectors for accessing specific parts of the state
export const selectAllProducts = state => state.products.items;
export const selectProductsByCategory = (state, category) =>
  state.products.items?.filter(product => product.category === category) || [];
export const selectProductById = (state, productId) =>
  state.products.items?.find(product => product.id === productId) || null;

// Exporting the reducer for store configuration
export default productsSlice.reducer;
