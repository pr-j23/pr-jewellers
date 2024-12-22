import React from "react";
import { categories, sortOptions } from "../../mockData";

function ProductFilter({
  selectedCategory,
  selectedSort,
  onCategoryChange,
  onSortChange,
}) {


  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-2 sm:flex sm:justify-center gap-8">
      <div className="flex flex-col gap-2 max-w-52 sm:min-w-48">
        <label
          htmlFor="category"
          className="font-semibold text-gray-700 text-sm"
        >
          Category
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500 transition duration-200"
        >
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 max-w-52 sm:min-w-48">
        <label htmlFor="sort" className="font-semibold text-gray-700 text-sm">
          Sort By
        </label>
        <select
          id="sort"
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500 transition duration-200"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ProductFilter;
