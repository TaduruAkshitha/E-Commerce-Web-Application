const router = require('express').Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    res.json(await Product.find(query));
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
router.post('/seed', async (req, res) => {
  try {
    await Product.insertMany([
      { name: 'Wireless Headphones', price: 1999, stock: 10, category: 'Electronics', description: 'High quality wireless headphones with noise cancellation', images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'] },
      { name: 'Running Shoes', price: 2499, stock: 15, category: 'Footwear', description: 'Comfortable running shoes for all terrains', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'] },
      { name: 'Coffee Mug', price: 399, stock: 50, category: 'Kitchen', description: 'Premium ceramic coffee mug', images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400'] },
      { name: 'Backpack', price: 1299, stock: 20, category: 'Bags', description: 'Spacious travel backpack with laptop compartment', images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'] },
      { name: 'Sunglasses', price: 799, stock: 30, category: 'Accessories', description: 'UV protected polarized sunglasses', images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'] },
      { name: 'Smartwatch', price: 3999, stock: 8, category: 'Electronics', description: 'Feature packed smartwatch with health tracking', images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'] }
    ]);
    res.json({ msg: 'Products seeded!' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
module.exports = router;