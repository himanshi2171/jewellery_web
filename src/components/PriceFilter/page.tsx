'use client';

import React, { useState, useEffect } from 'react';

interface PriceFilterProps {
  onPriceChange: (min: number, max: number) => void;
  minPrice?: number;
  maxPrice?: number;
  currentMin?: number;
  currentMax?: number;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  onPriceChange,
  minPrice = 0,
  maxPrice = 1000,
  currentMin,
  currentMax,
}) => {
  const [priceRange, setPriceRange] = useState({
    min: currentMin ?? minPrice,
    max: currentMax ?? maxPrice,
  });

  useEffect(() => {
    if (currentMin !== undefined && currentMax !== undefined) {
      setPriceRange({
        min: currentMin,
        max: currentMax,
      });
    }
  }, [currentMin, currentMax]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onPriceChange(priceRange.min, priceRange.max);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [priceRange, onPriceChange]);

  const handleMinChange = (value: number) => {
    const newMin = Math.max(minPrice, Math.min(value, priceRange.max));
    setPriceRange(prev => ({ ...prev, min: newMin }));
  };

  const handleMaxChange = (value: number) => {
    const newMax = Math.max(priceRange.min, Math.min(value, maxPrice));
    setPriceRange(prev => ({ ...prev, max: newMax }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Price Range</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label htmlFor="min-price" className="block text-sm text-gray-600 mb-1">
              Min Price
            </label>
            <input
              type="number"
              id="min-price"
              value={priceRange.min}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A0704] focus:border-transparent transition-colors"
              min={minPrice}
              max={priceRange.max}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="max-price" className="block text-sm text-gray-600 mb-1">
              Max Price
            </label>
            <input
              type="number"
              id="max-price"
              value={priceRange.max}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A0704] focus:border-transparent transition-colors"
              min={priceRange.min}
              max={maxPrice}
            />
          </div>
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div
            className="absolute h-full bg-[#0A0704] rounded-full transition-all duration-300"
            style={{
              left: `${((priceRange.min - minPrice) / (maxPrice - minPrice)) * 100}%`,
              right: `${100 - ((priceRange.max - minPrice) / (maxPrice - minPrice)) * 100}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>${minPrice}</span>
          <span>${maxPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter; 