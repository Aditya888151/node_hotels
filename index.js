const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// MongoDB connection
const mongoURL = 'mongodb+srv://singhaditya8052_db_user:Aditya8892@cluster0.h42azqe.mongodb.net/restaurant';
mongoose.connect(mongoURL);

// Models
const Person = require('./models/person');
const Menu = require('./models/menu');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', db: mongoose.connection.readyState });
});

// Person routes
app.get('/person', async (req, res) => {
  try {
    const people = await Person.find();
    res.json(people);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/person', async (req, res) => {
  try {
    const person = new Person(req.body);
    await person.save();
    res.json(person);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/person/:id', async (req, res) => {
  try {
    const person = await Person.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(person);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/person/:id', async (req, res) => {
  try {
    await Person.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Menu routes
app.get('/menu', async (req, res) => {
  try {
    const menu = await Menu.find();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/menu', async (req, res) => {
  try {
    const menu = new Menu(req.body);
    await menu.save();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/menu/:id', async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/menu/:id', async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;