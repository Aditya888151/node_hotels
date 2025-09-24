const mongoose = require('mongoose');
require('dotenv').config();

// const local_URL = process.env.LOCALDB;
const mongoURL = process.env.MONGODB_URL ;
console.log('MongoDB URL:', mongoURL ? 'Connected' : 'No URL provided');


mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
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