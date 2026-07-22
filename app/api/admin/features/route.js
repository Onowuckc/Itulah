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
    const features = db.prepare('SELECT * FROM features ORDER BY category ASC, title ASC').all();
    return NextResponse.json({ success: true, features });
  } catch (error) {
    console.error('Error fetching admin features:', error);
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
    const body = await request.json();
    const { key, enabled, preset } = body;

    if (preset === 'all_on') {
      db.prepare('UPDATE features SET enabled = 1').run();
    } else if (preset === 'handover') {
      db.prepare('UPDATE features SET enabled = 0').run();
    } else if (key !== undefined && enabled !== undefined) {
      db.prepare('UPDATE features SET enabled = ? WHERE key = ?').run(enabled ? 1 : 0, key);
    } else {
      return NextResponse.json({ success: false, error: 'Invalid parameters' }, { status: 400 });
    }

    const updatedFeatures = db.prepare('SELECT * FROM features ORDER BY category ASC, title ASC').all();
    return NextResponse.json({ success: true, features: updatedFeatures });
  } catch (error) {
    console.error('Error updating feature status:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
