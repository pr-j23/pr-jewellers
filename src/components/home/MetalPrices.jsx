import PropTypes from 'prop-types';
import { TrendingDown, TrendingUp, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectMetalPrices } from '../../redux/reducers/metalPricesSlice';

const PriceItem = ({ label, curr, prev }) => {
  const isLoading = curr == null;
  const isUp = curr > prev;

  const TrendIcon = isUp ? TrendingUp : TrendingDown;
  const trendColor = isUp ? 'text-green-400' : 'text-red-400';

  return (
    <div className="flex items-center">
      {!isLoading && <TrendIcon className={`h-5 w-5 mr-2 ${trendColor}`} />}
      <span className="font-medium flex items-center">
        {label} ₹: {isLoading ? <Loader2 className="h-5 w-5 ml-1 animate-spin" /> : curr}
      </span>
    </div>
  );
};

PriceItem.propTypes = {
  label: PropTypes.string.isRequired,
  curr: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  prev: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default function MetalPrices() {
  const { gold, silver, previousGold, previousSilver } = useSelector(selectMetalPrices);

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center space-x-8">
          <PriceItem label="Gold" curr={gold} prev={previousGold} />
          <PriceItem label="Silver" curr={silver} prev={previousSilver} />
        </div>
      </div>
    </div>
  );
}
