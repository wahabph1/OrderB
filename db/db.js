// Backend/db/db.js
const mongoose = require('mongoose');

// Apne Local MongoDB ka URL use karein
// (Agar aapne port 27017 par 'order_tracker' naam ka database nahi banaya hai, toh yeh use karein)
// const uri = 'mongodb://localhost:27017/order_tracker'; 
const uri = 'mongodb+srv://aw599822:xCDMNmoMGLFuy8sU@cluster0.pujyprm.mongodb.net/'; 

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully locally!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    // Agar connection fail ho, toh application exit kar do
    process.exit(1); 
  }
};

module.exports = connectDB;