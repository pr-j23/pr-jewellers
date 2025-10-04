import { useMemo, useState } from 'react';

/**
 * Custom hook for product filtering, sorting, and searching
 * @param {Array} products - Array of product objects
 * @param {Object} initialFilters - Initial filter values
 * @returns {Object} Filtered products and filter controls
 */
export const useProducts = (products = [], initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [sortType, setSortType] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply category filter
    if (filters.category) {
      result = result.filter(product => product.category === filters.category);
    }

    // Apply price range filter
    if (filters.minPrice !== undefined) {
      result = result.filter(product => product.fixed_price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter(product => product.fixed_price <= filters.maxPrice);
    }

    // Apply weight filter if available
    if (filters.minWeight !== undefined) {
      result = result.filter(product => product.weight >= filters.minWeight);
    }

    if (filters.maxWeight !== undefined) {
      result = result.filter(product => product.weight <= filters.maxWeight);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.product_id.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortType) {
      case 'price-low-high':
        return result.sort((a, b) => a.fixed_price - b.fixed_price);
      case 'price-high-low':
        return result.sort((a, b) => b.fixed_price - a.fixed_price);
      case 'name-a-z':
        return result.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-z-a':
        return result.sort((a, b) => b.name.localeCompare(a.name));
      case 'weight-low-high':
        return result.sort((a, b) => a.weight - b.weight);
      case 'weight-high-low':
        return result.sort((a, b) => b.weight - a.weight);
      default:
        return result;
    }
  }, [products, filters, sortType, searchQuery]);

  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    return uniqueCategories.filter(Boolean); // Remove empty categories
  }, [products]);

  // Get price range
  const priceRange = useMemo(() => {
    if (!products.length) return { min: 0, max: 0 };

    return products.reduce(
      (range, product) => {
        const price = product.fixed_price;
        return {
          min: Math.min(range.min, price),
          max: Math.max(range.max, price),
        };
      },
      { min: Infinity, max: 0 }
    );
  }, [products]);

  return {
    products: filteredProducts,
    setFilters,
    setSortType,
    setSearchQuery,
    filters,
    sortType,
    searchQuery,
    totalCount: filteredProducts.length,
    categories,
    priceRange,
  };
};

export default useProducts;
