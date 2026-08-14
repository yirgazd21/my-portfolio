import nodemailer from 'nodemailer';

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS || process.env.EMAIL_APP_PASSWORD;
const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
const port = parseInt(process.env.EMAIL_PORT || '465', 10); // Defaults to port 465 (SSL) for Render compatability

export const transporter = (user && pass)
  ? nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      family: 4, // Forces IPv4 to bypass cloud IPv6 ENETUNREACH issues
      auth: { user, pass },
      connectionTimeout: 8000,
      socketTimeout: 8000,
    })
  : null;
