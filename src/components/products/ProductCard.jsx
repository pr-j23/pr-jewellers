import classNames from 'classnames';
import { ChevronLeft, ChevronRight, Weight } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { FaRupeeSign, FaTrashAlt } from 'react-icons/fa';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { addToCart } from '../../redux/reducers/cartSlice';
import { selectMetalPrices } from '../../redux/reducers/metalPricesSlice';
import { openPopupModal } from '../../redux/reducers/popupModalSlice';
import { API_CONFIG } from '../../services/apiConfig';
import { constructWhatsAppURL } from '../../utils';
import Button from '../shared/Button';

export default function ProductCard({ product, type }) {
  const { silver } = useSelector(selectMetalPrices);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Convert single image to array if needed
  const images = useMemo(() => {
    if (Array.isArray(product?.images)) {
      return product.images;
    }
    return [product?.images];
  }, [product]);

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => (prev < images.length - 1 ? prev + 1 : prev));
  };

  const productPrice = useMemo(() => {
    let weightInGrams = 0;

    if (typeof product?.weight === 'string') {
      weightInGrams = parseFloat(product.weight.replace('gm', '').trim());
    } else if (typeof product?.weight === 'number') {
      weightInGrams = product?.weight;
    }

    if (product?.fixed_price > 0) {
      return Math.round(product.fixed_price);
    }

    if (weightInGrams > 0 && silver) {
      return Math.round(weightInGrams * (silver / 1000));
    }

    return 'N/A';
  }, [product?.fixed_price, product?.weight, silver]);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleWhatsAppClick = () => {
    if (type) {
      return;
    }

    const whatsappURL = constructWhatsAppURL(product);
    window.open(whatsappURL, '_blank');
  };

  const handleTrashClick = () => {
    dispatch(
      openPopupModal({
        modalType: 'deleteProduct',
        modalData: product?.id,
      })
    );
  };

  const handleEditClick = () => {
    dispatch(
      openPopupModal({
        modalType: 'editProduct',
        modalData: product,
      })
    );
  };

  const shareOptions = [
    {
      label: 'Share on WhatsApp',
      onClick: handleWhatsAppClick,
      bgColor: 'bg-green-600',
      hoverColor: 'hover:bg-green-700',
      additionalClasses: 'mt-2',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105">
      <div className="relative aspect-square group">
        <img
          src={
            images[currentImageIndex]?.id
              ? images[currentImageIndex]?.id
              : `${API_CONFIG.hostUrl}${images[currentImageIndex]}`
          }
          alt={`${product?.name} - Image ${currentImageIndex + 1}`}
          className="w-full h-full"
        />

        {/* Navigation Arrows */}
        <div className="absolute inset-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handlePrevImage}
            disabled={currentImageIndex === 0}
            className={classNames(
              'p-2 m-2 rounded-full bg-black/50 text-white transition-opacity',
              currentImageIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/70'
            )}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={handleNextImage}
            disabled={currentImageIndex === images.length - 1}
            className={classNames(
              'p-2 m-2 rounded-full bg-black/50 text-white transition-opacity',
              currentImageIndex === images.length - 1
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:bg-black/70'
            )}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl mb-2 truncate">{product?.name}</h3>
        <p className="text-gray-600 mb-4 truncate">{product?.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-gray-700">
            <Weight className="h-5 w-5 mr-1" />
            <span>{product?.weight}</span>
          </div>
          <div className="flex items-center text-purple-600 font-semibold">
            <FaRupeeSign className="h-3 w-5" />
            <span>{productPrice}</span>
            {/* <span>{product?.price?.toLocaleString()}</span> */}
          </div>
        </div>

        {shareOptions?.map((button, index) => (
          <Button
            key={index}
            label={button?.label}
            onClick={button?.onClick}
            classN={classNames(
              'w-full py-2 rounded transition-colors text-white',
              button.bgColor,
              button.hoverColor,
              button.additionalClasses
            )}
          />
        ))}
      </div>

      {user?.role === 'admin' && !type && (
        <div className="absolute top-0 right-0 flex flex-col gap-2">
          <Button
            label={<FaTrashAlt />}
            onClick={handleTrashClick}
            classN={classNames('bg-gray-800 text-red-500 hover:text-red-800 p-2 rounded-full')}
          />
          <Button
            label={<MdOutlineEdit />}
            onClick={handleEditClick}
            classN={classNames('bg-gray-800 text-white hover:text-gray-500 p-2 rounded-full')}
          />
        </div>
      )}
    </div>
  );
}
