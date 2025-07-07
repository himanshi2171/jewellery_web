"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ACTION_TYPES } from "@/redux/action/ActionType";
import { Heart, ArrowLeft, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WishlistItem } from "@/components/WishlistItem/page";
import { useRouter } from "next/navigation";
import { RootState, WishlistProduct } from "@/types/page";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute/page";
import {
  addToWishlist,
  removeFromWishlist,
  moveToCart as moveToCartAction,
  emptyWishlist,
} from "@/redux/action/wishlistActions";
import { addToCart } from "@/redux/action/cartActions";
import { toast } from "react-hot-toast";

const Wishlist = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlistReducer.wishlist
  );
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [movingItems, setMovingItems] = useState<Set<number>>(new Set());
  const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());
  const [isClearing, setIsClearing] = useState(false);

  const moveToCart = async (item: WishlistProduct) => {
    setMovingItems((prev) => new Set(prev).add(item.id));
    await new Promise((resolve) => setTimeout(resolve, 500));
    const existingCartItem = cartItems.find(
      (cartItem: any) => cartItem.product.id === item.id
    );
    if (existingCartItem) {
      dispatch(addToCart(item, 1));
    } else {
      dispatch(addToCart(item, 1));
    }
    dispatch(moveToCartAction(item));
    setMovingItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(item.id);
      return newSet;
    });
  };

  const removeFromWishlistHandler = async (id: number) => {
    setRemovingItems((prev) => new Set(prev).add(id));
    await new Promise((resolve) => setTimeout(resolve, 300));
    dispatch(removeFromWishlist(id));
    setRemovingItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const clearWishlist = async () => {
    if (window.confirm("Are you sure you want to clear your wishlist?")) {
      setIsClearing(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        dispatch(emptyWishlist());
        toast.success("Wishlist cleared");
      } catch (error) {
        toast.error("Failed to clear wishlist. Please try again.");
      } finally {
        setIsClearing(false);
      }
    }
  };

  const moveAllToCart = async () => {
    if (wishlistItems.length === 0) return;
    setIsClearing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      wishlistItems.forEach((item) => {
        dispatch(addToCart(item, 1));
        dispatch(moveToCartAction(item));
      });
      toast.success("All wishlist items moved to cart");
      setIsClearing(false);
      router.push("/home/cart");
    } catch (error) {
      toast.error("Failed to move all items to cart. Please try again.");
      setIsClearing(false);
    }
  };

  const WishlistContent = () => {
    if (wishlistItems.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Heart className="mx-auto h-16 w-16 text-red-500" />
              </motion.div>
              <h2 className="mt-4 text-2xl font-semibold text-gray-900">
                Your wishlist is empty
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Start adding items to your wishlist to save them for later.
              </p>
              <div className="mt-8 text-white">
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm  bg-[#0A0704] hover:bg-[#5a6d47] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A0704]"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    My Wishlist
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    You have {wishlistItems.length} item
                    {wishlistItems.length !== 1 && "s"} in your wishlist
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={moveAllToCart}
                    disabled={isClearing}
                    className="inline-flex items-center px-4 py-2 bg-[#0A0704] text-white rounded-md hover:bg-[#5a6d47] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isClearing ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <ShoppingCart className="w-4 h-4 mr-2" />
                    )}
                    Move All to Cart
                  </button>
                  <button
                    onClick={clearWishlist}
                    disabled={isClearing}
                    className="inline-flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isClearing ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              <AnimatePresence>
                {wishlistItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <WishlistItem
                      image={item.image ?? ""}
                      name={item.name}
                      description={item.description ?? ""}
                      price={item.price ?? ""}
                      onMoveToCart={() => moveToCart(item)}
                      onRemove={() => removeFromWishlistHandler(item.id)}
                      isMovingToCart={movingItems.has(item.id)}
                      isRemoving={removingItems.has(item.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <ProtectedRoute>
      <WishlistContent />
    </ProtectedRoute>
  );
};

export default Wishlist;
