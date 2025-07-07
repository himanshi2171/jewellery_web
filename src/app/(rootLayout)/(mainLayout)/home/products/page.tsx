"use client";

import React, { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard/page";
import SearchBar from "@/components/SearchBar/page";
import CategoryFilter from "@/components/CategoryFilter/page";
import PriceFilter from "@/components/PriceFilter/page";
import { Filter, Grid, List, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/context/ProductContext";
import ProductFilterSidebar from "@/components/ProductFilterSidebar";
import Pagination from "@/components/Pagination";

const categories = [
  { id: 1, name: "Necklaces", slug: "necklaces", count: 3 },
  { id: 2, name: "Earrings", slug: "earrings", count: 4 },
  { id: 3, name: "Bracelets", slug: "bracelets", count: 1 },
  { id: 4, name: "Rings", slug: "rings", count: 2 },
];

const brands = [
  "Apollonian",
  "Luxury Collection",
  "Minimalist Collection",
  "Autumn Collection",
];

type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "newest";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 50,
  });
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showInStockOnly, setShowInStockOnly] = useState<boolean>(false);
  const [showSaleOnly, setShowSaleOnly] = useState<boolean>(false);
  const [showNewOnly, setShowNewOnly] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach((product: Product) => {
      if (Array.isArray((product as any).tags)) {
        (product as any).tags.forEach((tag: string) => tags.add(tag));
      }
    });
    return Array.from(tags);
  }, [products]);

  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const showAll = searchParams.get("all") === "true";

  React.useEffect(() => {
    fetch("/assets/data/products.json")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load products");
        setLoading(false);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered: Product[] = products;

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange.min && product.price <= priceRange.max
    );

    if (selectedTags.length > 0) {
      filtered = filtered.filter((product) =>
        selectedTags.some((tag) => product.tags.includes(tag))
      );
    }

    if (showInStockOnly) {
      filtered = filtered.filter((product) => product.inStock);
    }

    if (showSaleOnly) {
      filtered = filtered.filter((product) => product.isSale);
    }

    if (showNewOnly) {
      filtered = filtered.filter((product) => product.isNew);
    }

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    filtered.sort((a: Product, b: Product) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating-desc":
          return b.rating - a.rating;
        case "newest":
          return b.isNew ? 1 : a.isNew ? -1 : 0;
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedBrands,
    priceRange,
    selectedTags,
    showInStockOnly,
    showSaleOnly,
    showNewOnly,
    sortBy,
    category,
  ]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug);
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange({ min, max });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 50 });
    setSelectedTags([]);
    setShowInStockOnly(false);
    setShowSaleOnly(false);
    setShowNewOnly(false);
  };

  const activeFiltersCount = [
    searchQuery,
    selectedCategory,
    selectedBrands.length,
    selectedTags.length,
    showInStockOnly,
    showSaleOnly,
    showNewOnly,
  ].filter(Boolean).length;

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  if (showAll) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-6 md:py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center tracking-tight">
          All Products
        </h1>
        <main className="w-full">
          {products.length === 0 ? (
            <div className="text-center text-gray-500 py-12 animate-fade-in-up">
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  rating={product.rating}
                  reviews={product.reviews}
                  slug={
                    product.name.toLowerCase().replace(/\s+/g, "-") +
                    "-" +
                    product.id
                  }
                  isNew={product.isNew}
                  isSale={product.isSale}
                  inStock={product.inStock}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Our Products
          </h1>
          <p className="text-gray-600">
            Discover our amazing collection of beauty and skincare products
          </p>
        </div>
        Search Bar
        <div className="mb-6">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search products by name..."
            className="w-full max-w-md"
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          Sidebar
          <div className="lg:w-80 w-full mb-6 lg:mb-0">
            <ProductFilterSidebar
              categories={categories.map((c) => c.name)}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              brands={brands}
              selectedBrands={selectedBrands}
              onBrandToggle={handleBrandToggle}
              priceRange={priceRange}
              minPrice={0}
              maxPrice={50}
              onPriceChange={handlePriceChange}
              rating={0} // Add rating state if needed
              onRatingChange={() => {}} // Add handler if needed
              showInStockOnly={showInStockOnly}
              onInStockChange={setShowInStockOnly}
              showSaleOnly={showSaleOnly}
              onSaleChange={setShowSaleOnly}
              showNewOnly={showNewOnly}
              onNewChange={setShowNewOnly}
              tags={allTags}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              onClearFilters={clearFilters}
            />
          </div>
          Products Section
          <div className="flex-1">
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-gray-600">
                  Showing {paginatedProducts.length} of{" "}
                  {filteredProducts.length} products
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#a58c3d] focus:border-transparent transition-colors"
                >
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="price-asc">Price Low to High</option>
                  <option value="price-desc">Price High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
            Products Grid
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="text-[#a58c3d] hover:underline transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}
              >
                {paginatedProducts.map((product: Product) =>
                  product.image ? (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      originalPrice={(product as any).originalPrice}
                      image={product.image}
                      rating={(product as any).rating}
                      reviews={(product as any).reviews}
                      slug={(product as any).slug}
                      isSale={(product as any).isSale}
                      isNew={(product as any).isNew}
                      inStock={(product as any).inStock}
                    />
                  ) : null
                )}
              </div>
            )}
            Pagination
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
