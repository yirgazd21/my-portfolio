import { sendEmail, isConfigured } from '../config/mail.js';
import ContactMessage from '../models/ContactMessage.js';

export const submitContact = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please provide all required fields (name, email, message)' });
  }

  try {
    if (!isConfigured) {
      console.error('[Email Error] Email service is not configured. Missing API keys.');
      return res.status(500).json({ message: 'Mail service is not configured on the server.' });
    }

    // 1. Dispatch Email over HTTP API (Awaited - throws to catch block if it fails)
    await sendEmail({ name, email, message });
    console.log(`[Email Service] Notification email successfully sent.`);

    // 2. Save message to database (only executed if email dispatch succeeded)
    const savedMessage = await ContactMessage.create({ name, email, message });

    res.status(201).json({
      success: true,
      message: "Message sent successfully! I'll be in touch soon. 🚀",
      data: savedMessage,
    });
  } catch (err) {
    console.error('[Email Error] Failed to send email notification:', err.message);
    res.status(500).json({
      message: `Failed to send message: ${err.message || 'Email Service Error'}`
    });
  }
};
