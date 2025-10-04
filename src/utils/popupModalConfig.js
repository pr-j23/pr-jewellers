import { setEditableProductDetails } from '../redux/reducers/editableProductDetailsSlice';
import { closePopupModal } from '../redux/reducers/popupModalSlice';
import { fetchProductsRequest } from '../redux/reducers/productsSlice';
import { deleteProductRecords } from '../services/productService';

export const MODAL_CONTENT = {
  deleteProduct: {
    title: 'Delete Product',
    description: 'Click "Cancel" to keep or "Delete" to proceed.',
    cancelButtonLabel: 'Cancel',
    confirmButtonLabel: 'Delete',
    confirmButtonClassName: 'bg-red-500 text-white hover:bg-red-600',
    confirmButtonOnClick: ({ dispatch, modalData }) => {
      const successCallBack = () => {
        dispatch(fetchProductsRequest());
      };

      deleteProductRecords(modalData, successCallBack);
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
      navigate('/admin/add-product');
      dispatch(setEditableProductDetails(modalData));
      dispatch(closePopupModal());
    },
  },
};
