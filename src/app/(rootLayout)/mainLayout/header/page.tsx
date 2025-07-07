import React from "react";
import Link from "next/link";
import AuthStatus from "@/components/AuthStatus/page";

const Header = () => {
  return (
    <header className="w-full bg-white shadow py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/">
          <span className="text-xl font-bold text-blue-700 cursor-pointer">
            Jewellery Shop
          </span>
        </Link>
        <Link href="/products">
          <span className="text-gray-700 hover:text-blue-600 cursor-pointer">
            Products
          </span>
        </Link>
        <Link href="/cart">
          <span className="text-gray-700 hover:text-blue-600 cursor-pointer">
            Cart
          </span>
        </Link>
      </div>
      <AuthStatus />
    </header>
  );
};

export default Header;
