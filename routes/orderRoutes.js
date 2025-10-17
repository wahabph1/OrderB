// Backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../db/models/OrderModel');

// 1. READ: Saare Orders Lao (Filtering aur Searching Support ke saath)
router.get('/', async (req, res) => {
    try {
        // URL query se 'owner' aur 'search' parameters nikalna
        const { owner, search } = req.query; 
        
        const filter = {};
        
        // --- 1. Owner Filter Logic ---
        if (owner && owner !== 'All') { 
            filter.owner = owner;
        }

        // --- 2. Search Logic (by Serial Number) ---
        if (search) {
            // Regular Expression ka use: search string ko case-insensitive tareeqe se dhoondhna
            filter.serialNumber = { $regex: search, $options: 'i' };
        }

        // Filter object ko use karke orders dhoondhna
        const orders = await Order.find(filter).sort({ orderDate: -1 }); 
        
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. CREATE: Naya Order Add Karo
router.post('/', async (req, res) => {
    const order = new Order({
        serialNumber: req.body.serialNumber,
        owner: req.body.owner,
    });
    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 3. UPDATE: Order Status/Details Update Karo
router.put('/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 4. DELETE: Order Delete Karo
router.delete('/:id', async (req, res) => {
    try {
        const result = await Order.findByIdAndDelete(req.params.id);
        
        if (!result) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order successfully deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;