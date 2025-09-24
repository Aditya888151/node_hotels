const express = require('express');
const router = express.Router();
const Menu = require('./../models/menu');


router.post('/', async (req, res) => {
  try {
    const newMenu = new Menu(req.body);
    const saved = await newMenu.save();
    console.log('Saved to restaurant.menu:', saved.name);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({error: 'Server error'});
  }
});

router.get('/', async (req, res) => {
  try {
    const menu = await Menu.find();
    res.json(menu);
  } catch (err) {
    res.status(500).json({error: 'Server error'});
  }
});

module.exports = router;