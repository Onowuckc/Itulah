import tls from 'tls';

/**
 * Native Node.js SMTP Client over TLS (Port 465)
 * Sends branded HTML emails directly to Info@itulahng.com using user-supplied credentials.
 */
export async function sendEmail({ subject, text, html, replyTo, name, email, phone, productType, attachmentUrl }) {
  const host = process.env.SMTP_HOST || 'mail.itulahng.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER || 'Info@itulahng.com';
  const pass = process.env.SMTP_PASS || 'News@090';
  const recipient = process.env.TO_EMAIL || 'Info@itulahng.com';
  const siteUrl = process.env.NEXT_PUBLIC_URL || 'https://www.itulahng.com';

  const defaultHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject || 'New Website Enquiry'}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050914; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <div style="background-color: #050914; padding: 32px 12px;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 640px; background-color: #0d1527; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
      
      <!-- Top Brand Accent Bar (Crimson Red -> Navy Blue -> Electric Sky) -->
      <tr>
        <td style="height: 5px; background: linear-gradient(90deg, #dc2626 0%, #2563eb 50%, #38bdf8 100%);"></td>
      </tr>

      <!-- Header Section -->
      <tr>
        <td style="padding: 32px 36px 24px 36px; background-color: #0b1222; border-bottom: 1px solid #1e293b;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <span style="font-size: 22px; font-weight: 800; letter-spacing: 1.5px; color: #ffffff; text-transform: uppercase; display: inline-block;">
                  ITULAH <span style="color: #dc2626;">NIGERIA</span>
                </span>
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #38bdf8; margin-top: 4px; font-weight: 600;">
                  Official Website Enquiry Dispatch
                </div>
              </td>
              <td align="right" valign="top">
                <span style="background: rgba(220, 38, 38, 0.15); border: 1px solid #dc2626; color: #f87171; border-radius: 20px; padding: 6px 14px; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">
                  ${productType || 'General Enquiry'}
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Subject & Notification Banner -->
      <tr>
        <td style="padding: 24px 36px 10px 36px;">
          <div style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 6px;">Subject</div>
          <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; line-height: 1.4;">
            ${subject || 'New Enquiry / Quote Request'}
          </h1>
        </td>
      </tr>

      <!-- Client Details Matrix Card -->
      <tr>
        <td style="padding: 16px 36px;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #111c33; border: 1px solid #1e2e4a; border-radius: 12px; padding: 18px 20px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="130" style="font-size: 13px; color: #94a3b8; font-weight: 600;">Client Name:</td>
                    <td style="font-size: 15px; color: #ffffff; font-weight: 700;">${name || 'N/A'}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="130" style="font-size: 13px; color: #94a3b8; font-weight: 600;">Email Address:</td>
                    <td style="font-size: 14px; color: #38bdf8; font-weight: 600;">
                      <a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="130" style="font-size: 13px; color: #94a3b8; font-weight: 600;">Phone Number:</td>
                    <td style="font-size: 14px; color: #e2e8f0; font-weight: 600;">
                      ${phone ? `<a href="tel:${phone}" style="color: #e2e8f0; text-decoration: none;">${phone}</a>` : '<span style="color: #64748b;">Not Provided</span>'}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="130" style="font-size: 13px; color: #94a3b8; font-weight: 600;">Category:</td>
                    <td style="font-size: 14px; color: #38bdf8; font-weight: 600;">${productType || 'General Enquiry'}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Client Message Box -->
      <tr>
        <td style="padding: 10px 36px 20px 36px;">
          <div style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 8px;">
            Client Message
          </div>
          <div style="background-color: #070d18; border-left: 4px solid #dc2626; border-radius: 0 10px 10px 0; padding: 18px 22px; color: #f1f5f9; font-size: 15px; line-height: 1.7; white-space: pre-wrap; word-break: break-word;">${text}</div>
        </td>
      </tr>

      <!-- File Attachment (if any) -->
      ${attachmentUrl ? `
      <tr>
        <td style="padding: 0 36px 24px 36px;">
          <div style="background: rgba(56, 189, 248, 0.08); border: 1px dashed rgba(56, 189, 248, 0.35); border-radius: 10px; padding: 14px 18px;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="font-size: 13px; color: #94a3b8; font-weight: 600;">Attachment:</span>
                  <div style="font-size: 14px; color: #ffffff; font-weight: 600; margin-top: 2px;">
                    ${attachmentUrl.startsWith('[') ? attachmentUrl : 'Attached File'}
                  </div>
                </td>
                ${!attachmentUrl.startsWith('[') ? `
                <td align="right">
                  <a href="${siteUrl}${attachmentUrl}" target="_blank" style="background: #0284c7; color: #ffffff; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 600; text-decoration: none; display: inline-block;">
                    View File &rarr;
                  </a>
                </td>` : ''}
              </tr>
            </table>
          </div>
        </td>
      </tr>` : ''}

      <!-- Interactive Call-To-Action Quick Reply -->
      <tr>
        <td style="padding: 10px 36px 30px 36px;">
          <table border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td style="border-radius: 8px; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);">
                <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Itulah Enquiry Response')}" style="padding: 12px 24px; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; display: inline-block; letter-spacing: 0.5px;">
                  Reply via Email &rarr;
                </a>
              </td>
              ${phone ? `
              <td style="width: 14px;"></td>
              <td style="border-radius: 8px; background-color: #1e293b; border: 1px solid #38bdf8;">
                <a href="tel:${phone}" style="padding: 12px 22px; color: #38bdf8; font-size: 13px; font-weight: 700; text-decoration: none; display: inline-block; letter-spacing: 0.5px;">
                  Call ${phone}
                </a>
              </td>` : ''}
            </tr>
          </table>
        </td>
      </tr>

      <!-- Corporate Footer -->
      <tr>
        <td style="padding: 24px 36px 30px 36px; background-color: #070d18; border-top: 1px solid #1e293b;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size: 12px; color: #64748b; line-height: 1.6;">
                <strong style="color: #94a3b8;">Itulah Nigeria Limited</strong> (Est. 1989)<br>
                Plot 4 block 11 Prince Adesoji Ajose Street, Ogudu Phase 2, Lagos, Nigeria<br>
                Hotlines: +234 807 963 5408 &bull; +234 812 449 1283<br>
                Official Portal: <a href="https://www.itulahng.com" style="color: #38bdf8; text-decoration: none;">www.itulahng.com</a>
              </td>
            </tr>
            <tr>
              <td style="font-size: 11px; color: #475569; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 14px;">
                Automated dispatch from Itulah Nigeria Limited. Manage all client records and orders on the <a href="${siteUrl}/admin" style="color: #38bdf8; text-decoration: none;">Admin Portal</a>.
              </td>
            </tr>
          </table>
        </td>
      </tr>

    </table>
  </div>
