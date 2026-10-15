import tls from 'tls';

/**
 * Native Node.js SMTP Client over TLS (Port 465)
 * Sends emails directly to Info@itulahng.com using user-supplied credentials.
 */
export async function sendEmail({ subject, text, html, replyTo, name, email, phone, productType, attachmentUrl }) {
  const host = process.env.SMTP_HOST || 'mail.itulahng.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER || 'Info@itulahng.com';
  const pass = process.env.SMTP_PASS || 'News@090';
  const recipient = process.env.TO_EMAIL || 'Info@itulahng.com';

  const formattedHtml = html || `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f19; color: #f8fafc; padding: 30px; border-radius: 12px; border: 1px solid #dc2626;">
      <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">New Quote / Contact Request</h2>
      <p style="font-size: 16px; color: #3b82f6;"><strong>Category:</strong> ${productType || 'General Enquiry'}</p>
      
      <table style="width: 100%; color: #e2e8f0; border-collapse: collapse; margin-top: 20px;">
        <tr><td style="padding: 8px; font-weight: bold; width: 120px;">Name:</td><td style="padding: 8px;">${name}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;"><a href="mailto:${email}" style="color: #3b82f6;">${email}</a></td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${phone || 'N/A'}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Subject:</td><td style="padding: 8px;">${subject}</td></tr>
      </table>

      <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px; margin-top: 20px;">
        <h4 style="margin-top: 0; color: #dc2626;">Message:</h4>
        <p style="white-space: pre-wrap; line-height: 1.6;">${text}</p>
      </div>

      ${attachmentUrl ? `<p style="margin-top: 20px;"><strong>Attachment:</strong> <a href="${process.env.NEXT_PUBLIC_URL || 'https://www.itulahng.com'}${attachmentUrl}" style="color: #3b82f6;" target="_blank">View File Attachment</a></p>` : ''}
      
      <p style="font-size: 12px; color: #94a3b8; margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">Sent automatically from Itulah Nigeria Limited Website</p>
    </div>
  `;

  return new Promise((resolve, reject) => {
    let responseLog = '';

    const socket = tls.connect(port, host, { rejectUnauthorized: false, servername: host }, () => {
      console.log(`[SMTP] Connected to ${host}:${port}`);
    });

    socket.setEncoding('utf8');

    const sendCommand = (cmd) => {
      console.log(`[SMTP Out]: ${cmd.trim()}`);
      socket.write(cmd + '\r\n');
    };

    let step = 0;

    socket.on('data', (data) => {
      responseLog += data;
      console.log(`[SMTP In]: ${data.trim()}`);

      if (data.startsWith('220') && step === 0) {
        step = 1;
        sendCommand(`EHLO ${host}`);
      } else if (data.startsWith('250') && step === 1) {
        step = 2;
        sendCommand('AUTH LOGIN');
      } else if (data.startsWith('334') && step === 2) {
        step = 3;
        // Send base64 username
        sendCommand(Buffer.from(user).toString('base64'));
      } else if (data.startsWith('334') && step === 3) {
        step = 4;
        // Send base64 password
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

    socket.setTimeout(10000, () => {
      console.warn('[SMTP Timeout]: Connection timed out.');
      socket.destroy();
      resolve({ success: false, reason: 'timeout' });
    });
  });
}
