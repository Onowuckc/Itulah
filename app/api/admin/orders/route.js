import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('admin_session')?.value;

  if (adminSession !== 'active') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY id DESC').all();
    const parsedOrders = orders.map((o) => ({
      ...o,
      items: JSON.parse(o.items_json || '[]')
    }));

    return NextResponse.json({ success: true, orders: parsedOrders });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('admin_session')?.value;

  if (adminSession !== 'active') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId, status, trackingStep } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: 'orderId and status are required' }, { status: 400 });
    }

    const stepMap = {
      'Pending': 1,
      'Processing': 2,
      'Dispatched': 3,
      'Delivered': 4,
      'Cancelled': 0
    };

    const step = trackingStep !== undefined ? trackingStep : (stepMap[status] || 1);

    db.prepare('UPDATE orders SET status = ?, tracking_step = ? WHERE id = ?').run(status, step, orderId);

    const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    if (updatedOrder) {
      updatedOrder.items = JSON.parse(updatedOrder.items_json || '[]');
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
