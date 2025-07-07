"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard/page";
import SearchBar from "@/components/SearchBar/page";
import { Star, Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { ACTION_TYPES } from "@/redux/action/ActionType";
import { RootState } from "@/types/page";
import { WishlistButton } from "@/components/WishlistButton/page";
import Link from "next/link";
import type { Product } from "@/context/ProductContext";

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cartItems = useSelector((state: RootState) => state.listReducer.list);

  useEffect(() => {
    fetch("/assets/data/products.json")
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        const found = data.find((p: Product) => {
          const slug = p.name.toLowerCase().replace(/\s+/g, "-") + "-" + p.id;
          return slug === params.id;
        });
        setProduct(found || null);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load product");
        setLoading(false);
      });
  }, [params]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return [];
    return products.filter(
      (p: Product) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ((p as any).brand &&
          (p as any).brand.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, products]);

  const handleAddToCart = () => {
    if (!product) return;

    const existingCartItem = cartItems?.find(
      (cartItem: any) => cartItem.id === product.id
    );

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: (existingCartItem.quantity ?? 1) + quantity,
      };
      dispatch({
        type: ACTION_TYPES.UPDATE_LIST,
        payload: updatedItem,
      });
    } else {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price.toString(),
        image: product.image,
        quantity: quantity,
        description: product.description,
      };
      dispatch({ type: ACTION_TYPES.ADD_LIST, payload: cartItem });
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-2xl font-bold text-gray-800 mb-4">
          Product Not Found
        </div>
        <Link
          href="/home/products"
          className="px-4 py-2 bg-[#a58c3d] text-white rounded hover:bg-[#5a6d48] flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/home/products"
            className="inline-flex items-center text-[#a58c3d] hover:text-[#5a6d47] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search products..."
          />
          {searchQuery && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Search Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {filteredProducts.length === 0 ? (
                  <div className="text-gray-500">No products found.</div>
                ) : (
                  filteredProducts.map((p: Product) => (
                    <ProductCard
                      key={p.id}
                      id={p.id}
                      name={p.name}
                      price={p.price}
                      image={p.image}
                      rating={(p as any).rating}
                      reviews={(p as any).reviews}
                      slug={
                        p.name.toLowerCase().replace(/\s+/g, "-") + "-" + p.id
                      }
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col lg:flex-row gap-8">
          <div className="flex-shrink-0 w-full lg:w-96 h-96 relative mb-6 lg:mb-0">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <WishlistButton
                  product={{ ...product, price: String(product.price) }}
                />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#a58c3d] text-2xl font-semibold">
                  ${Number(product.price).toFixed(2)}
                </span>
                {product.originalPrice &&
                  Number(product.originalPrice) > Number(product.price) && (
                    <span className="text-gray-400 line-through">
                      ${Number(product.originalPrice).toFixed(2)}
                    </span>
                  )}
                <span className="text-sm text-gray-500">{product.brand}</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-500 font-medium">
                  {product.rating}
                </span>
                <span className="text-gray-500 text-sm">
                  ({product.reviews} reviews)
                </span>
              </div>
              <div className="mb-4">
                <span
                  className={`inline-block px-3 py-1 text-xs rounded-full ${
                    product.inStock
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
                {product.isSale && (
                  <span className="ml-2 inline-block px-3 py-1 text-xs rounded-full bg-pink-100 text-pink-700">
                    On Sale
                  </span>
                )}
                {product.isNew && (
                  <span className="ml-2 inline-block px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                    New Arrival
                  </span>
                )}
              </div>
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Materials</h3>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material) => (
                    <span
                      key={material}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>
              {product.length && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Length</h3>
                  <div className="flex gap-2">
                    {product.length.map((len) => (
                      <button
                        key={len}
                        onClick={() => setSelectedSize(len)}
                        className={`px-4 py-2 border rounded-md text-sm ${
                          selectedSize === len
                            ? "border-[#a58c3d] bg-[#a58c3d] text-white"
                            : "border-gray-300 text-gray-700 hover:border-[#a58c3d]"
                        }`}
                      >
                        {len}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {product.size && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Size</h3>
                  <div className="flex gap-2">
                    {product.size.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-md text-sm ${
                          selectedSize === size
                            ? "border-[#a58c3d] bg-[#a58c3d] text-white"
                            : "border-gray-300 text-gray-700 hover:border-[#a58c3d]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Care Instructions
                </h3>
                <p className="text-gray-600 text-sm">{product.care}</p>
              </div>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full px-6 py-3 bg-[#a58c3d] text-white rounded-md hover:bg-[#5a6d48] font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <div className="flex gap-2">
                <button className="flex-1 px-6 py-3 border border-[#a58c3d] text-[#a58c3d] rounded-md hover:bg-[#a58c3d] hover:text-white font-semibold transition-colors">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
