import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types/product';

export type EditableProductState = {
  editableProductDetails: Product | null;
};

const initialState: EditableProductState = {
  editableProductDetails: null,
};

const editableProductSlice = createSlice({
  name: 'editableProduct',
  initialState,
  reducers: {
    setEditableProductDetails: (state, action: PayloadAction<Product | null>) => {
      state.editableProductDetails = action.payload;
    },
  },
});

export const { setEditableProductDetails } = editableProductSlice.actions;
export default editableProductSlice.reducer;
