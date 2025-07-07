"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import { useRouter } from "next/navigation";
import { getRecentSearches, removeRecentSearch } from "@/utils/searchUtils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search products...",
  className = "",
  showSuggestions = true,
  autoFocus = false,
}) => {
  const router = useRouter();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchSuggestions,
  } = useSearch();
  const [query, setQuery] = useState(searchQuery);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const saved = getRecentSearches();
    setRecentSearches(saved);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query);
      setSearchQuery(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, onSearch, setSearchQuery]);

  const handleClear = () => {
    setQuery("");
    setSearchQuery("");
    onSearch("");
    setShowDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSearchQuery(suggestion);
    onSearch(suggestion);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
    setShowDropdown(false);
  };

  const handleResultClick = (result: any) => {
    if (result.source === "topBrand" && result.brandId && result.productId) {
      router.push(
        `/topBrandProduct/${result.brandId}/viewProductDetails/${result.productId}`
      );
    } else if (result.source === "bestSelling") {
      router.push(`/home/products/${result.id}`);
    }
    setShowDropdown(false);
    setQuery("");
    setSearchQuery("");
  };

  const handleRemoveRecentSearch = (search: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeRecentSearch(search);
    setRecentSearches(getRecentSearches());
  };

  return (
    <div className={`relative w-full ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full px-4 py-3 pl-12 pr-12 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A0704] focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md search-input-focus"
          aria-label="Search products"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </form>
      {showDropdown && showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto animate-search-dropdown">
          {isSearching ? (
            <div className="p-4 text-center text-gray-600 search-loading">
              <Search className="w-5 h-5 animate-spin mx-auto mb-2" />
              Searching...
            </div>
          ) : query ? (
            <div>
              {searchResults.length > 0 ? (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Search Results
                  </div>
                  {searchResults.slice(0, 5).map((result, index) => (
                    <button
                      key={`${result.source}-${result.id}-${index}`}
                      onClick={() => handleResultClick(result)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 search-suggestion-hover"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={result.image}
                          alt={result.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {result.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {result.title} • ${result.price}
                          </div>
                        </div>
                        <span className="text-xs bg-[#0A0704] text-white px-2 py-1 rounded-full">
                          {result.source === "topBrand"
                            ? "Top Brand"
                            : "Best Selling"}
                        </span>
                      </div>
                    </button>
                  ))}
                  {searchResults.length > 5 && (
                    <div className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleSuggestionClick(query)}
                        className="text-sm text-[#0A0704] hover:underline transition-colors font-medium"
                      >
                        View all {searchResults.length} results
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-600">
                  <div className="animate-search-shake">
                    No products found for "
                    <span className="search-highlight">{query}</span>"
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-2">
              {recentSearches.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-medium text-gray-600 uppercase tracking-wide flex items-center">
                    <Clock className="w-3 h-3 mr-2" />
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-800 hover:bg-gray-50 transition-colors flex items-center justify-between group search-suggestion-hover"
                    >
                      <span className="truncate font-medium">{search}</span>
                      <div
                        onClick={(e) => handleRemoveRecentSearch(search, e)}
                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-700 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <div>
                <div className="px-4 py-2 text-xs font-medium text-gray-600 uppercase tracking-wide flex items-center">
                  <TrendingUp className="w-3 h-3 mr-2" />
                </div>
                {searchSuggestions.slice(0, 5).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-800 hover:bg-gray-50 transition-colors search-suggestion-hover font-medium"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
