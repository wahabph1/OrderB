// Backend/models/OrderModel.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    serialNumber: {
        type: String,
        required: true,
        unique: true // Har order ka serial number alag hoga
    },
    orderDate: {
        type: Date,
        default: Date.now 
    },
    deliveryStatus: {
        type: String,
        required: true,
        default: 'Pending',
        // Aap sirf in teen status mein se koi ek hi use kar sakte hain
        enum: ['Pending', 'In Transit', 'Delivered', 'Cancelled'] 
    },
    owner: {
        type: String,
        required: true,
        // Sirf in teen owners mein se koi ek hi ho sakta hai
        enum: ['Emirate Essentials', 'Ahsan', 'Habibi Tools']
    }
}, { timestamps: true }); // yeh automatic 'createdAt' aur 'updatedAt' add kar dega

module.exports = mongoose.model('Order', OrderSchema);