const mongoose = require('mongoose');
const Product = require('./product');

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  quantity: {type:Number,
        default: 1},
  product: {type: String,
          required: true, ref: "Product"}
});
module.exports = mongoose.model('Order', orderSchema);
