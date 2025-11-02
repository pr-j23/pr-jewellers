import PropTypes from 'prop-types';
import { categories, sortOptions, metalTypeFilterOptions } from '../../mockData';
import Dropdown from '../shared/Dropdown';

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
      options: categories.map(cat => ({
        value: cat.slug,
        label: cat.name,
      })),
      onChange: onCategoryChange,
      initialOption: 'All Products',
    },
    {
      label: 'Metal Type',
      id: 'metal-type',
      value: selectedMetalType,
      options: metalTypeFilterOptions,
      onChange: onMetalTypeChange,
      initialOption: 'All Metals',
    },
    {
      label: 'Sort By',
      id: 'sort',
      value: selectedSort,
      options: sortOptions,
      onChange: onSortChange,
      initialOption: 'Default',
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 sm:grid-cols-3 lg:flex lg:justify-center gap-6">
      {dropdowns.map(({ label, id, value, options, onChange, initialOption }) => (
        <div key={id} className="flex flex-col gap-2 w-full sm:max-w-52 lg:min-w-48">
          <label htmlFor={id} className="font-semibold text-gray-700 text-sm">
            {label}
          </label>
          <Dropdown
            options={options}
            handleSelection={option => onChange?.(option.value)}
            initialOption={options.find(opt => opt.value === value)?.label || initialOption}
          />
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
