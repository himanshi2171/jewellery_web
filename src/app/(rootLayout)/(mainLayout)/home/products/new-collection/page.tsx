"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, Grid, List } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { WishlistButton } from "@/components/WishlistButton/page";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/types/page";
import { addToCart } from "@/redux/action/cartActions";
import { fetchProductByTitle, listAction } from "@/redux/action/listAction";

function flattenCollections(collections: any) {
  const products = [];
  for (const collection of collections) {
    if (Array.isArray(collection.products)) {
      for (const product of collection.products) {
        products.push({
          ...product,
          collectionId: collection.id,
          collectionTitle: collection.title,
        });
      }
    }
  }
  return products;
}

export default function NewCollectionPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("category");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [sortBy, setSortBy] = useState("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<any[]>([]);
  const [sideBarProduct, setSideBarProduct] = useState<any[]>([]);

  useEffect(() => {
    dispatch(
      listAction({
        onSuccess: (res) => {
          if (res.status === 200 && Array.isArray(res.data)) {
            setSideBarProduct(flattenCollections(res.data));
          }
        },
        onFailure: (error) => {
          console.log("Failure!", error);
        },
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (query) {
      apiCalling(query);
    }
  }, [query, dispatch]);

  const apiCalling = (query: string) => {
    dispatch(
      fetchProductByTitle({
        title: query,
        onSuccess: (res) => {
          if (res.status === 200) {
            setProducts(flattenCollections([res.data]));
          }
        },
        onFailure: (error) => {
          console.log("Search failed", error);
        },
      })
    );
  };

  const categories = useMemo(() => {
    const map = new Map();
    sideBarProduct.forEach((p: any) => {
      if (p.collectionId && p.collectionTitle) {
        map.set(p.collectionId, {
          id: p.collectionId,
          name: p.collectionTitle,
          slug: p.collectionTitle,
        });
      }
    });
    return Array.from(map.values());
  }, [sideBarProduct]);

  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p: any) => p.brand && set.add(p.brand));
    return Array.from(set) as string[];
  }, [products]);
  const tags = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p: any) =>
      (p.tags || []).forEach((tag: string) => set.add(tag))
    );
    return Array.from(set) as string[];
  }, [products]);
  const priceValues = useMemo(
    () =>
      products
        .map((p: any) => Number(p.price))
        .filter((v: number) => !isNaN(v)),
    [products]
  );
  const minPrice = priceValues.length > 0 ? Math.min(...priceValues) : 0;
  const maxPrice = priceValues.length > 0 ? Math.max(...priceValues) : 0;

  useEffect(() => {
    // dispatch(checkUserSession());
  }, [dispatch]);

  useEffect(() => {
    setPriceRange({ min: minPrice, max: maxPrice });
  }, [minPrice, maxPrice]);

  useEffect(() => {
    if (query) {
      const found = categories.find(
        (cat: any) =>
          cat.slug.toLowerCase() === query.toLowerCase() ||
          cat.name.toLowerCase() === query.toLowerCase()
      );
      if (found) {
        setSelectedCategory(found.id);
      }
    }
  }, [query, categories]);

  let filtered = sideBarProduct.filter((p: any) => {
    const matchesCategory = selectedCategory
      ? p.collectionId === selectedCategory
      : true;
    const matchesPrice =
      Number(p.price) >= priceRange.min && Number(p.price) <= priceRange.max;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description &&
        p.description.toLowerCase().includes(search.toLowerCase()));
    const matchesBrand = selectedBrands.length
      ? selectedBrands.includes(p.brand)
      : true;
    const matchesTags = selectedTags.length
      ? selectedTags.some((tag) => (p.tags || []).includes(tag))
      : true;
    const matchesStock = showInStockOnly ? p.stock > 0 : true;
    const matchesSale = showSaleOnly ? p.isSale : true;
    const matchesNew = showNewOnly ? p.isNew : true;
    return (
      matchesCategory &&
      matchesPrice &&
      matchesSearch &&
      matchesBrand &&
      matchesTags &&
      matchesStock &&
      matchesSale &&
      matchesNew
    );
  });

  // Sorting
  filtered = filtered.sort((a: any, b: any) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "price-asc":
        return Number(a.price) - Number(b.price);
      case "price-desc":
        return Number(b.price) - Number(a.price);
      default:
        return 0;
    }
  });

  const handleAddToCart = (
    e: any,
    product: {
      id: number;
      name: string;
      price: string;
      image: string;
      title?: string;
      offer?: string;
      stock?: number;
      quantity?: string[];
      tagName?: string;
      description?: string;
    }
  ) => {
    e.preventDefault();
    dispatch(addToCart(product, 1));
    router.push("/home/cart");
  };

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-1">Our Products</h1>
        <p className="text-gray-600 mb-6">
          Discover our amazing collection of beauty and skincare products
        </p>
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 bg-white rounded-xl shadow p-6 flex-shrink-0">
            <div className="mb-6">
              <span className="block font-semibold mb-2">Categories</span>
              <div className="flex flex-col gap-1">
                <button
                  className={`text-left px-3 py-2 rounded-xl ${
                    selectedCategory === null
                      ? "bg-yellow-100 text-[#a58c3d]"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setSelectedCategory(null)}
                >
                  All Products
                </button>
                {categories.map((cat: any) => (
                  <button
                    key={cat.id}
                    className={`text-left px-3 py-2 rounded-xl ${
                      selectedCategory === cat.id
                        ? "bg-yellow-100 text-[#a58c3d]"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <span className="block font-semibold mb-2">Price Range</span>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="number"
                  min={minPrice}
                  max={priceRange.max}
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((pr) => ({
                      ...pr,
                      min: Number(e.target.value),
                    }))
                  }
                  className="w-16 px-2 py-1 border rounded text-base"
                />
                <span>-</span>
                <input
                  type="number"
                  min={priceRange.min}
                  max={maxPrice}
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((pr) => ({
                      ...pr,
                      max: Number(e.target.value),
                    }))
                  }
                  className="w-16 px-2 py-1 border rounded text-base"
                />
              </div>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange((pr) => ({
                    ...pr,
                    max: Number(e.target.value),
                  }))
                }
                className="w-full accent-[#a58c3d]"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>${minPrice}</span>
                <span>${maxPrice}</span>
              </div>
            </div>
            {brands.length > 0 && (
              <div className="mb-6">
                <span className="block font-semibold mb-2">Brands</span>
                <div className="flex flex-col gap-1 max-h-24 overflow-y-auto">
                  {brands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-2 text-base cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() =>
                          setSelectedBrands((prev) =>
                            prev.includes(brand)
                              ? prev.filter((b) => b !== brand)
                              : [...prev, brand]
                          )
                        }
                        className="accent-[#a58c3d]"
                      />
                      {brand}
                    </label>
                  ))}
                </div>
              </div>
            )}
            {tags.length > 0 && (
              <div className="mb-6">
                <span className="block font-semibold mb-2">Tags</span>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      className={`px-3 py-1 rounded-full text-xs border ${
                        selectedTags.includes(tag)
                          ? "bg-yellow-100 text-[#a58c3d] border-[#a58c3d]"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                      onClick={() =>
                        setSelectedTags((prev) =>
                          prev.includes(tag)
                            ? prev.filter((t) => t !== tag)
                            : [...prev, tag]
                        )
                      }
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="mb-2">
              <span className="block font-semibold mb-2">Quick Filters</span>
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-2 text-base cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInStockOnly}
                    onChange={() => setShowInStockOnly((v) => !v)}
                    className="accent-[#a58c3d]"
                  />
                  In Stock Only
                </label>
                <label className="flex items-center gap-2 text-base cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSaleOnly}
                    onChange={() => setShowSaleOnly((v) => !v)}
                    className="accent-[#a58c3d]"
                  />
                  On Sale
                </label>
                <label className="flex items-center gap-2 text-base cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showNewOnly}
                    onChange={() => setShowNewOnly((v) => !v)}
                    className="accent-[#a58c3d]"
                  />
                  New Arrivals
                </label>
              </div>
            </div>
          </aside>
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products, brands, or tags..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a58c3d] focus:border-transparent bg-white text-base"
                  aria-label="Search products"
                />
              </div>
              <div className="flex gap-2 ml-auto">
                <button
                  className={`p-2 rounded-xl ${
                    viewMode === "grid"
                      ? "bg-[#a58c3d] text-white"
                      : "bg-white text-gray-500"
                  }`}
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  className={`p-2 rounded-xl ${
                    viewMode === "list"
                      ? "bg-[#a58c3d] text-white"
                      : "bg-white text-gray-500"
                  }`}
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              <div className="ml-2">
                <span className="text-base text-gray-600 mr-1">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#a58c3d] focus:border-transparent transition-colors bg-white"
                >
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="price-asc">Price Low to High</option>
                  <option value="price-desc">Price High to Low</option>
                </select>
              </div>
            </div>
            <div className="mb-4 text-gray-600 text-base font-light">
              Showing {filtered.length} of {sideBarProduct.length} products
            </div>
            {filtered.length === 0 ? (
              <div className="text-center text-gray-500 py-12 animate-fade-in-up">
                No products found.
              </div>
            ) : (
              <div
                className={`grid gap-8 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                } animate-fade-in-up`}
              >
                {filtered.map((product: any) => (
                  <div
                    key={`${product.collectionId}-${product.id}`}
                    className="bg-white rounded-xl shadow p-4 flex flex-col relative"
                    onClick={() => {
                      router.push(
                        `new-collection/ViewProductDetails/${product.id}`
                      );
                    }}
                  >
                    <div className="absolute top-2 left-2 flex gap-1">
                      {product.isSale && (
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
                          Sale
                        </span>
                      )}
                      {product.isNew && (
                        <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded">
                          New
                        </span>
                      )}
                    </div>
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-xl text-white font-bold text-lg">
                        Out of Stock
                      </div>
                    )}
                    <div
                      className="absolute top-2 right-2 z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <WishlistButton
                        product={product}
                        size="sm"
                        className="bg-white/90"
                      />
                    </div>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-80 object-fill rounded-lg mb-3"
                    />
                    <div className="flex-1">
                      <h2 className="font-semibold text-lg mb-1">
                        {product.name}
                      </h2>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-yellow-500 text-sm">★</span>
                        <span className="text-sm font-medium">
                          {product.rating || "4.5"}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          ({product.reviews || "100"})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-bold text-[#a58c3d]">
                          ${product.price}
                        </span>
                        {product.oldPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ${product.oldPrice}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {product.description}
                      </div>
                    </div>
                    <button
                      className="mt-2 w-full py-2 rounded-xl bg-[#a58c3d] text-white font-bold text-base shadow hover:bg-[#C2992F] transition disabled:opacity-50"
                      disabled={product.stock === 0}
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      {product.stock === 0 ? "Out of Stock" : "Add to Bag"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
