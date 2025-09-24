require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');



const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:4000', 
    'https://node-hotels-vpvw.vercel.app',

  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static('public'));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve static files directly
app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'style.css'));
});

app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'script.js'));
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api', (req, res) => {
  res.json({status: 'ok', message: 'Restaurant API'});
});

// Test route
app.get('/test', (req, res) => {
  res.json({status: 'ok', message: 'Server is working', timestamp: new Date()});
});


const menuRoutes = require('./routes/menuRoutes');
const personRoutes = require('./routes/personRoutes');


// API Routes
app.use('/person', personRoutes);
app.use('/menu', menuRoutes);
app.use('/api/person', personRoutes);
app.use('/api/menu', menuRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;