</body>
</html>
  `;

  const formattedHtml = html || defaultHtml;

  return new Promise((resolve, reject) => {
    const socket = tls.connect(port, host, { rejectUnauthorized: false, servername: host }, () => {
      console.log(`[SMTP] Connected to ${host}:${port}`);
    });

    socket.setEncoding('utf8');

    const sendCommand = (cmd) => {
      socket.write(cmd + '\r\n');
    };

    let step = 0;

    socket.on('data', (data) => {
      if (data.startsWith('220') && step === 0) {
        step = 1;
        sendCommand(`EHLO ${host}`);
      } else if (data.startsWith('250') && step === 1) {
        step = 2;
        sendCommand('AUTH LOGIN');
      } else if (data.startsWith('334') && step === 2) {
        step = 3;
        sendCommand(Buffer.from(user).toString('base64'));
      } else if (data.startsWith('334') && step === 3) {
        step = 4;
        sendCommand(Buffer.from(pass).toString('base64'));
      } else if (data.startsWith('235') && step === 4) {
        step = 5;
        sendCommand(`MAIL FROM:<${user}>`);
      } else if (data.startsWith('250') && step === 5) {
        step = 6;
        sendCommand(`RCPT TO:<${recipient}>`);
      } else if (data.startsWith('250') && step === 6) {
        step = 7;
        sendCommand('DATA');
      } else if (data.startsWith('354') && step === 7) {
        step = 8;
        const mailContent = [
          `From: "Itulah Website Enquiry" <${user}>`,
          `To: <${recipient}>`,
          `Reply-To: "${name}" <${email}>`,
          `Subject: ${subject || 'New Enquiry / Quote Request'}`,
          `MIME-Version: 1.0`,
          `Content-Type: text/html; charset=UTF-8`,
          ``,
          formattedHtml,
          `.`
        ].join('\r\n');

        sendCommand(mailContent);
      } else if (data.startsWith('250') && step === 8) {
        step = 9;
        sendCommand('QUIT');
      } else if (data.startsWith('221') && step === 9) {
        socket.end();
        resolve({ success: true });
      }
    });

    socket.on('error', (err) => {
      console.error('[SMTP Error]:', err);
      reject(err);
    });

    socket.setTimeout(12000, () => {
      console.warn('[SMTP Timeout]: Connection timed out.');
      socket.destroy();
      resolve({ success: false, reason: 'timeout' });
    });
  });
}
