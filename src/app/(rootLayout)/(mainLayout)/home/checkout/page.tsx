"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  addressFindByUser,
  addressStoreByUser,
} from "@/redux/action/userAction";
import { FiMapPin } from "react-icons/fi";
import { emptyCart } from "@/redux/action/cartActions";

type Address = {
  label: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
};

export default function CheckoutPage() {
  const cartItems = useSelector((state: any) => state.cart.items);

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
  });
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();
  const dispatch: any = useDispatch();
  const [userID, setUserID] = useState<any>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("userData");
      if (userData) {
        setUserID(JSON.parse(userData)?.id);
      }
    }
  }, []);

  const [storedAddresses, setStoredAddresses] = useState<Address[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    if (userID) {
      fetchData();
    }
  }, [userID]);

  useEffect(() => {
    if (userID && showAddressModal) {
      fetchData();
    }
  }, [userID, showAddressModal]);

  const fetchData = () => {
    dispatch(
      addressFindByUser({
        userID: userID,
        onSuccess: (res) => {
          if (res.status === 200 && Array.isArray(res.data)) {
            setStoredAddresses(res.data);
            if (Array.isArray(res.data)) {
              const defaultAddress = res.data.find(
                (addr: Address) => addr.isDefault === true
              );
              if (defaultAddress) {
                setShippingInfo({
                  address: defaultAddress.address,
                  city: defaultAddress.city,
                  state: defaultAddress.state,
                  zip: defaultAddress.zip,
                });
              }
            }
          }
        },
        onFailure: (error) => {
          console.log("Failure!", error);
        },
      })
    );
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

  const validate = () => {
    const newErrors: any = {};
    if (!myInfo.email) newErrors.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(myInfo.email))
      newErrors.email =
        "Please enter a valid email address (e.g., user@example.com).";
    if (!myInfo.phone) newErrors.phone = "Please enter your phone number.";
    else if (!/^\d{10}$/.test(myInfo.phone.replace(/\D/g, "")))
      newErrors.phone = "Please enter a valid 10-digit phone number.";

    if (delivery === "shipment") {
      if (!shippingInfo.address)
        newErrors.shippingAddress = "Please enter the shipping address.";
      if (!shippingInfo.city)
        newErrors.shippingCity = "Please enter the shipping city.";
      if (!shippingInfo.state)
        newErrors.shippingState = "Please enter the shipping state.";
      if (!shippingInfo.zip)
        newErrors.shippingZip = "Please enter the shipping ZIP code.";
      else if (!/^\d{6}(-\d{4})?$/.test(shippingInfo.zip))
        newErrors.shippingZip = "Please enter a valid 5-digit ZIP code.";
    }
    if (!billing.name)
      newErrors.billingName = "Please enter the name on the card.";
    if (!billing.card) newErrors.billingCard = "Please enter your card number.";
    else if (!/^\d{16}$/.test(billing.card.replace(/\s/g, "")))
      newErrors.billingCard =
        "Please enter a valid card number (13-19 digits).";
    if (!billing.expiry)
      newErrors.billingExpiry = "Please enter the card's expiry date.";
    else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(billing.expiry))
      newErrors.billingExpiry = "Expiry date must be in MM/YY format.";
    if (!billing.cvv) newErrors.billingCVV = "Please enter the card's CVV.";
    else if (!/^\d{3,4}$/.test(billing.cvv))
      newErrors.billingCVV = "Please enter a valid CVV (3 or 4 digits).";
    setErrors(newErrors);
    console.log(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

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

    if (userID) {
      dispatch(
        addressStoreByUser({
          formData: {
            userID,
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            zip: shippingInfo.zip,
            isDefault: storedAddresses?.length === 0 ? true : false,
          },
          onSuccess: (res) => {
            if (res.status === 200) {
              dispatch(emptyCart());
              if (typeof window !== "undefined") {
                localStorage.setItem("orderData", JSON.stringify(orderData));
              }
              setStoredAddresses([res.data]);
              router.push("/home/checkout/confirmation");
            }
          },
          onFailure: () => {
            console.log("Failure!");
          },
        })
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto py-4 md:py-10 px-2 md:px-6">
      <form className="flex-1 w-full space-y-6 md:space-y-8">
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">
            My Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block font-medium mb-1">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                className={`border p-2 rounded w-full focus:ring-2 focus:ring-black transition ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Email address"
                value={myInfo.email}
                onChange={(e) =>
                  setMyInfo({ ...myInfo, email: e.target.value })
                }
                type="email"
                required
              />
              {errors.email && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.email}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="block font-medium mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                className={`border p-2 rounded w-full focus:ring-2 focus:ring-black transition ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Phone Number"
                value={myInfo.phone}
                onChange={(e) =>
                  setMyInfo({ ...myInfo, phone: e.target.value })
                }
                required
              />
              {errors.phone && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.phone}
                </span>
              )}
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-base md:text-lg font-semibold mb-2">
            How would you like to receive your order?
          </h2>
          <div className="flex gap-4 md:gap-6 items-center flex-wrap">
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
        {delivery === "shipment" && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-lg font-bold">Shipping Details</h2>
              <button
                type="button"
                className="text-xs underline text-gray-500"
                onClick={() => setShowAddressModal(true)}
              >
                Choose a different location
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="shippingAddress"
                  className="block font-medium mb-1"
                >
                  Shipping address <span className="text-red-500">*</span>
                </label>
                <input
                  id="shippingAddress"
                  className={`border p-2 rounded w-full focus:ring-2 focus:ring-black transition ${
                    errors.shippingAddress
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Shipping address"
                  value={shippingInfo.address}
                  onChange={(e) =>
                    setShippingInfo({
                      ...shippingInfo,
                      address: e.target.value,
                    })
                  }
                  required
                />
                {errors.shippingAddress && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.shippingAddress}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="shippingCity"
                  className="block font-medium mb-1"
                >
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  id="shippingCity"
                  className={`border p-2 rounded w-full focus:ring-2 focus:ring-black transition ${
                    errors.shippingCity ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="City"
                  value={shippingInfo.city}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, city: e.target.value })
                  }
                  required
                />
                {errors.shippingCity && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.shippingCity}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="shippingState"
                  className="block font-medium mb-1"
                >
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  id="shippingState"
                  className={`border p-2 rounded w-full focus:ring-2 focus:ring-black transition ${
                    errors.shippingState ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="State"
                  value={shippingInfo.state}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, state: e.target.value })
                  }
                  required
                />
                {errors.shippingState && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.shippingState}
                  </span>
                )}
              </div>
              <div>
                <label htmlFor="shippingZip" className="block font-medium mb-1">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="shippingZip"
                  className={`border p-2 rounded w-full focus:ring-2 focus:ring-black transition ${
                    errors.shippingZip ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="ZIP Code"
                  value={shippingInfo.zip}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, zip: e.target.value })
                  }
                  required
                />
                {errors.shippingZip && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.shippingZip}
                  </span>
                )}
              </div>
              {showAddressModal && (
                <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md relative">
                    <button
                      className="absolute top-2 right-3 text-gray-400 hover:text-black text-xl"
                      onClick={() => setShowAddressModal(false)}
                      aria-label="Close"
                    >
                      ×
                    </button>
                    <h3 className="text-lg font-semibold mb-4">
                      Select Address
                    </h3>
                    <ul className="flex flex-col gap-1 mb-4">
                      {storedAddresses?.map((addr, idx) => (
                        <li
                          key={idx}
                          className={`${
                            addr.isDefault ? "bg-gray-200" : "bg-white"
                          } px-3 py-2 rounded border cursor-pointer text-sm transition-colors text-black hover:bg-gray-200 hover:text-black flex items-start gap-2`}
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
                          <FiMapPin className="text-xl text-gray-500 mt-1" />
                          <div>
                            <div className="font-semibold">{addr?.label}</div>
                            <div>
                              <b>address:</b> {addr?.address}
                            </div>
                            <div>
                              <b>city:</b> {addr?.city}
                            </div>
                            <div>
                              <b>state:</b> {addr?.state}
                            </div>
                            <div>
                              <b>zip:</b> {addr?.zip}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {delivery === "inperson" && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-lg font-bold">Pickup Location</h2>
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
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">
            Billing Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="billingName" className="block font-medium mb-1">
                Name on Card <span className="text-red-500">*</span>
              </label>
              <input
                id="billingName"
                className={`border p-2 rounded w-full focus:ring-2 focus:ring-black transition ${
                  errors.billingName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Name on Card"
                value={billing.name}
                onChange={(e) =>
                  setBilling({ ...billing, name: e.target.value })
                }
                required
              />
              {errors.billingName && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.billingName}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="billingCard" className="block font-medium mb-1">
                Debit / Credit Card Number{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                id="billingCard"
                className={`border p-2 rounded w-full focus:ring-2 focus:ring-black transition ${
                  errors.billingCard ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Debit / Credit Card Number"
                value={billing.card}
                onChange={(e) =>
                  setBilling({ ...billing, card: e.target.value })
                }
                required
              />
              {errors.billingCard && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.billingCard}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="billingExpiry" className="block font-medium mb-1">
                Expiration Date (MM/YY) <span className="text-red-500">*</span>
              </label>
              <input
                id="billingExpiry"
                className={`border p-2 rounded w-full focus:ring-2 focus:ring-black transition ${
                  errors.billingExpiry ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Expiration Date (MM/YY)"
                value={billing.expiry}
                onChange={(e) =>
                  setBilling({ ...billing, expiry: e.target.value })
                }
                required
              />
              {errors.billingExpiry && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.billingExpiry}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="billingCVV" className="block font-medium mb-1">
                CVV <span className="text-red-500">*</span>
              </label>
              <input
                id="billingCVV"
                className={`border p-2 rounded w-full focus:ring-2 focus:ring-black transition ${
                  errors.billingCVV ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="CVV"
                value={billing.cvv}
                onChange={(e) =>
                  setBilling({ ...billing, cvv: e.target.value })
                }
                required
              />
              {errors.billingCVV && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.billingCVV}
                </span>
              )}
            </div>
          </div>
        </div>
      </form>
      <aside className="w-full md:w-80 max-w-full bg-white border rounded-lg shadow p-6 h-fit self-start mt-6 md:mt-0">
        <h3 className="text-base md:text-lg font-semibold mb-4 text-center">
          Order Total
        </h3>
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
          onClick={handlePurchase}
          type="submit"
          form="checkout-form"
          className="flex-1 px-6 py-3 bg-[#a58c3d] text-white rounded-md hover:bg-[#C2992F] font-semibold transition-colors text-center"
        >
          PURCHASE
        </button>
      </aside>
    </div>
  );
}
