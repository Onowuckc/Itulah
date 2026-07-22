'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const FeatureContext = createContext();

export function FeatureProvider({ children }) {
  const [flags, setFlags] = useState({
    feature_cart: false,
    feature_checkout: false,
    feature_auth: false,
    feature_dashboard: false,
    feature_wishlist: false,
    feature_reviews: false
  });
  const [loading, setLoading] = useState(true);

  const fetchFlags = async () => {
    try {
      const res = await fetch('/api/features');
      const data = await res.json();
      if (data.success && data.flags) {
        setFlags(data.flags);
      }
    } catch (err) {
      console.error('Failed to load feature flags:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  return (
    <FeatureContext.Provider value={{ flags, loading, refreshFlags: fetchFlags }}>
      {children}
    </FeatureContext.Provider>
  );
}

export function useFeatures() {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error('useFeatures must be used within a FeatureProvider');
  }
  return context;
}
