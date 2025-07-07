import React from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  type?: "spinner" | "dots" | "pulse" | "skeleton" | "card" | "button";
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  className?: string;
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({
  type = "spinner",
  size = "md",
  text,
  className = "",
  color = "#0A0704",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  const renderSpinner = () => (
    <div
      className={`${sizeClasses[size]} border-2 border-gray-200 border-t-current rounded-full animate-spin`}
      style={{ borderTopColor: color }}
    />
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${sizeClasses[size]} bg-current rounded-full`}
          style={{ color }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <motion.div
      className={`${sizeClasses[size]} bg-current rounded-full`}
      style={{ color }}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
      }}
    />
  );

  const renderSkeleton = () => (
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
    </div>
  );

  const renderCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
      <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  );

  const renderButtonLoader = () => (
    <div className="flex items-center space-x-2">
      <Loader2 className={`${sizeClasses[size]} animate-spin`} style={{ color }} />
      {text && <span className={textSizes[size]}>{text}</span>}
    </div>
  );

  const renderLoader = () => {
    switch (type) {
      case "dots":
        return renderDots();
      case "pulse":
        return renderPulse();
      case "skeleton":
        return renderSkeleton();
      case "card":
        return renderCardSkeleton();
      case "button":
        return renderButtonLoader();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {renderLoader()}
    </div>
  );
};

export const PageLoader: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center space-y-4">
      <Loader type="spinner" size="xl" color="#0A0704" />
      <p className="text-gray-600 font-medium">{text}</p>
    </div>
  </div>
);

export const ProductCardLoader: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

export const CartLoader: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="flex items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse" />
        <div className="flex-1 ml-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
        </div>
        <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
      </div>
    ))}
  </div>
);

export const SearchLoader: React.FC = () => (
  <div className="flex items-center space-x-2 text-gray-500">
    <span className="text-sm">Searching...</span>
  </div>
);

export default Loader; 