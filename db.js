const mongoose = require('mongoose');
require('dotenv').config();

// const local_URL = process.env.LOCALDB;
const mongoURL = process.env.MONGODB_URL || 'mongodb+srv://singhaditya8052_db_user:Aditya8892@cluster0.h42azqe.mongodb.net/restaurant';
console.log('MongoDB URL:', mongoURL ? 'URL found' : 'No URL provided');
console.log('Environment:', process.env.NODE_ENV || 'development');


mongoose.connect(mongoURL)
.then(() => {
    console.log('MongoDB connection successful');
})
.catch(err => {
    console.error('MongoDB connection failed:', err.message);
    // Don't exit in serverless environment
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
    }
});

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