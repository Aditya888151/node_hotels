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

router.put('/:id', async (req, res) => {
  try {
    const menuId = req.params.id;
    const { name, price, category, taste, is_drink, ingredients, num_sales } = req.body;
    const updatedMenu = { name, price, category, taste, is_drink, ingredients, num_sales };
    const response = await Menu.findByIdAndUpdate(menuId, updatedMenu, {
      new: true,
      runValidators: true,
    });

    if (!response) {
      return res.status(404).json({error: 'Menu item not found'});
    }

    console.log('Menu item updated');
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Internal server error'});
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const menuId = req.params.id;
    const response = await Menu.findByIdAndDelete(menuId);
    if (!response) {
      return res.status(404).json({error: 'Menu item not found'});
    }
    console.log('Menu item deleted');
    res.status(200).json({message: 'Menu item deleted successfully'});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Internal server error'});
  }
});

module.exports = router;