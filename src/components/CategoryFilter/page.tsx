'use client';

import React from 'react';

interface Category {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categorySlug: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
      <div className="space-y-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${
            selectedCategory === null
              ? 'bg-[#0A0704] text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All Products
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.slug)}
            className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${
              selectedCategory === category.slug
                ? 'bg-[#0A0704] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{category.name}</span>
              {category.count && (
                <span className="text-xs text-gray-400">({category.count})</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter; 