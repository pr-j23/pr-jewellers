import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closePopupModal, popupModalOpenState } from '../../redux/reducers/popupModalSlice';
import { MODAL_CONTENT } from '../../utils/popupModalConfig';
import Button from './Button';

type ModalKey = keyof typeof MODAL_CONTENT;

const PopupModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen, modalType, modalData } = useSelector(popupModalOpenState);

  if (!isOpen || !modalType || !(modalType in MODAL_CONTENT)) return null;

  const modalConfig = MODAL_CONTENT[modalType as ModalKey];

  const buttonData = [
    {
      label: modalConfig.cancelButtonLabel,
      onClick: () => dispatch(closePopupModal()),
      className: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    },
    {
      label: modalConfig.confirmButtonLabel,
      onClick: () => {
        modalConfig.confirmButtonOnClick({ dispatch, navigate, modalData: modalData as never });
      },
      className: modalConfig.confirmButtonClassName,
    },
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={() => dispatch(closePopupModal())}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6"
        onClick={event => event.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">{modalConfig.title}</h2>
        <p className="mb-6">{modalConfig.description}</p>
        <div className="flex justify-end gap-4">
          {buttonData.map(button => (
            <Button
              key={button.label}
              label={button.label}
              onClick={button.onClick}
              classN={classNames('px-4 py-2 rounded min-w-20', button.className)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
