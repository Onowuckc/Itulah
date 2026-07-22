import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

// Helper to check admin authentication
function isAuthorized(req) {
  const adminSession = req.cookies.get('admin_session')?.value;
  return adminSession === 'active';
}

// POST: Add new product
export async function POST(req) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const { name, category, description, price, imageUrl, featured } = await req.json();

    if (!name || !category) {
      return NextResponse.json({ error: 'Product name and category are required.' }, { status: 400 });
    }

    const insertStatement = db.prepare(`
      INSERT INTO products (name, category, description, price, imageUrl, featured)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = insertStatement.run(
      name,
      category,
      description || '',
      price ? parseFloat(price) : null,
      imageUrl || '/img/logo.png',
      featured ? 1 : 0
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowId });
  } catch (err) {
    console.error('Admin Products POST Error:', err);
    return NextResponse.json({ error: 'Database error creating product.' }, { status: 500 });
  }
}

// PUT: Edit existing product
export async function PUT(req) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const { id, name, category, description, price, imageUrl, featured } = await req.json();

    if (!id || !name || !category) {
      return NextResponse.json({ error: 'ID, name, and category are required for editing.' }, { status: 400 });
    }

    const updateStatement = db.prepare(`
      UPDATE products
      SET name = ?, category = ?, description = ?, price = ?, imageUrl = ?, featured = ?
      WHERE id = ?
    `);

    updateStatement.run(
      name,
      category,
      description || '',
      price ? parseFloat(price) : null,
      imageUrl || '/img/logo.png',
      featured ? 1 : 0,
      id
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin Products PUT Error:', err);
    return NextResponse.json({ error: 'Database error updating product.' }, { status: 500 });
  }
}

// DELETE: Remove product
export async function DELETE(req) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required for deletion.' }, { status: 400 });
    }

    const deleteStatement = db.prepare('DELETE FROM products WHERE id = ?');
    deleteStatement.run(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin Products DELETE Error:', err);
    return NextResponse.json({ error: 'Database error deleting product.' }, { status: 500 });
  }
}
