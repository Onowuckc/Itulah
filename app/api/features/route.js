import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = db.prepare('SELECT * FROM features').all();
    const flags = {};
    rows.forEach((row) => {
      flags[row.key] = row.enabled === 1;
    });

    return NextResponse.json({ success: true, flags, features: rows });
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
