import PropTypes from 'prop-types';
import { categories, sortOptions, metalTypeFilterOptions } from '../../mockData';

function ProductFilter({
  selectedCategory,
  selectedSort,
  selectedMetalType,
  onCategoryChange,
  onSortChange,
  onMetalTypeChange,
}) {
  const dropdowns = [
    {
      label: 'Category',
      id: 'category',
      value: selectedCategory,
      options: categories,
      onChange: onCategoryChange,
    },
    {
      label: 'Metal Type',
      id: 'metal-type',
      value: selectedMetalType,
      options: metalTypeFilterOptions,
      onChange: onMetalTypeChange,
    },
    {
      label: 'Sort By',
      id: 'sort',
      value: selectedSort,
      options: sortOptions,
      onChange: onSortChange,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 sm:grid-cols-3 lg:flex lg:justify-center gap-6">
      {dropdowns?.map(({ label, id, value, options, onChange }) => (
        <div key={id} className="flex flex-col gap-2 w-full sm:max-w-52 lg:min-w-48">
          <label htmlFor={id} className="font-semibold text-gray-700 text-sm">
            {label}
          </label>
          <select
            id={id}
            value={value}
            onChange={e => onChange?.(e?.target?.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500 transition duration-200"
          >
            {options?.map(item => (
              <option key={item?.slug || item?.value} value={item?.slug || item?.value}>
                {item?.name || item?.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

ProductFilter.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  selectedSort: PropTypes.string.isRequired,
  selectedMetalType: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onMetalTypeChange: PropTypes.func.isRequired,
};

export default ProductFilter;
