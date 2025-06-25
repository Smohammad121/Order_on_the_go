const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant'); // Adjust path if needed

// 🔍 Search restaurant by name (case-insensitive)
router.get('/search-restaurant/:name', async (req, res) => {
  const name = req.params.name.toLowerCase();

  try {
    const restaurant = await Restaurant.findOne({
      name: { $regex: new RegExp(name, 'i') }
    });

    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
