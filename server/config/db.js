// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Don't exit the process, just log the error
    console.error('Failed to connect to MongoDB. Make sure MongoDB is running locally on port 27017');
  }
};

module.exports = connectDB;