'use client';

import { FeatureProvider } from '@/context/FeatureContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

export default function Providers({ children }) {
  return (
    <FeatureProvider>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </FeatureProvider>
  );
}
