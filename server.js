const express = require('express');
const cors = require('cors');
// .env file se variables load karne ke liye zaroori
require('dotenv').config(); 
const connectDB = require('./db/db'); 

const app = express();

// ***************************************************************
// 🔑 CRITICAL FIX: DATABASE CONNECTION KO SIRF EK BAAR KARNA HAI
// connectDB() ko yahan call karne se yeh sirf ek baar chalta hai
// jab Vercel function initialize hota hai.
connectDB(); 
// ***************************************************************

// NOTE: Purana Database Middleware (app.use(async (req, res, next) => { ... })) HATA DIYA GAYA HAI.

// ***************************************************************
// CORS Configuration 
// ***************************************************************
const allowedOrigins = [
    'http://localhost:3000', 
    'https://order-tracking-frontend.vercel.app', 
    'https://order-tracking-system-np42.vercel.app' 
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by CORS for origin: ${origin}`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
// ***************************************************************

app.use(express.json()); 

// 🚀 ROOT PATH HANDLER (Health Check)
app.get('/', (req, res) => {
    res.status(200).send('Order Tracking System Backend is fully operational and healthy!');
});

// Test Route
app.get('/hello', (req, res) => {
    res.send('Order Tracking Backend is running!');
});

// Order Routes
const orderRoutes = require('./routes/orderRoutes'); 
// CRITICAL FIX: Express ko batao ki /orders request ko root '/' ki tarah treat kare.
app.use('/', orderRoutes); 

// CRITICAL: Express app ko export karna zaroori hai
module.exports = app;