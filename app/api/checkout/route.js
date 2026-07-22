import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, customer_name, customer_email, customer_phone, shipping_address, city, state, payment_method } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
    }

    if (!customer_name || !customer_email || !shipping_address) {
      return NextResponse.json({ success: false, error: 'Please provide recipient name, email and delivery address' }, { status: 400 });
    }

    // Check logged in user if any
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session')?.value;
    let userId = null;
    if (sessionCookie) {
      try {
        userId = JSON.parse(sessionCookie).id;
      } catch (e) {}
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

    // Generate unique order number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ITL-${dateStr}-${randomSuffix}`;
    const createdAt = new Date().toISOString();

    const result = db.prepare(`
      INSERT INTO orders (
        order_number, user_id, customer_name, customer_email, customer_phone,
        shipping_address, city, state, items_json, total_amount, payment_method, status, tracking_step, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderNumber,
      userId,
      customer_name.trim(),
      customer_email.toLowerCase().trim(),
      customer_phone || '',
      shipping_address.trim(),
      city || 'Lagos',
      state || 'Lagos State',
      JSON.stringify(items),
      totalAmount,
      payment_method || 'Card',
      'Pending',
      1, // Step 1: Order Placed
      createdAt
    );

    return NextResponse.json({
      success: true,
      order: {
        id: result.lastInsertRowid,
        order_number: orderNumber,
        total_amount: totalAmount,
        customer_name,
        customer_email,
        payment_method: payment_method || 'Card',
        created_at: createdAt
      }
    });
  } catch (error) {
    console.error('Error placing checkout order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
