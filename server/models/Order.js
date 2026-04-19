const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema({
  user:    { type: ObjectId, ref: 'User', required: true },
  items:   [{ 
    product: { type: ObjectId, ref: 'Product' }, 
    qty:     Number, 
    price:   Number 
  }],
  total:           Number,
  status:          { type: String, enum: ['pending','processing','shipped','delivered','cancelled'], default: 'pending' },
  paymentId:       String,
  shippingAddress: Object
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);