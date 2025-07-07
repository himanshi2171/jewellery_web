"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  loadingText: string;
  setLoading: (loading: boolean, text?: string) => void;
  showLoading: (text?: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');

  const setLoading = useCallback((loading: boolean, text: string = 'Loading...') => {
    setIsLoading(loading);
    setLoadingText(text);
  }, []);

  const showLoading = useCallback((text: string = 'Loading...') => {
    setIsLoading(true);
    setLoadingText(text);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingText('Loading...');
  }, []);

  const value: LoadingContextType = {
    isLoading,
    loadingText,
    setLoading,
    showLoading,
    hideLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}; 