import { Resend } from 'resend';

export type ContactPayload = {
  name: string;
  email: string;
  subject?: string;
  body: string;
};

export async function sendContactEmail(payload: ContactPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  const from = process.env.RESEND_FROM || 'Portfolio Contact <onboarding@resend.dev>';

  if (!apiKey || !to) {
    return { sent: false, reason: 'no_resend_key' as const };
  }

  const resend = new Resend(apiKey);
  const subject = payload.subject?.trim()
    ? `[Portfolio] ${payload.subject}`
    : '[Portfolio] New message';

  const html = `
    <div style="font-family:Inter,system-ui,sans-serif;background:#0a0c14;color:#e7e7ea;padding:32px;border-radius:16px;max-width:640px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;height:42px;width:42px;border-radius:999px;background:linear-gradient(135deg,#ffcc70,#a86f17);color:#1a1100;font-weight:700;line-height:42px;font-size:20px;">M</div>
        <h2 style="font-family:Georgia,serif;font-size:22px;color:#ffe1a8;margin:14px 0 4px;">New Portfolio Message</h2>
        <p style="color:#9aa0ad;margin:0;font-size:13px;">Someone reached out via your contact form.</p>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:18px;">
        <tr><td style="padding:8px 0;color:#9aa0ad;font-size:12px;text-transform:uppercase;letter-spacing:.18em;width:90px;">Name</td><td style="color:#fff;">${escape(payload.name)}</td></tr>
        <tr><td style="padding:8px 0;color:#9aa0ad;font-size:12px;text-transform:uppercase;letter-spacing:.18em;">Email</td><td><a style="color:#ffcc70;text-decoration:none;" href="mailto:${escape(payload.email)}">${escape(payload.email)}</a></td></tr>
        ${payload.subject ? `<tr><td style="padding:8px 0;color:#9aa0ad;font-size:12px;text-transform:uppercase;letter-spacing:.18em;">Subject</td><td style="color:#fff;">${escape(payload.subject)}</td></tr>` : ''}
      </table>

      <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(245,179,66,.5),transparent);margin:18px 0;"></div>

      <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);padding:18px;border-radius:12px;">
        <p style="margin:0;white-space:pre-wrap;line-height:1.6;color:#e7e7ea;">${escape(payload.body)}</p>
      </div>

      <p style="margin-top:24px;color:#9aa0ad;font-size:12px;text-align:center;">
        Sent from your portfolio at ${new Date().toLocaleString()}
      </p>
    </div>
  `;

  const text = `New message from ${payload.name} <${payload.email}>\n${
    payload.subject ? `Subject: ${payload.subject}\n` : ''
  }\n${payload.body}`;

  try {
    await resend.emails.send({
      from,
      to,
      replyTo: payload.email,
      subject,
      html,
      text,
    });
    return { sent: true as const };
  } catch (e: any) {
    return { sent: false as const, reason: 'send_failed' as const, error: e?.message };
  }
}

function escape(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
