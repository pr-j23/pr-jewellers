import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  modalType: null,
  modalData: {},
};

const modalSlice = createSlice({
  name: 'popupModal',
  initialState,
  reducers: {
    openPopupModal: (state, action) => {
      state.isOpen = true;
      state.modalType = action.payload.modalType;
      state.modalData = action.payload.modalData || {};
    },
    closePopupModal: state => {
      state.isOpen = false;
      state.modalType = null;
      state.modalData = {};
    },
  },
});

export const { openPopupModal, closePopupModal } = modalSlice.actions;
export const popupModalOpenState = state => state.popupModal;
export default modalSlice.reducer;
