import React from 'react';
import { categories, sortOptions } from '../../mockData';

function ProductFilter({ selectedCategory, selectedSort, onCategoryChange, onSortChange }) {
  const dropdowns = [
    {
      label: 'Category',
      id: 'category',
      value: selectedCategory,
      options: categories,
      onChange: onCategoryChange,
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
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-2 sm:flex sm:justify-center gap-8">
      {dropdowns?.map(({ label, id, value, options, onChange }) => (
        <div key={id} className="flex flex-col gap-2 max-w-52 sm:min-w-48">
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

export default ProductFilter;
