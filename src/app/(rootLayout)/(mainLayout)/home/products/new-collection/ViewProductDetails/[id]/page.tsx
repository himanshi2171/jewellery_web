"use client";
import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import productsData from "@/data/products.json";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/action/cartActions";
import { ShoppingCart } from "lucide-react";

export default function ViewProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const product = useMemo(() => {
    for (const collection of productsData) {
      const found = collection.data.find(
        (p) => String(p.id) === String(params.id)
      );
      if (found) {
        return { ...found, collectionTitle: collection.title };
      }
    }
    return null;
  }, [params.id]);

  const images: string[] = [product?.image ?? "/assets/Image/placeholder.jpg"];
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.size?.[0] || "");
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (product: {
    id: number;
    name: string;
    price: string;
    image: string;
    title?: string;
    offer?: string;
    stock?: number;
    size?: string[];
    tagName?: string;
    description?: string;
  }) => {
    dispatch(addToCart(product, quantity));
    router.push("/home/cart");
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  const inStock = product.stock > 0;
  const maxQty = Math.min(product.stock, 10);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex md:flex-col gap-3 md:mr-3">
            {images.map((img: string, idx: number) => (
              <button
                key={idx}
                className={`rounded-xl overflow-hidden w-16 h-16 md:w-20 md:h-20 transition-all duration-200 ring-2 ${
                  selectedImg === idx
                    ? "ring-[#a58c3d] scale-105"
                    : "ring-[#a58c3d] hover:[#C2992F]"
                }`}
                onClick={() => setSelectedImg(idx)}
              >
                <Image
                  src={img}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>

          <div className="flex-1 flex items-center justify-center bg-white rounded-2xl shadow-lg p-6">
            <Image
              src={images[selectedImg]}
              alt={product.name}
              width={400}
              height={400}
              className="object-contain max-h-[400px] w-auto h-auto transition-transform duration-300 hover:scale-105"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-500">{product.collectionTitle}</p>

            <div className="flex items-center gap-2 mt-3">
              <span className="text-yellow-500 text-2xl font-semibold">
                ${product.price}
              </span>
              {product.offer && (
                <span className="ml-2 bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                  {product.offer}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 mt-2 text-yellow-500 text-base">
              <span>★</span>
              <span className="text-gray-800 font-medium">4.5</span>
              <span className="text-xs text-gray-400 ml-1">(100 Reviews)</span>
            </div>

            <p className="mt-4 text-gray-700 leading-relaxed text-base">
              {product.description}
            </p>
          </div>

          {product.size?.length > 0 && (
            <div>
              <label className="block font-semibold mb-2">Size:</label>
              <div className="flex gap-2 flex-wrap">
                {product.size.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-150 ${
                      selectedSize === size
                        ? "bg-[#C2992F] text-white border-[#C2992F]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-green-100"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold mb-2">Quantity:</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity === 1}
                className="px-3 py-1 rounded border border-gray-300 text-lg font-bold disabled:opacity-40 hover:bg-gray-100"
              >
                −
              </button>
              <span className="px-4 py-1 border rounded bg-gray-50 text-base">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                disabled={quantity === maxQty}
                className="px-3 py-1 rounded border border-gray-300 text-lg font-bold disabled:opacity-40 hover:bg-gray-100"
              >
                +
              </button>
              <span className="text-xs text-gray-500">
                In stock: {product.stock}
              </span>
            </div>
          </div>

          <button
            onClick={() => handleAddToCart(product)}
            disabled={!inStock}
            className="w-full py-3 rounded-xl bg-[#a58c3d] text-white font-bold text-lg shadow-md hover:bg-[#C2992F] transition disabled:opacity-50"
          >
            {inStock ? (
              <span className="flex items-center justify-center gap-2">
                <ShoppingCart size={20} /> ADD TO BAG
              </span>
            ) : (
              "OUT OF STOCK"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
