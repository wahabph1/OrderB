const app = require('../server');

// Vercel Node.js Serverless Function catch-all for Express app with robust CORS
module.exports = (req, res) => {
  // Basic CORS at the edge (before Express) so preflight never fails
  try {
    const origin = req.headers.origin;
    const allowRegex = /^https?:\/\/(order-f(?:-[a-z0-9-]+)?\.vercel\.app|localhost(?::\d+)?)/i;
    const allowList = new Set([
      'https://order-f.vercel.app',
      'https://order-f-ahp6.vercel.app',
      'https://order-f-p2r4.vercel.app',
      'https://order-tracking-frontend.vercel.app'
    ]);
    if (origin && (allowRegex.test(origin) || allowList.has(origin))) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    }
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }
  } catch {}

  // Ensure Express sees /api prefix
  try {
    if (!req.url.startsWith('/api')) {
      const suffix = req.url === '/' ? '' : req.url;
      req.url = '/api' + suffix;
    }
  } catch {}

  return app(req, res);
};
