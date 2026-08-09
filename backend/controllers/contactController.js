import nodemailer from 'nodemailer';
import ContactMessage from '../models/ContactMessage.js';

export const submitContact = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please provide all required fields (name, email, message)' });
  }

  try {
    // 1. Save to Database
    const savedMessage = await ContactMessage.create({ name, email, message });

    // 2. Configure SMTP Credentials (normalize input and handle key variations)
    const user = process.env.EMAIL_USER?.trim().replace(/\.$/, '');
    const pass = process.env.EMAIL_PASS || process.env.EMAIL_APP_PASSWORD;
    const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.EMAIL_PORT || '587', 10);
    const receiver = process.env.EMAIL_RECEIVER?.trim().replace(/\.$/, '') || 'yirgazdofficial@gmail.com';

    // 3. Send Email Notification if Configured
    if (user && pass) {
      // Cloud providers like Render block port 587 (STARTTLS) outbound traffic.
      // Using Nodemailer's built-in 'gmail' service uses SSL over port 465.
      const transporter = nodemailer.createTransport(
        host === 'smtp.gmail.com' || user.endsWith('@gmail.com')
          ? {
              service: 'gmail',
              auth: { user, pass },
            }
          : {
              host,
              port,
              secure: port === 465,
              auth: { user, pass },
            }
      );

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

      try {
        await transporter.sendMail(mailOptions);
        console.log(`[SMTP] Email successfully dispatched to ${receiver}`);
      } catch (emailErr) {
        console.error('[SMTP Error] Failed to send email notification:', emailErr);
      }
    } else {
      console.warn('[SMTP Warning] EMAIL_USER and EMAIL_PASS environment variables are not set. Skipping email dispatch.');
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully! I'll be in touch soon. 🚀",
      data: savedMessage,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server Error' });
  }
};
