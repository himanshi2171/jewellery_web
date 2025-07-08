import React from "react";
import Image from "next/image";
import { Trash2, ShoppingCart, Heart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface WishlistItemProps {
  image: string;
  name: string;
  description: string;
  price: string;
  onMoveToCart: () => void;
  onRemove: () => void;
  isMovingToCart?: boolean;
  isRemoving?: boolean;
}

export const WishlistItem: React.FC<WishlistItemProps> = ({
  image,
  name,
  description,
  price,
  onMoveToCart,
  onRemove,
  isMovingToCart = false,
  isRemoving = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white rounded-xl shadow-sm p-4 mb-4 transition-opacity ${
        isRemoving ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Image
            src={image}
            alt={name}
            width={80}
            height={80}
            className="rounded-lg object-cover"
          />
          <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
            <Heart className="w-3 h-3" fill="currentColor" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
            {name}
          </h3>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {description}
          </p>
          <div className="text-xl font-bold text-[#0A0704]">
            {price}
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <button
            onClick={onMoveToCart}
            disabled={isMovingToCart || isRemoving}
            className="inline-flex items-center justify-center px-4 py-2 bg-[#0A0704] text-white rounded-lg hover:bg-[#C2992F] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMovingToCart ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
            <span className="ml-2 text-sm">
              {isMovingToCart ? "Adding..." : "Move to Cart"}
            </span>
          </button>

          <button
            onClick={onRemove}
            disabled={isMovingToCart || isRemoving}
            className="inline-flex items-center justify-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRemoving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span className="ml-2 text-sm">
              {isRemoving ? "Removing..." : "Remove"}
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}; 