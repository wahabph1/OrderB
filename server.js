const express = require('express');
const cors = require('cors');
// .env file se variables load karne ke liye zaroori
require('dotenv').config(); 
const connectDB = require('./db/db'); 

const app = express();

// ***************************************************************
// 🔑 CRITICAL FIX: DATABASE CONNECTION KO SIRF EK BAAR CALL KIYA GAYA HAI
// Yeh Vercel par server ko crash hone se bachayega aur 500 error theek karega.
connectDB(); 
// ***************************************************************

// NOTE: Purana Database Middleware (app.use(async (req, res, next) => { ... })) HATA DIYA GAYA HAI.

// ***************************************************************
// CORS Configuration (Naye URLs Shamil Hain)
// ***************************************************************
const allowedOrigins = [
    'http://localhost:3000', 
    // Purana deployed URL
    'https://order-tracking-frontend.vercel.app', 
    // Aapka latest deployed frontend URL
    'https://order-f.vercel.app' 
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

// Order Routes
const orderRoutes = require('./routes/orderRoutes'); 
// Yeh line Vercel routing aur /api/orders path ko handle karti hai.
app.use('/api/orders', orderRoutes); 

// CRITICAL: Express app ko export karna zaroori hai
module.exports = app;