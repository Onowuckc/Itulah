import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import BlogManager from './BlogManager';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('admin_session')?.value;

  if (adminSession !== 'active') {
    redirect('/admin/login');
  }

  let blogs = [];
  try {
    blogs = db.prepare('SELECT * FROM blogs ORDER BY id DESC').all();
  } catch (err) {
    console.error("Database query failed on AdminBlog mount:", err);
  }

  return <BlogManager initialBlogs={blogs} />;
}
