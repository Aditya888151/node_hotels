require('dotenv').config();
const express = require('express');
const db = require('./db');



const app = express();
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({status: 'ok', message: 'Restaurant API'});
});


const menuRoutes = require('./routes/menuRoutes');
const personRoutes = require('./routes/personRoutes');


app.use('/person',personRoutes);
app.use('/menu', menuRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});