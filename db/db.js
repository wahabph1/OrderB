// Backend/db/db.js
const mongoose = require('mongoose');

// Prefer environment variables on deploy; fallback to local/dev
const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/order_tracker';

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error && error.message ? error.message : error);
    // Do not exit hard on serverless; throw to surface error
    throw error;
  }
};

module.exports = connectDB;
