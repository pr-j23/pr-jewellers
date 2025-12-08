import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export type PopupModalPayload = {
  modalType: string | null;
  modalData?: unknown;
};

type PopupModalState = {
  isOpen: boolean;
  modalType: string | null;
  modalData: unknown;
};

const initialState: PopupModalState = {
  isOpen: false,
  modalType: null,
  modalData: {},
};

const modalSlice = createSlice({
  name: 'popupModal',
  initialState,
  reducers: {
    openPopupModal: (state, action: PayloadAction<PopupModalPayload>) => {
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
export const popupModalOpenState = (state: RootState) => state.popupModal;
export default modalSlice.reducer;
