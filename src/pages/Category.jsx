import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/shared/Button";
import { categories } from "../mockData";

export default function Category() {
  const navigate = useNavigate();
  const handleExplore = (slug) => {
    navigate(`/products/${slug}`);
  };
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif text-center mb-12">Our Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {categories.slice(1).map((category) => {
          return (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="relative h-64">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-white text-center">
                    <h2 className="text-2xl font-serif">{category.name}</h2>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 min-h-12 line-clamp-2">
                  {category.description}
                </p>
                <Button
                  label="Explore Collection"
                  classN="mt-4 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition-colors"
                  onClick={() => handleExplore(category.slug)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
