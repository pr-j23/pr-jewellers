import type { NavigateFunction } from 'react-router-dom';
import { setEditableProductDetails } from '../redux/reducers/editableProductDetailsSlice';
import { closePopupModal } from '../redux/reducers/popupModalSlice';
import { fetchProductsRequest } from '../redux/reducers/productsSlice';
import { deleteProductRecords } from '../services/productService';
import type { AppDispatch } from '../redux/store';
import type { Product } from '../types/product';

type ModalHandlerArgs<T> = {
  dispatch: AppDispatch;
  navigate: NavigateFunction;
  modalData: T;
};

type ModalConfig<T> = {
  title: string;
  description: string;
  cancelButtonLabel: string;
  confirmButtonLabel: string;
  confirmButtonClassName: string;
  confirmButtonOnClick: (args: ModalHandlerArgs<T>) => void;
};

type ModalContentMap = {
  deleteProduct: ModalConfig<string | number>;
  editProduct: ModalConfig<Product | null | undefined>;
};

export const MODAL_CONTENT: ModalContentMap = {
  deleteProduct: {
    title: 'Delete Product',
    description: 'Click "Cancel" to keep or "Delete" to proceed.',
    cancelButtonLabel: 'Cancel',
    confirmButtonLabel: 'Delete',
    confirmButtonClassName: 'bg-red-500 text-white hover:bg-red-600',
    confirmButtonOnClick: ({ dispatch, modalData }) => {
      if (typeof modalData !== 'string' && typeof modalData !== 'number') {
        console.error('Invalid modal data provided for deleteProduct modal');
        return;
      }

      const successCallBack = () => {
        dispatch(fetchProductsRequest());
      };

      void deleteProductRecords(modalData, successCallBack);
      dispatch(closePopupModal());
    },
  },

  editProduct: {
    title: 'Edit Product',
    description: 'Click "Cancel" to keep or "Edit" to proceed.',
    cancelButtonLabel: 'Cancel',
    confirmButtonLabel: 'Edit',
    confirmButtonClassName: 'bg-blue-500 text-white hover:bg-blue-600',
    confirmButtonOnClick: ({ dispatch, navigate, modalData }) => {
      if (!modalData || typeof modalData !== 'object') {
        console.error('Invalid modal data provided for editProduct modal');
        return;
      }

      navigate('/admin/add-product');
      dispatch(setEditableProductDetails(modalData as Product));
      dispatch(closePopupModal());
    },
  },
};
