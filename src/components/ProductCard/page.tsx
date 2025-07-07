"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCart,
  Heart,
  AlertCircle,
  Tag,
  Sparkles,
  Ban,
  Image as ImageIcon,
} from "lucide-react";
import { ACTION_TYPES } from "@/redux/action/ActionType";
import { RootState } from "@/types/page";
import { addToCart, updateCartItem } from "@/redux/action/cartActions";
import { Tooltip } from "@/components/Tooltip";
import { useRouter, useSearchParams } from "next/navigation";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  slug: string;
  originalPrice?: number;
  isSale?: boolean;
  isNew?: boolean;
  inStock?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  slug,
  originalPrice,
  isSale = false,
  isNew = false,
  inStock = true,
}) => {
  const dispatch = useDispatch();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authPromptMessage, setAuthPromptMessage] = useState("");
  const [imgError, setImgError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setSelectedCategory(Number(categoryFromUrl));
    }
  }, [searchParams]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    await new Promise((resolve) => setTimeout(resolve, 500));
    const existingCartItem = cartItems.find(
      (cartItem: any) => cartItem.product.id === id
    );
    if (existingCartItem) {
      dispatch(updateCartItem(id, existingCartItem.quantity + 1));
    } else {
      const product = { id, name, price, image, isNew, isSale, inStock };
      dispatch(addToCart(product, 1));
    }
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    const wishlistItem = {
      id,
      name,
      price: price.toString(),
      image,
      description: name,
    };
    dispatch({ type: ACTION_TYPES.ADD_TO_WISHLIST, payload: wishlistItem });
  };

  return (
    <Link href={`/home/products/${product.collectionId}-${product.id}`}>
      <div
        key={`${product.collectionId}-${product.id}`}
        className="relative bg-white/80 border border-gray-100 rounded-2xl shadow-lg p-4 flex flex-col items-center group transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl hover:border-gold overflow-hidden min-h-[420px]"
      >
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {isSale && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-red-400 to-pink-500 text-white text-xs font-bold shadow animate-fade-in">
              <Tag className="w-4 h-4" /> Sale
            </span>
          )}
          {isNew && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white text-xs font-bold shadow animate-fade-in">
              <Sparkles className="w-4 h-4" /> New
            </span>
          )}
        </div>
        {!inStock && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20 rounded-2xl">
            <span className="flex items-center gap-2 text-white text-lg font-bold px-4 py-2 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 shadow-lg">
              <Ban className="w-5 h-5" /> Out of Stock
            </span>
          </div>
        )}
        <div className="w-40 h-40 mb-4 rounded-xl overflow-hidden bg-gray-50 shadow flex items-center justify-center relative">
          {!imgError ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-center text-sm font-semibold p-2 bg-gray-100">
              <ImageIcon className="w-8 h-8 mb-1 opacity-60" />
              {name}
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold mb-2 text-center line-clamp-2 min-h-[2.5rem] text-gray-900 font-serif">
          {name}
        </h3>

        <div className="mb-10 flex items-center gap-2">
          <span className="text-xl font-bold text-gold">
            ${price.toFixed(2)}
          </span>
          {isSale && originalPrice && (
            <>
              <span className="text-base text-red-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
              <span className="text-xs bg-yellow-100 text-yellow-700 rounded-full px-2 py-0.5 ml-1 font-semibold">
                Save {Math.round(100 - (price / originalPrice) * 100)}%
              </span>
            </>
          )}
        </div>
        <div className="absolute bottom-5 right-5 flex flex-col gap-2 z-30 bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-2 border border-gray-100">
          <Tooltip text="Add to wishlist">
            <button
              onClick={handleAddToWishlist}
              className="p-2 rounded-full hover:bg-pink-100 text-gray-500 hover:text-pink-500 transition-all flex items-center justify-center"
              aria-label="Add to wishlist"
            >
              <Heart className="w-5 h-5" />
            </button>
          </Tooltip>
          <Tooltip text={inStock ? "Add to cart" : "Out of stock"}>
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-full hover:bg-green-100 text-gray-500 hover:text-green-600 transition-all flex items-center justify-center"
              aria-label="Add to cart"
              disabled={!inStock}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>
        <Link href={`/products/${slug}`}>
          <span className="inline-block px-6 py-2 bg-gradient-to-r from-[#a58c3d] to-[#bfa06a] text-white rounded-full hover:from-[#4b5c3b] hover:to-[#bfa06a] cursor-pointer text-base font-semibold shadow transition-all mt-2">
            View Details
          </span>
        </Link>
        {showAuthPrompt && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs px-3 py-1 rounded z-30 flex items-center gap-1">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            {authPromptMessage}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
