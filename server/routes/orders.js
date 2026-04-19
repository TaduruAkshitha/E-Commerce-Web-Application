const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    let total = 0;
    const enriched = await Promise.all(items.map(async item => {
      const p = await Product.findById(item.product);
      total += p.price * item.qty;
      return { product: item.product, qty: item.qty, price: p.price };
    }));
    const order = await Order.create({
      user: req.user.id, items: enriched, total, shippingAddress
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name images price');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;