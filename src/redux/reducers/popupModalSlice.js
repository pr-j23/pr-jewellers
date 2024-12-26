import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "popupModal",
  initialState: {
    isPopupModalOpen: false,
  },
  reducers: {
    openPopupModal: (state) => {
      state.isPopupModalOpen = true;
    },
    closePopupModal: (state) => {
      state.isPopupModalOpen = false;
    },
  },
});

export const { openPopupModal, closePopupModal } = modalSlice.actions;
export const popupModalOpenState = (state) => state.popupModal.isPopupModalOpen;
export default modalSlice.reducer;
