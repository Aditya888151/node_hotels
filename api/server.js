const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS\napp.use(cors({\n  origin: [\n    'http://localhost:3000',\n    'http://localhost:4000', \n    'https://node-hotels-vpvw.vercel.app'\n  ],\n  credentials: true,\n  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],\n  allowedHeaders: ['Content-Type', 'Authorization']\n}));\n\napp.use(express.json());\napp.use(express.static('public'));\n\n// Database connection\nconst mongoose = require('mongoose');\nconst mongoURL = process.env.MONGODB_URL || 'mongodb+srv://singhaditya8052_db_user:Aditya8892@cluster0.h42azqe.mongodb.net/restaurant';\n\nmongoose.connect(mongoURL)\n.then(() => console.log('MongoDB connected'))\n.catch(err => console.error('MongoDB error:', err));\n\n// Routes\nconst menuRoutes = require('../routes/menuRoutes');\nconst personRoutes = require('../routes/personRoutes');\n\napp.use('/person', personRoutes);\napp.use('/menu', menuRoutes);\napp.use('/api/person', personRoutes);\napp.use('/api/menu', menuRoutes);\n\n// Static files\napp.get('/', (req, res) => {\n  res.sendFile(path.join(__dirname, '../public', 'index.html'));\n});\n\napp.get('/test', (req, res) => {\n  res.json({status: 'ok', message: 'Server working', timestamp: new Date()});\n});\n\nmodule.exports = app;