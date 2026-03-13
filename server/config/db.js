const mongoose = require('mongoose');
const { loadEnv } = require('./env');

const connectDB = async () => {
  loadEnv();

  const mongoUri = process.env.MONGO_URI;
  if (typeof mongoUri !== 'string' || !mongoUri.trim()) {
    throw new Error(
      'MONGO_URI is missing. Add it to your .env file (example: mongodb://localhost:27017/attendance_db).'
    );
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
