import React from "react";
import { useDispatch } from "react-redux";
import { Weight } from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";
import { addToCart } from "../../store/slices/cartSlice";
import { constructWhatsAppURL } from "../../utils";
import Button from "../shared/Button";
import classNames from "classnames";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleWhatsAppClick = () => {
    const whatsappURL = constructWhatsAppURL();
    console.log(whatsappURL, "whatsappURL");
    window.open(whatsappURL, "_blank");
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
      onClick: handleWhatsAppClick,
      bgColor: "bg-green-600",
      hoverColor: "hover:bg-green-700",
      additionalClasses: "mt-2",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105">
      <div className="relative h-64">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-serif mb-2 truncate">{product.name}</h3>
        <p className="text-gray-600 mb-4 truncate">{product.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-gray-700">
            <Weight className="h-5 w-5 mr-1" />
            <span>{product.weight}</span>
          </div>
          <div className="flex items-center text-purple-600 font-semibold">
            <FaRupeeSign className="h-3 w-5" />
            <span>{product.price.toLocaleString()}</span>
          </div>
        </div>

        {shareOptions.map((button, index) => (
          <Button
            key={index}
            label={button.label}
            onClick={button.onClick}
            classN={classNames(
              "w-full py-2 rounded transition-colors text-white",
              button.bgColor,
              button.hoverColor,
              button.additionalClasses
            )}
          />
        ))}
      </div>
    </div>
  );
}
