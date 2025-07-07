export interface SearchableItem {
  id: number;
  name: string;
  title?: string;
  description?: string;
  tagName?: string;
  price?: string;
  image?: string;
  [key: string]: any;
}

export const fuzzySearch = (
  items: SearchableItem[],
  query: string
): SearchableItem[] => {
  if (!query.trim()) return items;

  const queryLower = query.toLowerCase();
  const searchableFields = ["name", "title", "description", "tagName"];

  return items.filter((item) => {
    return searchableFields.some((field) => {
      const value = item[field];
      if (!value) return false;
      return value.toLowerCase().includes(queryLower);
    });
  });
};

export const weightedSearch = (
  items: SearchableItem[],
  query: string
): SearchableItem[] => {
  if (!query.trim()) return items;

  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(" ").filter((word) => word.length > 0);

  const scoredItems = items.map((item) => {
    let score = 0;
    const searchableFields = [
      { field: "name", weight: 10 },
      { field: "title", weight: 8 },
      { field: "tagName", weight: 6 },
      { field: "description", weight: 3 },
    ];

    searchableFields.forEach(({ field, weight }) => {
      const value = item[field];
      if (!value) return;

      const valueLower = value.toLowerCase();

      if (valueLower === queryLower) {
        score += weight * 10;
      } else if (valueLower.startsWith(queryLower)) {
        score += weight * 8;
      } else if (valueLower.includes(queryLower)) {
        score += weight * 5;
      } else {
        queryWords.forEach((word) => {
          if (valueLower.includes(word)) {
            score += weight * 2;
          }
        });
      }
    });

    return { ...item, _searchScore: score };
  });

  return scoredItems
    .filter((item) => item._searchScore > 0)
    .sort((a, b) => (b._searchScore || 0) - (a._searchScore || 0));
};

export const highlightSearchTerms = (text: string, query: string): string => {
  if (!query.trim() || !text) return text;

  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  const index = textLower.indexOf(queryLower);

  if (index === -1) return text;

  const before = text.substring(0, index);
  const match = text.substring(index, index + query.length);
  const after = text.substring(index + query.length);

  return `${before}<mark class="search-highlight">${match}</mark>${after}`;
};

/**
 * Generates search suggestions based on popular searches
 */
export const generateSearchSuggestions = (
  items: SearchableItem[],
  maxSuggestions: number = 10
): string[] => {
  const suggestions = new Set<string>();

  items.forEach((item) => {
    if (item.name) {
      suggestions.add(item.name.toLowerCase());
    }

    if (item.title) {
      suggestions.add(item.title.toLowerCase());
    }

    if (item.tagName) {
      suggestions.add(item.tagName.toLowerCase());
    }
  });

  return Array.from(suggestions).slice(0, maxSuggestions);
};

/**
 * Debounces a search function
 */
export const debounceSearch = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Saves search query to recent searches
 */
export const saveRecentSearch = (
  query: string,
  maxRecent: number = 10
): void => {
  try {
    const recent = getRecentSearches();
    const updated = [query, ...recent.filter((q) => q !== query)].slice(
      0,
      maxRecent
    );
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save recent search:", error);
  }
};

/**
 * Gets recent searches from localStorage
 */
export const getRecentSearches = (): string[] => {
  try {
    const saved = localStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Failed to get recent searches:", error);
    return [];
  }
};

/**
 * Removes a search query from recent searches
 */
export const removeRecentSearch = (query: string): void => {
  try {
    const recent = getRecentSearches();
    const updated = recent.filter((q) => q !== query);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to remove recent search:", error);
  }
};
