import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import ProductsManager from './ProductsManager';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('admin_session')?.value;

  if (adminSession !== 'active') {
    redirect('/admin/login');
  }

  let products = [];
  try {
    products = db.prepare('SELECT * FROM products ORDER BY id DESC').all();
  } catch (err) {
    console.error("Database query failed on AdminProducts mount:", err);
  }

  return <ProductsManager initialProducts={products} />;
}
