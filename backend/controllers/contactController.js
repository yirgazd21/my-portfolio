import dns from 'dns';
import nodemailer from 'nodemailer';
import ContactMessage from '../models/ContactMessage.js';

// Prioritize IPv4 lookups globally to prevent connection failures in IPv6-restricted cloud environments
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

export const submitContact = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please provide all required fields (name, email, message)' });
  }

  try {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS || process.env.EMAIL_APP_PASSWORD;
    const receiver = process.env.EMAIL_RECEIVER || 'yirgazdofficial@gmail.com';

    if (!user || !pass) {
      console.error('[SMTP Error] EMAIL_USER or EMAIL_PASS environment variables are missing.');
      return res.status(500).json({ message: 'Mail service is not configured on the server.' });
    }

    // Configure transporter using port 587 and STARTTLS (secure: false) with family: 4
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      family: 4,
      auth: { user, pass },
      connectionTimeout: 8000,
      socketTimeout: 8000,
    });

    const mailOptions = {
      from: `"${name}" <${user}>`,
      replyTo: email,
      to: receiver,
      subject: `New Portfolio Message from ${name}`,
      text: `New contact message received.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
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
      `,
    };

    // 3. Dispatch Email (Awaited - if it fails, it throws to catch block and fails the API request)
    await transporter.sendMail(mailOptions);
    console.log(`[SMTP] Email successfully dispatched to ${receiver}`);

    // 4. Save to Database (only executed if the email sent successfully)
    const savedMessage = await ContactMessage.create({ name, email, message });

    res.status(201).json({
      success: true,
      message: "Message sent successfully! I'll be in touch soon. 🚀",
      data: savedMessage,
    });
  } catch (err) {
    // Safe error logging (never logs email passwords/secrets)
    console.error('[SMTP Error] Failed to send email notification:', err.message);
    res.status(500).json({
      message: `Failed to send message: ${err.message || 'SMTP Connection Error'}`
    });
  }
};
