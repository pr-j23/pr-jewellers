import React from "react";
import { useSelector } from "react-redux";
import { TrendingUp, TrendingDown } from "lucide-react";
import { selectMetalPrices } from "../../store/slices/metalPricesSlice";

export default function MetalPrices() {
  const { gold, silver, previousGold, previousSilver } =
    useSelector(selectMetalPrices);

  const getTrendIcon = (currPrice, prevPrice) => {
    return currPrice > prevPrice ? (
      <TrendingUp className="h-5 w-5 mr-2" />
    ) : (
      <TrendingDown className="h-5 w-5 mr-2" />
    );
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center space-x-8">
          <div className="flex items-center">
            {getTrendIcon(gold, previousGold)}
            <span className="font-medium">Gold: ₹ {gold.toFixed(2)}</span>
          </div>
          <div className="flex items-center">
            {getTrendIcon(silver, previousSilver)}
            <span className="font-medium">Silver: ₹ {silver.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
