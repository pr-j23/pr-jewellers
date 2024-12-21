import React from "react";
import { useParams, Link } from "react-router-dom";
import ProductGrid from "../components/products/ProductGrid";
import { ChevronLeft } from "lucide-react";
import { categories } from "../mockData";

export const getCategoryBySlug = (slug) => {
  return categories.find((category) => category.slug === slug);
};
export default function CategoryProducts() {
  const { categorySlug } = useParams();
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return (
      <div className="pt-24 text-center">
        <h2 className="text-2xl font-serif">Category not found</h2>
        <Link to="/category" className="text-purple-600 hover:text-purple-700">
          Return to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <Link
          to="/category"
          className="flex items-center text-purple-600 hover:text-purple-700"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Categories</span>
        </Link>
      </div>
      <h1 className="text-4xl font-serif mb-4">{category.name} Collection</h1>
      <p className="text-gray-600 mb-8">{category.description}</p>
      <ProductGrid categorySlug={categorySlug} noHeading />
    </div>
  );
}
