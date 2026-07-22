'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import AnimatedBackground from './AnimatedBackground';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <AnimatedBackground />
        {children}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingTop: '80px', position: 'relative' }}>
      <AnimatedBackground />
      <Header />
      <main style={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}

