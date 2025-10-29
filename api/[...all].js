const app = require('../server');

// Vercel Node.js Serverless Function catch-all for Express app
// Vercel strips the "/api" base path when invoking this function.
// Restore it so our Express routes like "/api/orders" continue to work.
module.exports = (req, res) => {
  try {
    if (!req.url.startsWith('/api')) {
      const suffix = req.url === '/' ? '' : req.url;
      req.url = '/api' + suffix;
    }
  } catch {}
  return app(req, res);
};
