// Backend/server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/db');

// Database Connection
connectDB(); 

const app = express();

// Middlewares
app.use(cors()); // CORS enable karein taaki front-end access kar sake
app.use(express.json()); // JSON data ko parse karne ke liye

// Test Route
app.get('/', (req, res) => {
    res.send('Order Tracking Backend is running!');
});

// Order Routes ko yahan import karenge (Agli step mein)
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));