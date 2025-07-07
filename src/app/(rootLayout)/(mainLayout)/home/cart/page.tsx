"use client";

import React from "react";
import { CartItem } from "@/components/CartItem/page";
import { useDispatch, useSelector } from "react-redux";
import { ACTION_TYPES } from "@/redux/action/ActionType";
import { ShoppingCart, Trash2, ArrowLeft, CreditCard } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  addToCart,
  updateCartItem,
  removeFromCart,
  emptyCart,
} from "@/redux/action/cartActions";
import { toast } from "react-hot-toast";

interface CartProduct {
  id: number;
  image: string;
  name: string;
  description: string;
  quantity: number;
  price: string;
}

interface RootState {
  listReducer: {
    list: CartProduct[];
  };
  cart: {
    items: { product: CartProduct; quantity: number }[];
  };
}

const CartPage = () => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);
  const router = useRouter();

  const updateQuantity = (id: number, delta: number) => {
    const item = items.find((item: any) => item.product.id === id);
    if (!item) {
      toast.error(`Item with id ${id} not found in cart`);
      return;
    }
    const newQuantity = Math.max(1, item.quantity + delta);
    if (newQuantity === item.quantity) {
      toast("Quantity unchanged");
      return;
    }
    dispatch(updateCartItem(id, newQuantity));
    toast.success("Cart updated");
  };

  const removeItem = (id: number) => {
    const itemExists = items.some((item: any) => item.product.id === id);
    if (!itemExists) {
      toast.error(`Item with id ${id} not found in cart`);
      return;
    }
    dispatch(removeFromCart(id));
    toast.success("Item removed from cart");
  };

  const handleEmptyCart = () => {
    dispatch(emptyCart());
    toast.success("Cart emptied");
  };

  const calculateTotal = () => {
    return items.reduce((total: number, item: any) => {
      const price = Number(item.product.price);
      if (isNaN(price)) {
        console.warn(`Invalid price for item ${item.product.id}`);
        return total;
      }
      return total + price * item.quantity;
    }, 0);
  };

  const calculateSubtotal = () => calculateTotal() * 0.9;
  const calculateShipping = () => (calculateTotal() > 100 ? 0 : 10);

  const CartContent = () => {
    if (items.length === 0) {
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
                <ShoppingCart className="mx-auto h-16 w-16 text-[#a58c3d]" />
              </motion.div>
              <h2 className="mt-4 text-2xl font-semibold text-gray-900">
                Your cart is empty
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Looks like you haven&apos;t added any items to your cart yet.
              </p>
              <div className="mt-8">
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#a58c3d] hover:bg-[#5a6d47] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a58c3d]"
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
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h1 className="text-2xl font-semibold text-gray-900">
                Shopping Cart
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                You have {items.length} item{items.length !== 1 && "s"} in your
                cart
              </p>
            </div>

            <div className="divide-y divide-gray-200">
              {items.map((item: any, index: number) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CartItem
                    image={item.product.image}
                    name={item.product.name}
                    description={item.product.name}
                    quantity={item.quantity}
                    price={item.product.price}
                    onIncrease={() => updateQuantity(item.product.id, 1)}
                    onDecrease={() => updateQuantity(item.product.id, -1)}
                    onRemove={() => removeItem(item.product.id)}
                  />
                </motion.div>
              ))}
            </div>

            <div className="px-6 py-5 border-t border-gray-200">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-600">
                    ${calculateSubtotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-600">
                    {calculateShipping() === 0
                      ? "Free"
                      : `$${calculateShipping().toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount (10%)</span>
                  <span className="font-medium text-[#a58c3d]">
                    -${(calculateTotal() - calculateSubtotal()).toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Total
                    </h2>
                    <p className="text-sm text-gray-500">
                      Including all taxes and shipping
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#a58c3d]">
                      ${calculateTotal().toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Link
                    href="/home"
                    className="flex-1 px-6 py-3 text-white border border-gray-300  rounded-md hover:bg-gray-50 font-semibold transition-colors text-center"
                  >
                    Continue Shopping
                  </Link>
                  <button
                    className="flex-1 px-6 py-3 bg-[#a58c3d] text-white rounded-md hover:bg-[#C2992F] font-semibold transition-colors text-center"
                    onClick={() => {
                      router.push("/home/checkout");
                    }}
                  >
                    Proceed to Checkout
                  </button>
                </div>
                {items.length > 0 && (
                  <button
                    onClick={handleEmptyCart}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Empty Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
      <CartContent />
  );
};

export default CartPage;
