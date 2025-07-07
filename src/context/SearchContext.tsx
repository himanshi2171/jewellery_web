"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect
} from "react";
import products from "@/data/products.json";
import {
  weightedSearch,
  generateSearchSuggestions,
  saveRecentSearch,
} from "@/utils/searchUtils";
import { useSearchParams } from "next/navigation";

interface SearchResult {
  id: number;
  name: string;
  price: string;
  title: string;
  image: string;
  offer?: string;
  quantity?: string[];
  stock?: number;
  tagName?: string;
  description?: string;
  source?: string;
  brandId?: number;
  productId?: number;
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  isSearching: boolean;
  performSearch: (query: string) => void;
  clearSearch: () => void;
  searchSuggestions: string[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allProducts = useMemo(() => {
    return products.flatMap((collection: any) =>
      (collection.data || []).map((product: any) => ({
        ...product,
        collectionId: collection.id,
        collectionTitle: collection.title,
      }))
    );
  }, []);

  const searchSuggestions = useMemo(() => {
    return generateSearchSuggestions(allProducts, 10);
  }, [allProducts]);

  const performSearch = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);

      setTimeout(() => {
        const results = weightedSearch(allProducts, query);
        const cleanResults = results
          .slice(0, 20)
          .map(({ _searchScore, ...result }) => result);

        const seen = new Set();
        const dedupedResults = cleanResults.filter((item) => {
          const key =
            (item.name?.toLowerCase() || "") +
            "|" +
            (item.title?.toLowerCase() || "");
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        setSearchResults(dedupedResults as SearchResult[]);
        setIsSearching(false);

        saveRecentSearch(query);
      }, 300);
    },
    [allProducts]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
  }, []);

  const searchParams = useSearchParams();
  useEffect(() => {
    const category = searchParams.get("category");
    if (category) setSelectedCategory(category);
  }, [searchParams]);

  const value: SearchContextType = {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    performSearch,
    clearSearch,
    searchSuggestions,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};
