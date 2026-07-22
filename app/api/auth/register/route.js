import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

export async function POST(request) {
  try {
    const { name, email, password, phone, address, city, state } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Name, email and password are required' }, { status: 400 });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return NextResponse.json({ success: false, error: 'An account with this email already exists' }, { status: 400 });
    }

    const createdAt = new Date().toISOString();
    const result = db.prepare(`
      INSERT INTO users (name, email, password, phone, address, city, state, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name.trim(),
      email.toLowerCase().trim(),
      password, // Simple stored password for demo/customer discretion portal
      phone || '',
      address || '',
      city || '',
      state || '',
      createdAt
    );

    const user = {
      id: result.lastInsertRowid,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || '',
      address: address || '',
      city: city || '',
      state: state || ''
    };

    // Set user_session cookie
    const cookieStore = await cookies();
    cookieStore.set('user_session', JSON.stringify({ id: user.id, email: user.email }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error during customer registration:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
