import nodemailer from 'nodemailer';
import dns from 'dns';

const resolveSmtpHost = (hostname) => {
  return new Promise((resolve) => {
    dns.lookup(hostname, { family: 4 }, (err, address) => {
      if (err) {
        console.error(`[SMTP DNS Warning] Failed to resolve ${hostname} to IPv4:`, err.message);
        resolve(hostname); // Fallback to raw hostname
      } else {
        console.log(`[SMTP DNS] Successfully resolved ${hostname} to IPv4 address: ${address}`);
        resolve(address);
      }
    });
  });
};

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS || process.env.EMAIL_APP_PASSWORD;
const rawHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
const port = parseInt(process.env.EMAIL_PORT || '465', 10);

// Resolve SMTP host to IPv4 address on module load to bypass Node.js IPv6 routing bug
const hostIp = (rawHost === 'smtp.gmail.com') ? await resolveSmtpHost(rawHost) : rawHost;

export const transporter = (user && pass)
  ? nodemailer.createTransport({
      host: hostIp,
      port,
      secure: port === 465,
      family: 4, // Enforce IPv4 socket connection
      auth: { user, pass },
      connectionTimeout: 8000,
      socketTimeout: 8000,
      tls: {
        // Enforce Server Name Indication (SNI) to pass TLS certificate validation when using an IP host
        servername: rawHost,
      },
    })
  : null;
