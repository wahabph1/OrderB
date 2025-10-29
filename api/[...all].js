const app = require('../server');

// Vercel Node.js Serverless Function catch-all for Express app
// This will handle all routes under /api/*
module.exports = (req, res) => {
  return app(req, res);
};
