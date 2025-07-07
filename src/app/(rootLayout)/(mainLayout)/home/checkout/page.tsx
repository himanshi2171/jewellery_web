"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  addressFindByUser,
  addressStoreByUser,
} from "@/redux/action/userAction";

type Address = {
  label: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

export default function CheckoutPage() {
  // Redux cart state
  const cartItems = useSelector((state: any) => state.cart.items);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum: number, item: any) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 4.5 : 0;
  const tax = subtotal > 0 ? 5.0 : 0;
  const total = subtotal + shipping + tax;

  // Form state
  const [myInfo, setMyInfo] = useState({
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [delivery, setDelivery] = useState("shipment");
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [billing, setBilling] = useState({
    name: "",
    card: "",
    expiry: "",
    cvv: "",
    zip: "",
    address: "",
  });
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();
  const dispatch = useDispatch();
  let userID: any;
  const userData = localStorage.getItem("userData");
  if (userData) {
    userID = JSON.parse(userData)?.id;
  }

  // Demo: stored addresses
  const [storedAddresses, setStoredAddresses] = useState<Address[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    if (showAddressModal) {
      dispatch(
        addressFindByUser({
          userID,
          onSuccess: (res) => {
            console.log(res);
            if (res.status === 200 && Array.isArray(res.data)) {
              setStoredAddresses(res.data);
            }
          },
          onFailure: () => {
            console.log("Failure!");
          },
        })
      );
    }
  }, [showAddressModal]);

  // Autofill shipping with my info
  const autofillShipping = () => {
    setShippingInfo({
      address: myInfo.address,
      city: myInfo.city,
      state: myInfo.state,
      zip: myInfo.zip,
    });
  };

  // Autofill billing with shipping info
  React.useEffect(() => {
    if (sameAsShipping) {
      setBilling((b) => ({
        ...b,
        address: shippingInfo.address,
        zip: shippingInfo.zip,
      }));
    }
  }, [sameAsShipping, shippingInfo]);

  // Validation
  const validate = () => {
    const newErrors: any = {};
    if (!myInfo.email) newErrors.email = "Required";
    if (!myInfo.phone) newErrors.phone = "Required";
    if (!myInfo.address) newErrors.myAddress = "Required";
    if (!myInfo.city) newErrors.myCity = "Required";
    if (!myInfo.state) newErrors.myState = "Required";
    if (!myInfo.zip) newErrors.myZip = "Required";
    if (delivery === "shipment") {
      if (!shippingInfo.address) newErrors.shippingAddress = "Required";
      if (!shippingInfo.city) newErrors.shippingCity = "Required";
      if (!shippingInfo.state) newErrors.shippingState = "Required";
      if (!shippingInfo.zip) newErrors.shippingZip = "Required";
    }
    if (!billing.name) newErrors.billingName = "Required";
    if (!billing.card) newErrors.billingCard = "Required";
    if (!billing.expiry) newErrors.billingExpiry = "Required";
    if (!billing.cvv) newErrors.billingCVV = "Required";
    if (!billing.zip) newErrors.billingZip = "Required";
    if (!billing.address) newErrors.billingAddress = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // if (!validate()) return;
    const orderData = {
      cartItems,
      myInfo,
      shippingInfo,
      billing,
      delivery,
      total,
      subtotal,
      shipping,
      tax,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("orderData", JSON.stringify(orderData));
    }
    dispatch(
      addressStoreByUser({
        formData: {
          userID,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zip: shippingInfo.zip,
        },
        onSuccess: (res) => {
          if (res.status === 200) {
            setStoredAddresses(res.data);
            router.push("/home/checkout/confirmation");
          }
        },
        onFailure: () => {
          console.log("Failure!");
        },
      })
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto py-10 px-2 md:px-6">
      <form className="flex-1 space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">My Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border p-2 rounded col-span-1"
              placeholder="Email address"
              value={myInfo.email}
              onChange={(e) => setMyInfo({ ...myInfo, email: e.target.value })}
              type="email"
              required
            />
            <input
              className="border p-2 rounded col-span-1"
              placeholder="Phone Number"
              value={myInfo.phone}
              onChange={(e) => setMyInfo({ ...myInfo, phone: e.target.value })}
              required
            />
          </div>
        </div>
        {/* Delivery Method */}
        <div>
          <h2 className="text-lg font-semibold mb-2">
            How would you like to receive your order?
          </h2>
          <div className="flex gap-6 items-center">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={delivery === "shipment"}
                onChange={() => setDelivery("shipment")}
              />
              By shipment
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={delivery === "inperson"}
                onChange={() => setDelivery("inperson")}
              />
              In person
            </label>
          </div>
        </div>
        {/* Shipping Details or Pickup Location */}
        {delivery === "shipment" && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Shipping Details</h2>
              <button
                type="button"
                className="text-xs underline text-gray-500"
                onClick={() => setShowAddressModal(true)}
              >
                Choose a different location
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="border p-2 rounded col-span-2"
                placeholder="Shipping address"
                value={shippingInfo.address}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, address: e.target.value })
                }
                required
              />
              <input
                className="border p-2 rounded"
                placeholder="City"
                value={shippingInfo.city}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, city: e.target.value })
                }
                required
              />
              <input
                className="border p-2 rounded"
                placeholder="State"
                value={shippingInfo.state}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, state: e.target.value })
                }
                required
              />
              <input
                className="border p-2 rounded"
                placeholder="ZIP Code"
                value={shippingInfo.zip}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, zip: e.target.value })
                }
                required
              />
            </div>
            {/* Address Modal */}
            {showAddressModal && (
              <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                  <button
                    className="absolute top-2 right-3 text-gray-400 hover:text-black text-xl"
                    onClick={() => setShowAddressModal(false)}
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <h3 className="text-lg font-semibold mb-4">Select Address</h3>
                  <ul className="flex flex-col gap-1 mb-4">
                    {storedAddresses.map((addr, idx) => (
                      <li
                        key={idx}
                        className={
                          "px-3 py-2 rounded border cursor-pointer text-sm transition-colors bg-white-200 text-black hover:bg-gray-200 hover:text-black"
                        }
                        onClick={() => {
                          setShippingInfo({
                            address: addr.address,
                            city: addr.city,
                            state: addr.state,
                            zip: addr.zip,
                          });
                          setShowAddressModal(false);
                        }}
                      >
                        <div>
                          <div className="font-semibold">{addr?.label}</div>
                          <div>
                            <b>address:</b>
                            {addr?.address}
                          </div>
                          <div>
                            <b>city:</b>
                            {addr?.city}
                          </div>
                          <div>
                            <b>state:</b>
                            {addr?.state}
                          </div>
                          <div>
                            <b>zip:</b>
                            {addr?.zip}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
        {delivery === "inperson" && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2 border-b pb-2">
              <h2 className="text-lg font-semibold">Pickup Location</h2>
              <button type="button" className="text-xs underline text-gray-500">
                Choose a different location
              </button>
            </div>
            <div className="mb-2">
              <div className="font-semibold">MARIGOLD MALL</div>
              <div>
                13 Greenleaf Ave.
                <br />
                New York, NY 12345
              </div>
              <div className="text-orange-600 text-sm mt-1">
                Pickup Available from 8 AM to 7 PM
              </div>
            </div>
          </div>
        )}
        {/* Billing Information */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Billing Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border p-2 rounded col-span-2"
              placeholder="Name on Card"
              value={billing.name}
              onChange={(e) => setBilling({ ...billing, name: e.target.value })}
              required
            />
            <input
              className="border p-2 rounded col-span-2"
              placeholder="Debit / Credit Card Number"
              value={billing.card}
              onChange={(e) => setBilling({ ...billing, card: e.target.value })}
              required
            />
            <input
              className="border p-2 rounded"
              placeholder="Expiration Date (MM/YY)"
              value={billing.expiry}
              onChange={(e) =>
                setBilling({ ...billing, expiry: e.target.value })
              }
              required
            />
            <input
              className="border p-2 rounded"
              placeholder="CVV"
              value={billing.cvv}
              onChange={(e) => setBilling({ ...billing, cvv: e.target.value })}
              required
            />
            <input
              className="border p-2 rounded"
              placeholder="ZIP Code"
              value={billing.zip}
              onChange={(e) => setBilling({ ...billing, zip: e.target.value })}
              required
            />
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={sameAsShipping}
                onChange={(e) => setSameAsShipping(e.target.checked)}
                id="sameAsShipping"
              />
              <label htmlFor="sameAsShipping" className="text-xs">
                Same as Shipping Address
              </label>
            </div>
            <input
              className="border p-2 rounded col-span-2"
              placeholder="Billing Address"
              value={billing.address}
              onChange={(e) =>
                setBilling({ ...billing, address: e.target.value })
              }
              required
            />
          </div>
        </div>
      </form>
      <aside className="w-full md:w-80 bg-white border rounded-lg shadow p-6 h-fit self-start">
        <h3 className="text-lg font-semibold mb-4 text-center">Order Total</h3>
        <div className="text-sm mb-2 flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="text-sm mb-2 flex justify-between">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="text-sm mb-4 flex justify-between">
          <span>Sales Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="font-bold text-base flex justify-between border-t pt-2 mb-4">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button
          onClick={handleSubmit}
          type="submit"
          form="checkout-form"
          className="w-full bg-black text-white py-2 rounded text-base font-semibold shadow hover:bg-gray-900 transition"
        >
          PURCHASE
        </button>
      </aside>
    </div>
  );
}
