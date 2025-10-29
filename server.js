const express = require('express');
const cors = require('cors');
// .env file se variables load karne ke liye zaroori
require('dotenv').config(); 
const connectDB = require('./db/db'); 

const app = express();

// Manual CORS headers (fallback) – ensure headers even if errors occur downstream
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ***************************************************************
// DB init (lazy) so serverless cold start won't crash on import
let dbInitPromise = null;
async function initDBOnce() {
  if (!dbInitPromise) {
    dbInitPromise = (async () => {
      await connectDB();
      const Order = require('./db/models/OrderModel');
      try {
        await Order.syncIndexes();
      } catch (err) {
        console.error('Order index sync failed:', (err && err.message) || err);
      }
      try {
        const hasLegacy = await Order.collection.indexExists('serialNumber_1');
        if (hasLegacy) {
          await Order.collection.dropIndex('serialNumber_1');
          console.log('Dropped legacy index serialNumber_1');
        }
      } catch (e) {
        console.error('Legacy index cleanup error:', (e && e.message) || e);
      }
    })().catch(err => { dbInitPromise = null; throw err; });
  }
  return dbInitPromise;
}
const ensureDB = async (_req, _res, next) => {
  try { await initDBOnce(); } catch (e) { console.error('DB init failed:', (e && e.message) || e); }
  next();
};
// ***************************************************************

// NOTE: Purana Database Middleware (app.use(async (req, res, next) => { ... })) HATA DIYA GAYA HAI.

// ***************************************************************
// CORS Configuration (Naye URLs Shamil Hain)
// ***************************************************************
const allowedOrigins = [
    'http://localhost:3000', 
    'https://order-tracking-frontend.vercel.app', 
    'https://order-f.vercel.app',
    'https://order-f-p2r4.vercel.app'
];

const isAllowedOrigin = (origin) => {
    if (!origin) return true; // non-browser (curl, server-side)
    if (allowedOrigins.includes(origin)) return true;
    // Allow any Vercel preview for order-f: e.g., https://order-f-<hash>.vercel.app
    const re = /^https?:\/\/(order-f(?:-[a-z0-9-]+)?\.vercel\.app|localhost(?::\d+)?)/i;
    return re.test(origin);
};

const corsOptions = {
    // Allow all origins (reflect request origin); safe because we validate auth elsewhere
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// Handle OPTIONS preflight universally without wildcard route pattern (Express v5 safe)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
// ***************************************************************

app.use(express.json()); 

// 🚀 ROOT PATH HANDLER (Health Check)
app.get('/', (req, res) => {
    res.status(200).send('Order Tracking System Backend is fully operational and healthy!');
});

// Order Routes
const orderRoutes = require('./routes/orderRoutes'); 
// DB ensured per-request for API routes
app.use('/api/orders', ensureDB, orderRoutes);

// Profit Calculator Routes
const profitRoutes = require('./routes/profitRoutes');
app.use('/api/profit', ensureDB, profitRoutes);

// CRITICAL: Express app ko export karna zaroori hai
module.exports = app;

// Local development: start server if run directly (Vercel will import the app)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
}
