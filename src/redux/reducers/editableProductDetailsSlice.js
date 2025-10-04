import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  editableProductDetails: null,
};

const editableProductSlice = createSlice({
  name: 'editableProduct',
  initialState,
  reducers: {
    setEditableProductDetails: (state, action) => {
      state.editableProductDetails = action.payload;
    },
  },
});

export const { setEditableProductDetails } = editableProductSlice.actions;
export default editableProductSlice.reducer;
