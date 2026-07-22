import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

function isAuthorized(req) {
  const adminSession = req.cookies.get('admin_session')?.value;
  return adminSession === 'active';
}

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// POST: Add new blog post
export async function POST(req) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { title, content, category, author, imageUrl } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Blog title and content are required.' }, { status: 400 });
    }

    const slug = `${slugify(title)}-${Date.now().toString().slice(-4)}`;
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const insertStatement = db.prepare(`
      INSERT INTO blogs (title, slug, content, category, author, date, imageUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertStatement.run(
      title,
      slug,
      content,
      category || 'News',
      author || 'Administrator',
      date,
      imageUrl || '/img/logo.png'
    );

    return NextResponse.json({ success: true, slug });
  } catch (err) {
    console.error('Admin Blogs POST Error:', err);
    return NextResponse.json({ error: 'Database error creating article.' }, { status: 500 });
  }
}

// PUT: Edit existing blog post
export async function PUT(req) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id, title, content, category, author, imageUrl } = await req.json();

    if (!id || !title || !content) {
      return NextResponse.json({ error: 'ID, title, and content are required.' }, { status: 400 });
    }

    const updateStatement = db.prepare(`
      UPDATE blogs
      SET title = ?, content = ?, category = ?, author = ?, imageUrl = ?
      WHERE id = ?
    `);

    updateStatement.run(
      title,
      content,
      category || 'News',
      author || 'Administrator',
      imageUrl || '/img/logo.png',
      id
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin Blogs PUT Error:', err);
    return NextResponse.json({ error: 'Database error updating article.' }, { status: 500 });
  }
}

// DELETE: Remove blog post
export async function DELETE(req) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required for deletion.' }, { status: 400 });
    }

    const deleteStatement = db.prepare('DELETE FROM blogs WHERE id = ?');
    deleteStatement.run(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin Blogs DELETE Error:', err);
    return NextResponse.json({ error: 'Database error deleting article.' }, { status: 500 });
  }
}
