import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  productId: null,
};

const modalSlice = createSlice({
  name: "popupModal",
  initialState,
  reducers: {
    openPopupModal: (state, action) => {
      state.isOpen = true;
      state.productId = action.payload;
    },
    closePopupModal: (state) => {
      state.isOpen = false;
      state.productId = null;
    },
  },
});

export const { openPopupModal, closePopupModal } = modalSlice.actions;
export const popupModalOpenState = (state) => state.popupModal;
export default modalSlice.reducer;
