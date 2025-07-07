import React from "react";

interface ProductFilterSidebarProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  brands: string[];
  selectedBrands: string[];
  onBrandToggle: (brand: string) => void;
  priceRange: { min: number; max: number };
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  rating: number;
  onRatingChange: (rating: number) => void;
  showInStockOnly: boolean;
  onInStockChange: (checked: boolean) => void;
  showSaleOnly: boolean;
  onSaleChange: (checked: boolean) => void;
  showNewOnly: boolean;
  onNewChange: (checked: boolean) => void;
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
}

const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  brands,
  selectedBrands,
  onBrandToggle,
  priceRange,
  minPrice,
  maxPrice,
  onPriceChange,
  rating,
  onRatingChange,
  showInStockOnly,
  onInStockChange,
  showSaleOnly,
  onSaleChange,
  showNewOnly,
  onNewChange,
  tags,
  selectedTags,
  onTagToggle,
  onClearFilters,
}) => {
  return (
    <aside className="w-full max-w-xs bg-white rounded-lg shadow-sm p-6 space-y-8 sticky top-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-[#a58c3d] hover:underline transition-colors"
        >
          Clear all
        </button>
      </div>
     Category
      <div>
        <h4 className="font-semibold text-gray-800 mb-2">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat}
                onChange={() => onCategoryChange(cat)}
                className="text-[#a58c3d] focus:ring-[#a58c3d]"
              />
              <span className="text-sm text-gray-700">{cat}</span>
            </label>
          ))}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === null}
              onChange={() => onCategoryChange(null)}
              className="text-[#a58c3d] focus:ring-[#a58c3d]"
            />
            <span className="text-sm text-gray-700">All</span>
          </label>
        </div>
      </div>
     Brand
      <div>
        <h4 className="font-semibold text-gray-800 mb-2">Brand</h4>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => onBrandToggle(brand)}
                className="text-[#a58c3d] focus:ring-[#a58c3d]"
              />
              <span className="text-sm text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </div>
     Price
      <div>
        <h4 className="font-semibold text-gray-800 mb-2">Price</h4>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="number"
            value={priceRange.min}
            min={minPrice}
            max={priceRange.max}
            onChange={(e) => onPriceChange(Number(e.target.value), priceRange.max)}
            className="w-20 px-2 py-1 border border-gray-300 rounded"
            placeholder="Min"
          />
          <span>-</span>
          <input
            type="number"
            value={priceRange.max}
            min={priceRange.min}
            max={maxPrice}
            onChange={(e) => onPriceChange(priceRange.min, Number(e.target.value))}
            className="w-20 px-2 py-1 border border-gray-300 rounded"
            placeholder="Max"
          />
        </div>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={priceRange.min}
          onChange={(e) => onPriceChange(Number(e.target.value), priceRange.max)}
          className="w-full mb-1"
        />
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={priceRange.max}
          onChange={(e) => onPriceChange(priceRange.min, Number(e.target.value))}
          className="w-full"
        />
      </div>
     Rating
      <div>
        <h4 className="font-semibold text-gray-800 mb-2">Rating</h4>
        <div className="flex gap-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              type="button"
              className={`px-2 py-1 rounded border ${rating === star ? "bg-[#a58c3d] text-white" : "bg-white text-gray-700"}`}
              onClick={() => onRatingChange(star)}
            >
              {star}★
            </button>
          ))}
          <button
            type="button"
            className={`px-2 py-1 rounded border ${rating === 0 ? "bg-[#a58c3d] text-white" : "bg-white text-gray-700"}`}
            onClick={() => onRatingChange(0)}
          >
            All
          </button>
        </div>
      </div>
     Availability, Sale, New
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showInStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="text-[#a58c3d] focus:ring-[#a58c3d]"
          />
          <span className="text-sm text-gray-700">In Stock Only</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showSaleOnly}
            onChange={(e) => onSaleChange(e.target.checked)}
            className="text-[#a58c3d] focus:ring-[#a58c3d]"
          />
          <span className="text-sm text-gray-700">On Sale</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showNewOnly}
            onChange={(e) => onNewChange(e.target.checked)}
            className="text-[#a58c3d] focus:ring-[#a58c3d]"
          />
          <span className="text-sm text-gray-700">New Arrivals</span>
        </label>
      </div>
     Tags
      <div>
        <h4 className="font-semibold text-gray-800 mb-2">Tags</h4>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`px-3 py-1 rounded-full border ${selectedTags.includes(tag) ? "bg-[#a58c3d] text-white" : "bg-white text-gray-700"}`}
              onClick={() => onTagToggle(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ProductFilterSidebar; 