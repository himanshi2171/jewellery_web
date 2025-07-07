import React from "react";
import Image from "next/image";
import { Plus, Minus, Trash2, Loader2 } from "lucide-react";

type CartItemProps = {
  image: string;
  name: string;
  description: string;
  quantity: number;
  price: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  isUpdating?: boolean;
  isRemoving?: boolean;
};

export const CartItem: React.FC<CartItemProps> = ({
  image,
  name,
  description,
  quantity,
  price,
  onIncrease,
  onDecrease,
  onRemove,
  isUpdating = false,
  isRemoving = false,
}) => {
  return (
    <div
      className={`flex items-center bg-white p-3 rounded-xl shadow-sm mb-3 transition-opacity ${
        isRemoving ? "opacity-50" : ""
      }`}
    >
      <Image
        src={image}
        alt={name}
        width={60}
        height={60}
        className="rounded-lg"
      />
      <div className="flex-1 ml-3">
        <div className="font-semibold text-gray-500">{name}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
      <div className="flex flex-col items-center mr-4">
        <div className="flex items-center space-x-1">
          <button
            onClick={onDecrease}
            disabled={quantity <= 1 || isUpdating || isRemoving}
            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? (
              <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
            ) : (
              <Minus className="w-3 h-3 text-gray-500" />
            )}
          </button>
          <span className="text-sm font-medium mb-1 text-gray-500">
            {quantity}
          </span>
          <button
            onClick={onIncrease}
            disabled={isUpdating || isRemoving}
            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? (
              <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
            ) : (
              <Plus className="w-3 h-3 text-gray-500" />
            )}
          </button>
        </div>
      </div>
      <div className="w-16 text-right text-sm font-medium text-gray-500">
        ${price}
      </div>
      <button
        onClick={onRemove}
        disabled={isUpdating || isRemoving}
        className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Remove item"
      >
        {isRemoving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};
