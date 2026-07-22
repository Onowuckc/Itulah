import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { password } = await req.json();

    let expectedPassword = process.env.ADMIN_PASSWORD || 'itulahadmin2026';
    try {
      const dbPasswordSetting = db.prepare('SELECT value FROM settings WHERE key = ?').get('adminPassword');
      if (dbPasswordSetting) {
        expectedPassword = dbPasswordSetting.value;
      }
    } catch (e) {
      console.error("Failed to query DB for admin password during login:", e);
    }

    if (password === expectedPassword) {
      const response = NextResponse.json({ success: true });
      
      // Set secure HTTP-only cookie for session verification
      response.cookies.set('admin_session', 'active', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/'
      });

      return response;
    } else {
      return NextResponse.json({ error: 'Incorrect administrator password.' }, { status: 401 });
    }
  } catch (err) {
    console.error('Login API Error:', err);
    return NextResponse.json({ error: 'Server error processing request.' }, { status: 500 });
  }
}

// Logout route
export async function GET(req) {
  const response = NextResponse.json({ success: true, message: 'Logged out.' });
  // Clear cookie
  response.cookies.delete('admin_session');
  return response;
}
