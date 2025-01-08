import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Weight } from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";
import { constructWhatsAppURL } from "../../utils";
import Button from "../shared/Button";
import classNames from "classnames";
import { addToCart } from "../../redux/reducers/cartSlice";
import { API_CONFIG } from "../../services/apiConfig";
import { FaTrashAlt } from "react-icons/fa";
import { openPopupModal } from "../../redux/reducers/popupModalSlice";
import { useAuth } from "../../context/AuthContext";
import { selectMetalPrices } from "../../redux/reducers/metalPricesSlice";

export default function ProductCard({ product, type }) {
  const { silver } = useSelector(selectMetalPrices);
  const dispatch = useDispatch();
  const { user } = useAuth();

  const productPrice = useMemo(() => {
    let weightInGrams = 0;

    if (typeof product?.weight === "string") {
      weightInGrams = parseFloat(product.weight.replace("gm", "").trim());
    } else if (typeof product?.weight === "number") {
      weightInGrams = product?.weight;
    }

    if (product?.fixed_price > 0) {
      return Math.round(product.fixed_price);
    }

    if (weightInGrams > 0 && silver) {
      return Math.round(weightInGrams * (silver / 1000));
    }

    return "N/A";
  }, [product?.fixed_price, product?.weight, silver]);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleWhatsAppClick = () => {
    const whatsappURL = constructWhatsAppURL(product);
    window.open(whatsappURL, "_blank");
  };

  const handleTrashClick = () => {
    dispatch(openPopupModal(product?.id));
  };

  const shareOptions = [
    // {
    //   label: "Add to Cart",
    //   onClick: handleAddToCart,
    //   bgColor: "bg-purple-600",
    //   hoverColor: "hover:bg-purple-700",
    //   additionalClasses: "mt-4 hidden",
    // },
    {
      label: "Share on WhatsApp",
      onClick: !type && handleWhatsAppClick,
      bgColor: "bg-green-600",
      hoverColor: "hover:bg-green-700",
      additionalClasses: "mt-2",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105">
      <div className="relative h-64">
        <img
          src={type ? product?.image : `${API_CONFIG.hostUrl}${product?.image}`}
          alt={product?.name}
          className="w-full h-full object-fill"
        />
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
              "w-full py-2 rounded transition-colors text-white",
              button.bgColor,
              button.hoverColor,
              button.additionalClasses
            )}
          />
        ))}
      </div>
      {user?.role === "admin" && !type && (
        <Button
          label={<FaTrashAlt />}
          onClick={handleTrashClick}
          classN={classNames(
            "absolute top-0 right-0 m-2 bg-gray-800 text-red-500 hover:text-red-800 p-2 rounded-full"
          )}
        />
      )}
    </div>
  );
}
