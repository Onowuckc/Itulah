import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const sessionData = JSON.parse(sessionCookie);
    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC').all(sessionData.id);

    const parsedOrders = orders.map((o) => ({
      ...o,
      items: JSON.parse(o.items_json || '[]')
    }));

    return NextResponse.json({ success: true, orders: parsedOrders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
