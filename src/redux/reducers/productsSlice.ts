import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProductRecords } from '../../services/productService';
import type { Product } from '../../types/product';
import type { RootState } from '../store';

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

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProductRecords();
      if (response.status !== 'success') {
        return rejectWithValue(response.message || 'Failed to fetch products');
      }
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch products';
      return rejectWithValue(message);
    }
  }
);

// Backward-compatible alias for existing action dispatchers
export const fetchProductsRequest = fetchProducts;

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? 'Unable to fetch products';
      });
  },
});

export const selectAllProducts = (state: RootState): Product[] => state.products.items;

export default productsSlice.reducer;
