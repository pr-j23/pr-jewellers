import classNames from "classnames";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  closePopupModal,
  popupModalOpenState,
} from "../../redux/reducers/popupModalSlice";
import { MODAL_CONTENT } from "../../utils/popupModalConfig";
import Button from "./Button";

const PopupModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen, modalType, modalData } = useSelector(popupModalOpenState);

  if (!isOpen || !MODAL_CONTENT[modalType]) return null; // Do not render if the modal is not open

  const {
    title,
    description,
    cancelButtonLabel,
    confirmButtonLabel,
    confirmButtonClassName,
    confirmButtonOnClick,
  } = MODAL_CONTENT[modalType];

  const buttonData = [
    {
      label: cancelButtonLabel,
      onClick: () => dispatch(closePopupModal()),
      className: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    },
    {
      label: confirmButtonLabel,
      onClick: () => {
        confirmButtonOnClick({ dispatch, navigate, modalData });
      },
      className: confirmButtonClassName,
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
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="mb-6">{description}</p>
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
