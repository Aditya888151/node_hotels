const mongoose = require('mongoose');
require('dotenv').config();

// const local_URL = process.env.LOCALDB;
const mongoURL = process.env.MONGODB_URL || process.env.MONGOSH_URL || 'mongodb://localhost:27017/restaurant';
console.log('MongoDB URL:', mongoURL ? 'Connected' : 'No URL provided');


mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
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