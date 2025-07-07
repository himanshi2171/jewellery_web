"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Heart,
  ShoppingBag,
  User,
  MapPin,
  Search,
  LogOut,
  Gift,
  BadgePercent,
  ShoppingCart,
  UserCircle,
  LogIn,
  UserPlus,
  Package,
} from "lucide-react";
import Link from "next/link";
import { RootState, AppDispatch } from "@/types/page";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [username, setUsername] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlistReducer.wishlist
  );
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("username");
      if (storedEmail) {
        const namePart = storedEmail.split("@")[0];
        setUsername(namePart);
      }
    }
  }, []);

  if (!mounted) return null;

  const cartItemCount = cartItems.reduce(
    (total: number, item: any) => total + (item.quantity ?? 1),
    0
  );
  const wishlistCount = wishlistItems?.length;

  const handleLogout = () => {
    setShowUserMenu(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("username");
      localStorage.removeItem("loginTime");
      // Remove other auth info if needed
      window.location.href = "/auth/signin";
    }
  };

  const handleProtectedClick = (href: string) => {
    setShowUserMenu(false);
    window.location.href = href;
  };

  // Add a handler for wishlist icon click
  const handleWishlistClick = (e) => {
    if (typeof window !== "undefined" && !localStorage.getItem("username")) {
      e.preventDefault();
      window.location.href = "/auth/signin";
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center gap-4 md:gap-8 min-w-0">
          <div className="flex items-center gap-2 text-xs text-[#8B7C6B]">
            <MapPin className="w-4 h-4" />
          </div>
          <nav className="hidden md:flex gap-4 md:gap-8 items-center text-xs tracking-widest uppercase font-medium text-[#8B7C6B]">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <Link
              href="/home/products/new-collection"
              className="hover:text-black transition-colors"
            >
              New Collection
            </Link>
            <Link href="/gifts" className="hover:text-black transition-colors">
              Gifts
            </Link>
            <Link
              href="/home/contacts"
              className="hover:text-black transition-colors"
            >
              Contact Us
            </Link>
          </nav>
        </div>
        <div className="flex-1 flex justify-center">
          <Link href="/">
            <span className="text-xl sm:text-2xl lg:text-xl font-serif tracking-[0.2em] sm:tracking-[0.5em] lg:tracking-[0.2em] font-normal select-none text-[#181716] uppercase hover:text-[#a58c3d] transition-colors">
              APOLLONIAN
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4 md:gap-6 min-w-0">
          <div className="hidden sm:flex items-center gap-2">
            <input
              type="text"
              placeholder="Search jewelry..."
              className="border-0 border-b border-gray-300 bg-transparent text-[#8B7C6B] placeholder-[#8B7C6B] focus:outline-none focus:border-[#8B7C6B] px-0 py-1 w-20 md:w-24 lg:w-32 text-sm"
              style={{ minWidth: 0 }}
            />
            <Search className="w-4 h-4 text-[#8B7C6B]" />
          </div>

          <Link href="/home/wishlist" className="p-2 relative" onClick={handleWishlistClick}>
            <Heart className="w-5 h-5 text-[#8B7C6B] hover:text-red-500 transition-colors" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link href="/home/cart" className="p-2 relative">
            <ShoppingBag className="w-5 h-5 text-[#8B7C6B] hover:text-[#a58c3d] transition-colors" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#a58c3d] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu((v) => !v)}
              className="p-2 flex items-center gap-2 text-[#8B7C6B] hover:text-[#a58c3d] transition-colors focus:outline-none"
              aria-label="Profile menu"
            >
              <UserCircle className="w-7 h-7" />
              <span className="hidden sm:block text-sm font-medium">
                {username ? username : "Profile"}
              </span>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200 animate-fade-in">
                {username ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100 flex items-center gap-2">
                      <UserCircle className="w-5 h-5 text-[#a58c3d]" />
                      <span className="font-medium">{username}</span>
                    </div>
                    <button
                      onClick={() => handleProtectedClick("/profile")}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <User className="w-4 h-4" /> My Profile
                    </button>
                    <button
                      onClick={() => handleProtectedClick("/orders")}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Package className="w-4 h-4" /> Orders
                    </button>
                    <button
                      onClick={() => handleProtectedClick("/rewards")}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <BadgePercent className="w-4 h-4" /> Rewards
                    </button>
                    <button
                      onClick={() => handleProtectedClick("/gifts")}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Gift className="w-4 h-4" /> Gift Cards
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-2"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleProtectedClick("/auth/signin")}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#a58c3d] hover:bg-gray-100 transition-colors"
                    >
                      <LogIn className="w-4 h-4" /> Login
                    </button>
                    <button
                      onClick={() => handleProtectedClick("/auth/signup")}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#a58c3d] hover:bg-gray-100 transition-colors"
                    >
                      <UserPlus className="w-4 h-4" /> Signup
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}
