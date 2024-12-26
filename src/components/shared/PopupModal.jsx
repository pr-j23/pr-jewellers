import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closePopupModal,
  popupModalOpenState,
} from "../../redux/reducers/popupModalSlice";

const PopupModal = () => {
  //   const { title, cancelBtn, successBtn, onCancel, onClick } = props;
  const dispatch = useDispatch();
  const isOpen = useSelector(popupModalOpenState);

  if (!isOpen) return null; // Do not render if the modal is not open

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={() => dispatch(closePopupModal())} // Close modal when clicking outside
    >
      <div
        className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <h2 className="text-lg font-semibold mb-4">Modal Title</h2>
        <p className="mb-6">
          Click "Cancel" to close the modal or "OK" to proceed.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => dispatch(closePopupModal())}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              dispatch(closePopupModal()); // Close after the action
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
