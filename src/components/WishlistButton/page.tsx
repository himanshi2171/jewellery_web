"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ACTION_TYPES } from "@/redux/action/ActionType";
import { Heart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { addToWishlist, removeFromWishlist } from "@/redux/action/wishlistActions";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
  product: {
    id: number;
    name: string;
    image: string;
    price: string;
    description?: string;
    [key: string]: unknown;
  };
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

interface RootState {
  wishlistReducer: {
    wishlist: {
      id: number;
      name: string;
      image: string;
      price: string;
      description?: string;
    }[];
  };
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  product,
  size = "md",
  className = "",
  showText = false,
}) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlistReducer.wishlist
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (
      !product ||
      typeof product.id === "undefined" ||
      product.id === null ||
      !Array.isArray(wishlistItems)
    ) {
      setIsInWishlist(false);
      return;
    }
    setIsInWishlist(wishlistItems.some((item) => item?.id === product?.id));
  }, [wishlistItems, product]);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleToggleWishlist = async () => {
    // Check if user is signed in
    if (typeof window !== "undefined" && !localStorage.getItem("username")) {
      router.push("/auth/signin");
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (isInWishlist) {
        dispatch(removeFromWishlist(product.id));
        toast.success("Removed from wishlist");
      } else {
        dispatch(addToWishlist(product));
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleToggleWishlist}
      disabled={isLoading}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      className={`
    ${sizeClasses[size]} 
    rounded-full 
    flex items-center justify-center 
    transition-all duration-200 
    disabled:opacity-50 disabled:cursor-not-allowed
    bg-white/90 backdrop-blur-sm
    ${isInWishlist ? "text-red-500" : "text-gray-500 hover:text-red-500"}
    shadow-lg hover:shadow-xl
    ${className}
  `}
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isLoading ? (
        <Loader2 className={`${iconSizes[size]} animate-spin`} />
      ) : (
        <Heart
          className={`${iconSizes[size]} ${isInWishlist ? "fill-current" : ""}`}
        />
      )}
      {showText && (
        <span className="ml-2 text-sm font-medium">
          {isInWishlist ? "Saved" : "Save"}
        </span>
      )}
    </motion.button>
  );
};
