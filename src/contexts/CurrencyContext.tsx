import React, { createContext, useContext, useState, ReactNode } from 'react';

type Currency = 'INR' | 'USD' | 'EUR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceINR: number, priceUSD: number, priceEUR: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>('INR');

  const formatPrice = (priceINR: number, priceUSD: number, priceEUR: number) => {
    if (currency === 'INR') {
      return `₹${priceINR.toFixed(2)}`;
    } else if (currency === 'USD') {
      return `$${priceUSD.toFixed(2)}`;
    } else {
      return `€${priceEUR.toFixed(2)}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
