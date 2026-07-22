import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ success: false, user: null });
    }

    const sessionData = JSON.parse(sessionCookie);
    const user = db.prepare('SELECT id, name, email, phone, address, city, state FROM users WHERE id = ?').get(sessionData.id);

    if (!user) {
      return NextResponse.json({ success: false, user: null });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json({ success: false, user: null });
  }
}
