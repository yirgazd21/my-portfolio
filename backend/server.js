import 'dotenv/config';
import dns from 'dns';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import routes from './routes/index.js';
import { transporter } from './config/mail.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Render/cloud runtimes can prefer IPv6 for smtp.gmail.com, which fails here.
// Prefer IPv4 before any SMTP verification or request handling runs.
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

await connectDB();

const app = express();

const allowedOrigins = [
  ...(process.env.CLIENT_URLS || '').split(','),
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]
  .map((origin) => origin?.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients and same-origin requests with no Origin header.
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some((allowedOrigin) => allowedOrigin === origin);
    if (isAllowed) return callback(null, true);

    console.warn(`[CORS] Blocked request from origin: ${origin}`);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api', routes);

// Health check
app.get('/', (_req, res) => res.json({ status: 'Portfolio API is running 🚀' }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

const verifySMTP = async () => {
  if (!transporter) {
    console.warn('⚠️ [SMTP Warning] EMAIL_USER and/or EMAIL_PASS not configured. Contact messages will fail to email.');
    return;
  }

  try {
    await transporter.verify();
    console.log('✅ [SMTP] Mail server connection verified successfully.');
  } catch (err) {
    console.error('❌ [SMTP Connection Error] Failed to connect to mail server on startup:', err.message);
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`[CORS] Allowed origins: ${allowedOrigins.join(', ') || '(none configured)'}`);
  verifySMTP();
});
