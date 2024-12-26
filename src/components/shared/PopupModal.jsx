import classNames from "classnames";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closePopupModal,
  popupModalOpenState,
} from "../../redux/reducers/popupModalSlice";
import { fetchProductsRequest } from "../../redux/reducers/productsSlice";
import { deleteProductRecords } from "../../services/productService";
import Button from "./Button";

const POPUP_CONTENT = {
  title: "Delete Product",
  description: `Click "Cancel" to keep or "Delete" to Proceed.`,
  cancelBtn: "Cancel",
  successBtn: "Delete",
};

const PopupModal = () => {
  //   const { title, cancelBtn, successBtn, onCancel, onClick } = props;
  const dispatch = useDispatch();
  const { isOpen, productId } = useSelector(popupModalOpenState);

  if (!isOpen) return null; // Do not render if the modal is not open

  const successCallBack = () => {
    dispatch(fetchProductsRequest());
  };

  const buttonData = [
    {
      label: POPUP_CONTENT.cancelBtn,
      onClick: () => dispatch(closePopupModal()),
      className: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    },
    {
      label: POPUP_CONTENT.successBtn,
      onClick: () => {
        deleteProductRecords(productId, successCallBack);
        dispatch(closePopupModal());
      },
      className: "bg-red-500 text-white hover:bg-red-600",
    },
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={() => dispatch(closePopupModal())} // Close modal when clicking outside
    >
      <div
        className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <h2 className="text-lg font-semibold mb-4">{POPUP_CONTENT.title}</h2>
        <p className="mb-6">{POPUP_CONTENT.description}</p>
        <div className="flex justify-end gap-4">
          {buttonData?.map((button, index) => (
            <Button
              key={index}
              label={button?.label}
              onClick={button?.onClick}
              classN={classNames(
                "px-4 py-2 rounded min-w-20",
                button?.className
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
