import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { matchesCategorySlug } from '../../utils/categoryHelpers';
import type { RootState } from '../store';
import type { Product } from '../../types/product';

export type ProductsState = {
  items: Product[];
  loading: boolean;
  error: string | null;
};

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProductsRequest: state => {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action: PayloadAction<Product[]>) => {
      state.loading = false;
      state.items = action.payload;
    },
    fetchProductsFailure: (state, action: PayloadAction<string | null>) => {
      state.loading = false;
      state.error = action.payload ?? 'Unable to fetch products';
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
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

export const selectAllProducts = (state: RootState): Product[] => state.products.items;
export const selectProductsByCategory = (state: RootState, category?: string | null): Product[] =>
  state.products.items?.filter(product => matchesCategorySlug(product, category)) || [];
export const selectProductById = (state: RootState, productId: string | number): Product | null =>
  state.products.items?.find(product => product.id === productId) || null;

// Exporting the reducer for store configuration
export default productsSlice.reducer;
