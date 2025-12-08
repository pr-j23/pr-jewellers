import { useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { matchesCategorySlug } from '../utils';
import type { Product } from '../types/product';

type ProductFilters = {
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  minWeight: number | null;
  maxWeight: number | null;
};

type SortType =
  | 'default'
  | 'price-low-high'
  | 'price-high-low'
  | 'name-a-z'
  | 'name-z-a'
  | 'weight-low-high'
  | 'weight-high-low';

type UseProductsResult = {
  products: Product[];
  setFilters: Dispatch<SetStateAction<ProductFilters>>;
  setSortType: Dispatch<SetStateAction<SortType>>;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  filters: ProductFilters;
  sortType: SortType;
  searchQuery: string;
  totalCount: number;
  categories: string[];
  priceRange: { min: number; max: number };
};

const sorters: Record<Exclude<SortType, 'default'>, (a: Product, b: Product) => number> = {
  'price-low-high': (a, b) => a.fixed_price - b.fixed_price,
  'price-high-low': (a, b) => b.fixed_price - a.fixed_price,
  'name-a-z': (a, b) => a.name.localeCompare(b.name),
  'name-z-a': (a, b) => b.name.localeCompare(a.name),
  'weight-low-high': (a, b) => a.weight - b.weight,
  'weight-high-low': (a, b) => b.weight - a.weight,
};

const hasNumber = (value: number | null): value is number => typeof value === 'number' && Number.isFinite(value);
const normalizeString = (value?: string) => value?.trim() ?? '';

const DEFAULT_FILTERS: ProductFilters = {
  category: 'all',
  minPrice: null,
  maxPrice: null,
  minWeight: null,
  maxWeight: null,
};

export const useProducts = (
  products: Product[] = [],
  initialFilters: Partial<ProductFilters> = {}
): UseProductsResult => {
  const [filters, setFilters] = useState<ProductFilters>({ ...DEFAULT_FILTERS, ...initialFilters });
  const [sortType, setSortType] = useState<SortType>('default');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply category filter
    const categoryFilter = normalizeString(filters.category);
    if (categoryFilter && categoryFilter !== 'all') {
      result = result.filter(product => matchesCategorySlug(product, categoryFilter));
    }

    // Apply price range filter
    const minPrice = filters.minPrice;
    if (hasNumber(minPrice)) {
      result = result.filter(product => product.fixed_price >= minPrice);
    }

    const maxPrice = filters.maxPrice;
    if (hasNumber(maxPrice)) {
      result = result.filter(product => product.fixed_price <= maxPrice);
    }

    // Apply weight filter if available
    const minWeight = filters.minWeight;
    if (hasNumber(minWeight)) {
      result = result.filter(product => product.weight >= minWeight);
    }

    const maxWeight = filters.maxWeight;
    if (hasNumber(maxWeight)) {
      result = result.filter(product => product.weight <= maxWeight);
    }

    // Apply search query
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      const query = trimmedQuery.toLowerCase();
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.product_id.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortType !== 'default') {
      return [...result].sort(sorters[sortType]);
    }

    return result;
  }, [products, filters, sortType, searchQuery]);

  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(product => normalizeString(product.category)))];
    return uniqueCategories.filter(Boolean);
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

export type { ProductFilters, SortType, UseProductsResult };
