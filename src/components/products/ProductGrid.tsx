import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { selectAllProducts } from '../../redux/reducers/productsSlice';
import { useProducts } from '../../hooks';
import type { SortType } from '../../hooks/useProducts';
import type { Product } from '../../types/product';
import ProductCard from './ProductCard';
import ProductFilter from './ProductFilter';

type ProductGridProps = {
  type?: string | null;
  categorySlug?: string;
  noHeading?: boolean;
};

const ProductGrid = ({ type = null, categorySlug, noHeading = false }: ProductGridProps) => {
  const location = useLocation();
  const allProducts = useSelector(selectAllProducts);

  const { products, setFilters, setSortType, filters, sortType } = useProducts(allProducts, {
    category: categorySlug ?? 'all',
  });

  const [selectedMetalType, setSelectedMetalType] = useState<string>('all');

  const appliedProducts = useMemo(() => {
    if (selectedMetalType === 'all') {
      return products;
    }
    const target = selectedMetalType.toLowerCase();
    return products.filter(product => product?.metal_type?.toLowerCase() === target);
  }, [products, selectedMetalType]);

  const numberOfProductsToShow = location.pathname === '/' ? 4 : appliedProducts.length;

  const displayedProducts = useMemo<Product[]>(() => {
    return appliedProducts.slice(0, numberOfProductsToShow);
  }, [appliedProducts, numberOfProductsToShow]);

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const handleSortChange = (value: SortType) => {
    setSortType(value);
  };

  const handleMetalTypeChange = (value: string) => {
    setSelectedMetalType(value);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      {!noHeading && <h2 className="text-3xl font-serif text-center mb-8">Featured Collections</h2>}
      {type && (
        <>
          <ProductFilter
            selectedCategory={filters.category}
            selectedSort={sortType}
            selectedMetalType={selectedMetalType}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
            onMetalTypeChange={handleMetalTypeChange}
          />

          <div className="text-gray-600 text-sm mb-4">Showing {appliedProducts.length} products</div>
        </>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-8">
        {displayedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
