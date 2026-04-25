const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/seed', async (req, res) => {
  try {
    await Product.deleteMany();
    await Product.insertMany([
      { name: 'Wireless Headphones', price: 1999, description: 'High quality wireless headphones with noise cancellation', category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', stock: 10 },
      { name: 'Running Shoes', price: 2499, description: 'Comfortable running shoes for all terrains', category: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', stock: 15 },
      { name: 'Coffee Mug', price: 399, description: 'Premium ceramic coffee mug', category: 'Kitchen', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80', stock: 50 },
      { name: 'Backpack', price: 1499, description: 'Durable travel backpack', category: 'Bags', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', stock: 20 },
      { name: 'Sunglasses', price: 899, description: 'UV protected stylish sunglasses', category: 'Accessories', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80', stock: 30 },
      { name: 'Smartwatch', price: 4999, description: 'Feature-rich smartwatch', category: 'Electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', stock: 8 },
    ]);
    res.json({ msg: 'Products seeded!' });
  } catch (err) {
    res.status(500).json({ msg: 'Seed failed', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;