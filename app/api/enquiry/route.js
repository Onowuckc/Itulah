import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import db from '@/lib/db';
import { sendEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type') || '';
    
    let name = '';
    let email = '';
    let phone = '';
    let subject = '';
    let productType = '';
    let message = '';
    let attachmentUrl = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      name = formData.get('name') || '';
      email = formData.get('email') || '';
      phone = formData.get('phone') || '';
      subject = formData.get('subject') || '';
      productType = formData.get('productType') || '';
      message = formData.get('message') || '';

      const file = formData.get('file');
      if (file && file.size > 0 && typeof file.arrayBuffer === 'function') {
        try {
          const isServerless = Boolean(
            process.env.VERCEL || 
            process.env.AWS_LAMBDA_FUNCTION_NAME || 
            (process.env.NODE_ENV === 'production' && fs.existsSync('/tmp'))
          );
          
          const uploadDir = isServerless && fs.existsSync('/tmp')
            ? path.join('/tmp', 'uploads')
            : path.resolve(process.cwd(), 'public', 'uploads');

          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const safeName = (file.name || 'document').replace(/[^a-zA-Z0-9.\-_]/g, '_');
          const uniqueFileName = `${Date.now()}_${safeName}`;
          const filePath = path.join(uploadDir, uniqueFileName);

          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          fs.writeFileSync(filePath, buffer);
          
          attachmentUrl = isServerless ? `[Attached File: ${safeName}]` : `/uploads/${uniqueFileName}`;
        } catch (uploadErr) {
          console.warn('[Enquiry API] Upload handling note:', uploadErr.message);
          attachmentUrl = `[Attached: ${(file && file.name) || 'Document'}]`;
        }
      }
    } else {
      const body = await req.json();
      name = body.name || '';
      email = body.email || '';
      phone = body.phone || '';
      subject = body.subject || '';
      productType = body.productType || 'General Enquiry';
      message = body.message || '';
    }

    // Input validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required fields.' }, { status: 400 });
    }

    const date = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });

    // 1. Store in SQLite database (with fallback for serverless container storage)
    try {
      const insertStatement = db.prepare(`
        INSERT INTO enquiries (name, email, phone, subject, productType, message, attachmentUrl, date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertStatement.run(name, email, phone, subject, productType, message, attachmentUrl, date);
      console.log(`[Enquiry API] Recorded enquiry in database for ${name}`);
    } catch (dbErr) {
      console.warn('[Enquiry API] SQLite write skipped or failed on serverless:', dbErr.message);
    }

    // 2. Dispatch automated email notification directly to Info@itulahng.com
    try {
      const mailResult = await sendEmail({
        name,
        email,
        phone,
        subject: subject || `New ${productType || 'Quote'} Request from ${name}`,
        productType,
        text: message,
        attachmentUrl
      });
      console.log(`[Enquiry API] Email dispatch to Info@itulahng.com result:`, mailResult);
    } catch (mailErr) {
      console.error('[Enquiry API] SMTP email dispatch error:', mailErr.message);
    }

    return NextResponse.json({ success: true, message: 'Enquiry received successfully.' });
  } catch (err) {
    console.error('Enquiry API Error:', err);
    return NextResponse.json({ error: 'Failed to process enquiry: ' + (err.message || 'Server error') }, { status: 500 });
  }
}

// Retrieve enquiries (for Admin use, secure route)
export async function GET(req) {
  try {
    const adminSession = req.cookies.get('admin_session')?.value;
    if (!adminSession || adminSession !== 'active') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const enquiries = db.prepare('SELECT * FROM enquiries ORDER BY id DESC').all();
    return NextResponse.json({ enquiries });
  } catch (err) {
    console.error('GET Enquiries Error:', err);
    return NextResponse.json({ error: 'Server error retrieving enquiries.' }, { status: 500 });
  }
}
