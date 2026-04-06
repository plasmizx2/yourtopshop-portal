import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_PIN = process.env.ADMIN_PIN || '1234';
const IS_DEV = process.env.DEV === 'true';

function sendIfExists(res, absolutePath, contentType) {
  try {
    if (!fs.existsSync(absolutePath)) return false;
    if (contentType) res.type(contentType);
    // Use readFile+send to avoid platform-specific sendFile issues in some hosts.
    const buf = fs.readFileSync(absolutePath);
    res.send(buf);
    return true;
  } catch {
    return false;
  }
}


// Stripe init
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

// Bookings file path (stored in /data for persistence)
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const BLOCKED_FILE = path.join(DATA_DIR, 'blocked.json');
const QUOTES_FILE = path.join(DATA_DIR, 'quotes.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

// Helper: read bookings
function readBookings() {
  try {
    const data = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper: write bookings
function writeBookings(bookings) {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

function readBlocked() {
  try {
    const data = fs.readFileSync(BLOCKED_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { dates: [], times: [] };
  }
}

function writeBlocked(blocked) {
  fs.writeFileSync(BLOCKED_FILE, JSON.stringify(blocked, null, 2));
}

function readQuotes() {
  try {
    const data = fs.readFileSync(QUOTES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeQuotes(quotes) {
  fs.writeFileSync(QUOTES_FILE, JSON.stringify(quotes, null, 2));
}

function readInquiries() {
  try {
    const data = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeInquiries(inquiries) {
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));
}

// Webhook endpoint MUST come before express.json() middleware
// Stripe sends raw body for signature verification
app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  if (endpointSecret && sig) {
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    // No webhook secret configured — parse the body directly (dev mode)
    event = JSON.parse(req.body.toString());
  }

  // Handle checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata || {};

    const booking = {
      id: session.id,
      customerEmail: session.customer_details?.email || metadata.email || 'N/A',
      customerName: session.customer_details?.name || 'N/A',
      service: metadata.service || 'N/A',
      date: metadata.date || 'N/A',
      time: metadata.time || 'N/A',
      price: metadata.price || 'N/A',
      paymentStatus: session.payment_status,
      createdAt: new Date().toISOString(),
      stripePaymentId: session.payment_intent,
    };

    const bookings = readBookings();
    bookings.push(booking);
    writeBookings(bookings);

    console.log(`✅ Booking confirmed: ${booking.service} on ${booking.date} at ${booking.time}`);
  }

  res.json({ received: true });
});

// Standard middleware (AFTER webhook route)
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  const distPath = path.join(__dirname, 'dist');
  const publicPath = path.join(__dirname, 'public');
  res.json({
    ok: true,
    commit: process.env.RENDER_GIT_COMMIT || null,
    distExists: fs.existsSync(distPath),
    publicExists: fs.existsSync(publicPath),
    distSitemap: fs.existsSync(path.join(distPath, 'sitemap.xml')),
    publicSitemap: fs.existsSync(path.join(publicPath, 'sitemap.xml')),
    distHero: fs.existsSync(path.join(distPath, 'images', 'hero.jpg')),
    publicHero: fs.existsSync(path.join(publicPath, 'images', 'hero.jpg')),
  });
});

// ──────────────────────────────────────────────
// API: Create Checkout Session
// ──────────────────────────────────────────────
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { service, price, date, time, successUrl, cancelUrl } = req.body;

    // Parse price string like "$140.00+" or "$99.99+" into cents
    const priceClean = price.replace(/[^0-9.]/g, '');
    const amountCents = Math.round(parseFloat(priceClean) * 100);

    if (!amountCents || amountCents <= 0) {
      return res.status(400).json({ error: 'Invalid price' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      invoice_creation: { enabled: true },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Your Top Shop — ${service}`,
              description: `Appointment: ${date} at ${time}`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        service,
        price,
        date,
        time,
      },
      success_url: successUrl || 'http://localhost:5173/book-service?success=true',
      cancel_url: cancelUrl || 'http://localhost:5173/book-service?canceled=true',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ──────────────────────────────────────────────
// API: Get Bookings (Admin)
// ──────────────────────────────────────────────
app.get('/api/bookings', (req, res) => {
  const pin = req.headers['x-admin-pin'];

  if (pin !== ADMIN_PIN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const bookings = readBookings();
  // Return newest first
  res.json(bookings.reverse());
});

// ──────────────────────────────────────────────
// API: Manual booking (fallback for Venmo/CashApp)
// ──────────────────────────────────────────────
app.post('/api/manual-booking', (req, res) => {
  const { service, date, time, price, method, customerName } = req.body;

  const booking = {
    id: `manual_${Date.now()}`,
    customerEmail: 'N/A (manual)',
    customerName: customerName || 'Walk-in',
    service: service || 'N/A',
    date: date || 'N/A',
    time: time || 'N/A',
    price: price || 'N/A',
    paymentStatus: `pending (${method || 'manual'})`,
    createdAt: new Date().toISOString(),
    stripePaymentId: null,
  };

  const bookings = readBookings();
  bookings.push(booking);
  writeBookings(bookings);

  console.log(`📋 Manual booking logged: ${booking.service} via ${method}`);
  res.json({ success: true, booking });
});

// ──────────────────────────────────────────────
// API: Get Availability (Public) 
// ──────────────────────────────────────────────
app.get('/api/availability', (req, res) => {
  const bookings = readBookings();
  const blocked = readBlocked();

  // Return booked time slots (excluding canceled ones)
  const bookedSlots = bookings
    .filter(b => b.paymentStatus !== 'canceled')
    .map(b => ({ date: b.date, time: b.time }));

  res.json({
    bookedSlots,
    blockedDays: blocked.dates || [],
    blockedTimes: blocked.times || [],
  });
});

// ──────────────────────────────────────────────
// API: Admin Scheduling Controls 
// ──────────────────────────────────────────────
app.post('/api/admin/cancel-booking', (req, res) => {
  const pin = req.headers['x-admin-pin'];

  if (pin !== ADMIN_PIN) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.body;
  const bookings = readBookings();
  const index = bookings.findIndex(b => b.id === id);
  
  if (index !== -1) {
    bookings[index].paymentStatus = 'canceled';
    writeBookings(bookings);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Booking not found' });
  }
});

app.post('/api/admin/blocks', (req, res) => {
  const pin = req.headers['x-admin-pin'];

  if (pin !== ADMIN_PIN) return res.status(401).json({ error: 'Unauthorized' });

  const { date, time } = req.body;
  const blocked = readBlocked();

  if (date && time) {
    blocked.times.push({ date, time });
  } else if (date) {
    if (!blocked.dates.includes(date)) blocked.dates.push(date);
  }

  writeBlocked(blocked);
  res.json({ success: true, blocked });
});

app.post('/api/admin/remove-block', (req, res) => {
  const pin = req.headers['x-admin-pin'];

  if (pin !== ADMIN_PIN) return res.status(401).json({ error: 'Unauthorized' });

  const { date, time } = req.body;
  let blocked = readBlocked();

  if (date && time) {
    blocked.times = blocked.times.filter(t => !(t.date === date && t.time === time));
  } else if (date) {
    blocked.dates = blocked.dates.filter(d => d !== date);
  }

  writeBlocked(blocked);
  res.json({ success: true, blocked });
});

app.get('/api/admin/blocks', (req, res) => {
  const pin = req.headers['x-admin-pin'];

  if (pin !== ADMIN_PIN) return res.status(401).json({ error: 'Unauthorized' });
  
  res.json(readBlocked());
});

// ──────────────────────────────────────────────
// API: Quotes
// ──────────────────────────────────────────────
app.post('/api/quotes', (req, res) => {
  const { name, email, phone, year, make, model, notes, service } = req.body;
  const quotes = readQuotes();
  quotes.push({
    id: `quote_${Date.now()}`,
    name, email, phone, year, make, model, notes, service,
    status: 'pending',
    createdAt: new Date().toISOString()
  });
  writeQuotes(quotes);
  res.json({ success: true });
});

app.get('/api/admin/quotes', (req, res) => {
  const pin = req.headers['x-admin-pin'];
  if (pin !== ADMIN_PIN) return res.status(401).json({ error: 'Unauthorized' });
  
  res.json(readQuotes().reverse());
});

app.post('/api/admin/quotes/status', (req, res) => {
  const pin = req.headers['x-admin-pin'];
  if (pin !== ADMIN_PIN) return res.status(401).json({ error: 'Unauthorized' });

  const { id, status } = req.body;
  const quotes = readQuotes();
  const index = quotes.findIndex(q => q.id === id);
  if (index !== -1) {
    quotes[index].status = status;
    writeQuotes(quotes);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Quote not found' });
  }
});

// ──────────────────────────────────────────────
// API: inquiries
// ──────────────────────────────────────────────
app.post('/api/inquiries', (req, res) => {
  const inquiry = {
    id: 'inq_' + Date.now(),
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  const inquiries = readInquiries();
  inquiries.push(inquiry);
  writeInquiries(inquiries);
  res.json({ success: true });
});

app.get('/api/admin/inquiries', (req, res) => {
  const pin = req.headers['x-admin-pin'];
  if (pin !== ADMIN_PIN) return res.status(401).json({ error: 'Unauthorized' });
  res.json(readInquiries());
});

app.post('/api/admin/inquiries/status', (req, res) => {
  const pin = req.headers['x-admin-pin'];
  if (pin !== ADMIN_PIN) return res.status(401).json({ error: 'Unauthorized' });
  const { id, status } = req.body;
  const inquiries = readInquiries();
  const idx = inquiries.findIndex(q => q.id === id);
  if (idx !== -1) {
    inquiries[idx].status = status;
    writeInquiries(inquiries);
  }
  res.json({ success: true });
});

// ─── Production Catch-all ───
// In production, serve the built React files
if (!IS_DEV) {
  const distPath = path.join(__dirname, 'dist');
  const publicPath = path.join(__dirname, 'public');

  // Explicitly serve SEO/static assets first so they never hit SPA routing.
  app.get('/robots.txt', (req, res) => {
    const fromDist = path.join(distPath, 'robots.txt');
    const fromPublic = path.join(publicPath, 'robots.txt');
    if (sendIfExists(res, fromDist, 'text/plain')) return;
    if (sendIfExists(res, fromPublic, 'text/plain')) return;
    res.status(404).type('text/plain').send('Not found');
  });

  app.get('/sitemap.xml', (req, res) => {
    const fromDist = path.join(distPath, 'sitemap.xml');
    const fromPublic = path.join(publicPath, 'sitemap.xml');
    if (sendIfExists(res, fromDist, 'application/xml')) return;
    if (sendIfExists(res, fromPublic, 'application/xml')) return;
    res.status(404).type('application/xml').send('<?xml version="1.0" encoding="UTF-8"?><error>Not found</error>');
  });

  // Serve any images placed in public/images (copied into dist/images at build time),
  // and also allow direct serving from public in case dist doesn't include them.
  app.use('/images', express.static(path.join(distPath, 'images'), { fallthrough: true }));
  app.use('/images', express.static(path.join(publicPath, 'images'), { fallthrough: true }));

  // Serve the built app.
  app.use(express.static(distPath, { fallthrough: true }));

  // Fallback catch-all for SPA routing (avoids wildcard regex issues)
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n🚀 Your Top Shop API running on http://localhost:${PORT}`);
  console.log(`   Stripe Checkout: POST /api/create-checkout-session`);
  console.log(`   Webhook:         POST /api/webhook`);
  console.log(`   Admin Bookings:  GET  /api/bookings\n`);
});
