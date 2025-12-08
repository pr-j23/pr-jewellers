import classNames from 'classnames';
import { ChevronLeft, ChevronRight, Weight } from 'lucide-react';
import { useMemo, useState } from 'react';
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
import type { Product } from '../../types/product';

export type ProductCardProps = {
  product: Product;
  type?: string | null;
};

const ProductCard = ({ product, type = null }: ProductCardProps) => {
  const { silver, gold } = useSelector(selectMetalPrices);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = useMemo(() => {
    if (Array.isArray(product?.images)) {
      return product.images;
    }
    return product?.images ? [product.images] : [];
  }, [product]);

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => (prev < images.length - 1 ? prev + 1 : prev));
  };

  const formattedWeight = useMemo(() => {
    if (product?.weight == null) return 'N/A';
    const numericValue = String(product.weight ?? '').replace(/[^\d.]/g, '');
    return numericValue ? `${numericValue} gms` : 'N/A';
  }, [product?.weight]);

  const productPrice = useMemo(() => {
    const weightInGrams =
      Number(String(product?.weight ?? '').replace(/[^\d.]/g, '')) || Number(product?.weight ?? 0) || 0;

    if (product?.fixed_price && product.fixed_price > 0) {
      return Math.round(product.fixed_price);
    }

    if (weightInGrams > 0) {
      if (product?.metal_type?.toLowerCase() === 'gold' && gold) {
        return Math.round(weightInGrams * gold);
      }
      if (product?.metal_type?.toLowerCase() === 'silver' && silver) {
        return Math.round(weightInGrams * (silver / 1000));
      }
    }

    return 'N/A';
  }, [product?.fixed_price, product?.weight, product?.metal_type, silver, gold]);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleWhatsAppClick = () => {
    if (type) return;
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
        {images.length > 0 && (
          <img
            src={
              typeof images[currentImageIndex] === 'string'
                ? `${API_CONFIG.hostUrl}${images[currentImageIndex]}`
                : (images[currentImageIndex] as any)?.id || (images[currentImageIndex] as any)?.preview
            }
            alt={`${product?.name} - Image ${currentImageIndex + 1}`}
            className="w-full h-full"
          />
        )}

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
            <span>{formattedWeight}</span>
          </div>
          <div className="flex items-center text-purple-600 font-semibold">
            <FaRupeeSign className="h-3 w-5" />
            <span>{productPrice}</span>
          </div>
        </div>

        {shareOptions.map((button, index) => (
          <Button
            key={index}
            label={button.label}
            onClick={button.onClick}
            classN={classNames(
              'w-full py-2 rounded transition-colors text-white',
              button.bgColor,
              button.hoverColor,
              button.additionalClasses
            )}
          />
        ))}

        <Button
          label="Add to Cart"
          onClick={handleAddToCart}
          classN="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
        />
      </div>

      {user?.role === 'admin' && !type && (
        <div className="absolute top-0 right-0 flex flex-col gap-2">
          <Button
            label={<FaTrashAlt />}
            onClick={handleTrashClick}
            classN="bg-gray-800 text-red-500 hover:text-red-800 p-2 rounded-full"
          />
          <Button
            label={<MdOutlineEdit />}
            onClick={handleEditClick}
            classN="bg-gray-800 text-white hover:text-gray-500 p-2 rounded-full"
          />
        </div>
      )}
    </div>
  );
};

export default ProductCard;
