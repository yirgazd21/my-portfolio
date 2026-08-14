const RESEND_API_KEY = process.env.RESEND_API_KEY;
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const EMAIL_RECEIVER = process.env.EMAIL_RECEIVER || 'yirgazdofficial@gmail.com';

export const isConfigured = !!(RESEND_API_KEY || BREVO_API_KEY);

export const verifySMTP = async () => {
  if (RESEND_API_KEY) {
    console.log('✅ [Email Service] Resend API configured successfully.');
    return true;
  } else if (BREVO_API_KEY) {
    console.log('✅ [Email Service] Brevo API configured successfully.');
    return true;
  } else {
    console.warn('⚠️ [Email Warning] Neither RESEND_API_KEY nor BREVO_API_KEY is configured in environment variables. Contact emails will be skipped.');
    return false;
  }
};

export const sendEmail = async ({ name, email, message }) => {
  const subject = `New Portfolio Message from ${name}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 12px;">
      <h2 style="color: #0ea5e9; margin-top: 0;">New Message from Portfolio</h2>
      <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 16px 0;" />
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #0ea5e9;">${email}</a></p>
      <p><strong>Message:</strong></p>
      <div style="background-color: #f4f4f5; padding: 15px; border-radius: 8px; font-style: italic; white-space: pre-wrap; line-height: 1.5; color: #27272a;">${message}</div>
      <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0 16px 0;" />
      <p style="font-size: 11px; color: #71717a; text-align: center; margin: 0;">Sent automatically from your portfolio developer app.</p>
    </div>
  `;

  if (RESEND_API_KEY) {
    // Send email using Resend HTTP API (Port 443)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio <onboarding@resend.dev>',
        to: EMAIL_RECEIVER,
        reply_to: email,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `Resend API returned status ${response.status}`);
    }

    return await response.json();
  } else if (BREVO_API_KEY) {
    // Send email using Brevo HTTP API (Port 443)
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Portfolio Contact Form', email: EMAIL_RECEIVER },
        to: [{ email: EMAIL_RECEIVER }],
        replyTo: { email, name },
        subject,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `Brevo API returned status ${response.status}`);
    }

    return await response.json();
  } else {
    throw new Error('Email service is not configured. Missing RESEND_API_KEY or BREVO_API_KEY.');
  }
};
