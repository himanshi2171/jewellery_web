import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  featured: boolean;
  title?: string;
  tagName?: string;
  stock?: number;
  quantity?: string[];
  rating?: number;
  reviews?: number;
  isSale?: boolean;
  isNew?: boolean;
  inStock?: boolean;
  originalPrice?: number;
  [key: string]: any;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/assets/data/products.json");
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        setProducts(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
}; 