"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmationPage() {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("orderData");
      if (data) setOrder(JSON.parse(data));
    }
  }, []);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-10">
        <h1 className="text-2xl font-bold mb-4 text-center">No order found</h1>
        <button onClick={() => router.push("/")} className="bg-black text-white px-6 py-2 rounded">Back to Home</button>
      </div>
    );
  }

  const cartItems = order.cartItems || [];
  const subtotal = order.subtotal ?? 0;
  const shipping = order.shipping ?? 0;
  const tax = order.tax ?? 0;
  const total = order.total ?? 0;
  const myInfo = order.myInfo || { name: "", email: "", phone: "" };
  const shippingInfo = order.shippingInfo || { address: "", city: "", state: "", zip: "" };
  const billing = order.billing || { card: "", expiry: "", cvv: "", address: "" };
  const delivery = order.delivery || "shipment";

  // Mask card number for display
  const maskedCard = billing.card ? `**** **** **** ${billing.card.slice(-4)}` : "**** **** **** 1111";

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-10 px-2 bg-[#fafafa]">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">Order placed!</h1>
      <p className="text-base md:text-lg text-gray-600 mb-8 text-center">A copy of your receipt has been sent to your email.</p>
      <div className="w-full max-w-2xl bg-white border rounded mb-8 shadow-sm">
        <div className="border-b px-8 py-3 bg-[#fcfcfc]">
          <span className="font-medium text-sm">Order Summary</span>
        </div>
        <div className="px-8 py-4">
          <ul className="divide-y divide-gray-100">
            {cartItems.length > 0 ? cartItems.map((item: any, idx: number) => (
              <li key={idx} className="flex justify-between items-center py-2">
                <span className="text-sm">{item.product?.name || "Item"} <span className="text-xs text-gray-500">x{item.quantity}</span></span>
                <span className="text-sm font-medium">${(item.product?.price * item.quantity).toFixed(2)}</span>
              </li>
            )) : (
              <li className="py-2 text-gray-500">No items found</li>
            )}
          </ul>
          <div className="mt-4 text-sm">
            <div className="flex justify-between mb-1"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between mb-1"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
            <div className="flex justify-between mb-1"><span>Sales Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold border-t pt-2 mt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 px-8 py-5 text-[15px] bg-white border-t">
          <div className="space-y-2">
            <div><span className="font-semibold">Email address:</span> <span className="text-gray-700">{myInfo.email}</span></div>
            <div><span className="font-semibold">Phone number:</span> <span className="text-gray-700">{myInfo.phone}</span></div>
            <div><span className="font-semibold">Delivery Method:</span> <span className="text-gray-700 capitalize">{delivery}</span></div>
            <div><span className="font-semibold">Shipping Address:</span> <span className="text-gray-700">{delivery === "shipment"
              ? `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zip}`
              : "Pickup at MARIGOLD MALL, 13 Greenleaf Ave., New York, NY 12345"}</span></div>
          </div>
          <div className="space-y-2 md:pl-8 mt-4 md:mt-0">
            <div><span className="font-semibold">Paid With:</span> <span className="text-gray-700">{maskedCard}</span></div>
            <div><span className="font-semibold">Exp. Date:</span> <span className="text-gray-700">{billing.expiry || "--/--"}</span></div>
            <div><span className="font-semibold">Billing Address:</span> <span className="text-gray-700">{billing.address}</span></div>
          </div>
        </div>
      </div>
      <button
        onClick={() => router.push("/")}
        className="bg-black text-white px-7 py-2 rounded shadow text-sm font-medium mt-2"
      >
        BACK TO SHOPPING
      </button>
    </div>
  );
} 