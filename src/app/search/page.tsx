"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSearch } from "@/context/SearchContext";
import { motion } from "motion/react";
import { Search, Filter, Grid, List, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";

type SortOption =
  | "relevance"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc";

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchResults = useSearch();
  const isSearching = searchResults.isSearching;
  const results = searchResults.results;

  const query = searchParams.get("q") || "";
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [selectedSource, setSelectedSource] = useState<
    "all" | "topBrand" | "bestSelling"
  >("all");

  useEffect(() => {
    if (query) {
      searchResults.performSearch(query);
    }
  }, [query, searchResults.performSearch]);

  const filteredAndSortedResults = useMemo(() => {
    let filtered = results;

    // Filter by source
    if (selectedSource !== "all") {
      filtered = filtered.filter((result) => result.source === selectedSource);
    }

    // Filter by price range
    filtered = filtered.filter((result) => {
      const price = parseFloat(result.price);
      return price >= priceRange.min && price <= priceRange.max;
    });

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-desc":
          return parseFloat(b.price) - parseFloat(a.price);
        case "relevance":
        default:
          // Keep original order for relevance
          return 0;
      }
    });

    return filtered;
  }, [results, sortBy, priceRange, selectedSource]);

  const handleResultClick = (result: any) => {
    if (result.source === "topBrand" && result.brandId && result.productId) {
      router.push(
        `/topBrandProduct/${result.brandId}/viewProductDetails/${result.productId}`
      );
    } else if (result.source === "bestSelling") {
      router.push(`/home/products/${result.id}`);
    }
  };

  const clearFilters = () => {
    setSortBy("relevance");
    setPriceRange({ min: 0, max: 100 });
    setSelectedSource("all");
  };

  const activeFiltersCount = [
    sortBy !== "relevance",
    priceRange.min !== 0 || priceRange.max !== 100,
    selectedSource !== "all",
  ].filter(Boolean).length;

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            No search query
          </h1>
          <p className="text-gray-600 mb-4">
            Please enter a search term to find products
          </p>
          <Link
            href="/"
            className="inline-flex items-center text-[#0A0704] hover:text-[#5a6d47] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/"
              className="inline-flex items-center text-[#0A0704] hover:text-[#5a6d47] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600">
            {isSearching
              ? "Searching..."
              : `${filteredAndSortedResults.length} products found`}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 text-gray-500 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors relative shadow-sm"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-[#0A0704] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border text-gray-500 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A0704] focus:border-transparent transition-colors"
              >
                <option value="relevance">Relevance</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-asc">Price Low to High</option>
                <option value="price-desc">Price High to Low</option>
              </select>
              <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${
                    viewMode === "grid"
                      ? "bg-[#0A0704] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  title="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${
                    viewMode === "list"
                      ? "bg-[#0A0704] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-80"
          >
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 sticky top-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#0A0704] hover:underline transition-colors"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Source</h3>
                <div className="space-y-2">
                  {[
                    {
                      value: "all",
                      label: "All Sources",
                      count: results.length,
                    },
                    {
                      value: "topBrand",
                      label: "Top Brands",
                      count: results.filter(
                        (r) => r.source === "topBrand"
                      ).length,
                    },
                    {
                      value: "bestSelling",
                      label: "Best Selling",
                      count: results.filter(
                        (r) => r.source === "bestSelling"
                      ).length,
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="source"
                          value={option.value}
                          checked={selectedSource === option.value}
                          onChange={(e) =>
                            setSelectedSource(e.target.value as any)
                          }
                          className="text-[#0A0704] focus:ring-[#0A0704]"
                        />
                        <span className="text-sm text-gray-700 font-medium">
                          {option.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 font-medium">
                        ({option.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Price Range
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-700 mb-1 font-medium">
                        Min Price
                      </label>
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            min: Number(e.target.value),
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A0704] focus:border-transparent transition-colors text-gray-900"
                        min="0"
                        max={priceRange.max}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-700 mb-1 font-medium">
                        Max Price
                      </label>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            max: Number(e.target.value),
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A0704] focus:border-transparent transition-colors text-gray-900"
                        min={priceRange.min}
                        max="1000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1"
          >
            {isSearching ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 animate-spin text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  Searching for products...
                </p>
              </div>
            ) : filteredAndSortedResults.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4 font-medium">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="text-[#0A0704] hover:underline transition-colors font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredAndSortedResults.map((result, index) => (
                  <motion.div
                    key={`${result.source}-${result.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleResultClick(result)}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden search-result-item"
                  >
                    {viewMode === "grid" ? (
                      <div>
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={result.image}
                            alt={result.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs bg-[#0A0704] text-white px-2 py-1 rounded-full">
                              {result.source === "topBrand"
                                ? "Top Brand"
                                : "Best Selling"}
                            </span>
                            {result.offer && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                {result.offer}
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                            {result.name}
                          </h3>
                          <p className="text-sm text-gray-700 mb-2 font-medium">
                            {result.title}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-[#0A0704]">
                              ${result.price}
                            </span>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-700 ml-1 font-medium">
                                4.5
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex p-4">
                        <div className="w-24 h-24 flex-shrink-0">
                          <img
                            src={result.image}
                            alt={result.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs bg-[#0A0704] text-white px-2 py-1 rounded-full">
                              {result.source === "topBrand"
                                ? "Top Brand"
                                : "Best Selling"}
                            </span>
                            {result.offer && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                {result.offer}
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {result.name}
                          </h3>
                          <p className="text-sm text-gray-700 mb-2 font-medium">
                            {result.title}
                          </p>
                          {result.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2 font-medium">
                              {result.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-[#0A0704]">
                              ${result.price}
                            </span>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-700 ml-1 font-medium">
                                4.5
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
