import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(req) {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session')?.value;

    if (adminSession !== 'active') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    // Verify current password first
    let expectedPassword = process.env.ADMIN_PASSWORD || 'itulahadmin2026';
    
    try {
      const dbPasswordSetting = db.prepare('SELECT value FROM settings WHERE key = ?').get('adminPassword');
      if (dbPasswordSetting) {
        expectedPassword = dbPasswordSetting.value;
      }
    } catch (e) {
      console.error("Failed to query DB for password, using env fallback", e);
    }

    if (currentPassword !== expectedPassword) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
    }

    if (!newPassword || newPassword.trim().length < 4) {
      return NextResponse.json({ error: 'New password must be at least 4 characters long.' }, { status: 400 });
    }

    // Save the new password to the settings table
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    stmt.run('adminPassword', newPassword.trim());

    return NextResponse.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Profile API Error:', err);
    return NextResponse.json({ error: 'Server error updating password settings.' }, { status: 500 });
  }
}
