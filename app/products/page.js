import { Suspense } from 'react';
import db from '@/lib/db';
import ProductList from './ProductList';

export const metadata = {
  title: "Products & Services | Itulah Nigeria Limited",
  description: "Browse the complete range of products offered by Itulah Nigeria Limited: CCTV camera installations, PABX systems, high security Abus locks, Wild Octopus Liqueur, fine perfumes, body sprays, and nutrition supplements.",
};

export const dynamic = 'force-dynamic';

export default function ProductsPage() {
  // Fetch initial products lists from SQLite on the server
  let initialProducts = [];
  try {
    initialProducts = db.prepare('SELECT * FROM products ORDER BY name ASC').all();
  } catch (err) {
    console.error("Database query failed on ProductsPage mount:", err);
  }

  return (
    <Suspense fallback={<div style={{ padding: '100px 0', textAlign: 'center', color: '#94a3b8' }}>Loading product catalog...</div>}>
      <ProductList initialProducts={initialProducts} />
    </Suspense>
  );
}
