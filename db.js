const mongoose = require('mongoose');
require('dotenv').config();

// const local_URL = process.env.LOCALDB;
const mongoURL = process.env.MONGODB_URL || 'mongodb+srv://singhaditya8052_db_user:Aditya8892@cluster0.h42azqe.mongodb.net/restaurant';
console.log('Connecting to MongoDB...');


if (mongoURL) {
  mongoose.connect(mongoURL)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));
} else {
  console.error('❌ No MongoDB URL provided');
}

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MongoDB server');
});

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

module.exports = db;