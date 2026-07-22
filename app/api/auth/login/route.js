import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());

    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, error: 'Invalid email address or password' }, { status: 401 });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state
    };

    const cookieStore = await cookies();
    cookieStore.set('user_session', JSON.stringify({ id: user.id, email: user.email }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    });

    return NextResponse.json({ success: true, user: safeUser });
  } catch (error) {
    console.error('Error during customer login:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('user_session');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
