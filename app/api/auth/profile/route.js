import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const sessionData = JSON.parse(sessionCookie);
    const { name, phone, address, city, state, newPassword } = await request.json();

    if (!name) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }

    if (newPassword && newPassword.trim() !== '') {
      db.prepare(`
        UPDATE users
        SET name = ?, phone = ?, address = ?, city = ?, state = ?, password = ?
        WHERE id = ?
      `).run(name.trim(), phone || '', address || '', city || '', state || '', newPassword, sessionData.id);
    } else {
      db.prepare(`
        UPDATE users
        SET name = ?, phone = ?, address = ?, city = ?, state = ?
        WHERE id = ?
      `).run(name.trim(), phone || '', address || '', city || '', state || '', sessionData.id);
    }

    const updatedUser = db.prepare('SELECT id, name, email, phone, address, city, state FROM users WHERE id = ?').get(sessionData.id);

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating customer profile:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
