import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ success: true, wishlist: [] });
    }

    const sessionData = JSON.parse(sessionCookie);
    const rows = db.prepare(`
      SELECT w.id as wishlist_id, p.*
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
      ORDER BY w.id DESC
    `).all(sessionData.id);

    return NextResponse.json({ success: true, wishlist: rows });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Please log in to save items to your wishlist' }, { status: 401 });
    }

    const sessionData = JSON.parse(sessionCookie);
    const { productId } = await request.json();

    const existing = db.prepare('SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?').get(sessionData.id, productId);

    if (existing) {
      db.prepare('DELETE FROM wishlist WHERE id = ?').run(existing.id);
      return NextResponse.json({ success: true, action: 'removed' });
    } else {
      const createdAt = new Date().toISOString();
      db.prepare('INSERT INTO wishlist (user_id, product_id, created_at) VALUES (?, ?, ?)').run(sessionData.id, productId, createdAt);
      return NextResponse.json({ success: true, action: 'added' });
    }
  } catch (error) {
    console.error('Error toggling wishlist item:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
