import React, { useState } from "react";
import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import { selectAllProducts } from "../../store/slices/productsSlice";
import { sortProducts, useProducts } from "../../utils";
import ProductFilter from "./ProductFilter";
import { useLocation } from "react-router-dom";

export default function ProductGrid({ type, categorySlug, noHeading }) {
  const location = useLocation();
  const allProducts = useSelector(selectAllProducts);
  const products = useProducts(categorySlug, allProducts);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("default");

  // First filter by category
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  // Then sort the filtered products
  const sortedProducts = sortProducts(filteredProducts, selectedSort);

  // Adjust the number of products based on the current route
  const numberOfProductsToShow =
    location.pathname === "/" ? 4 : sortedProducts.length;

  const displayedProducts = sortedProducts.slice(0, numberOfProductsToShow);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      {!noHeading && (
        <h2 className="text-3xl font-serif text-center mb-8">
          Featured Collections
        </h2>
      )}
      {type && (
        <>
          <ProductFilter
            selectedCategory={selectedCategory}
            selectedSort={selectedSort}
            onCategoryChange={setSelectedCategory}
            onSortChange={setSelectedSort}
          />

          <div className="text-gray-600 text-sm mb-4">
            Showing {sortedProducts.length} products
          </div>
        </>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
