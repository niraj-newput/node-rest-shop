const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');

router.get('/', checkAuth, (req, res, next) => {
  Order.find()
  .select("quantity product _id")
  .populate("product")
  .exec()
  .then(docs => {
    res.status(200).json({
      count: docs.length,
      orders: docs.map(doc => {
        return {
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          request: {
            type: "GET",
            url: "http://localhost/3000/order"
          }
        }
      })
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      message: 'No oreder in db',
      error: err
    });
  });
});

router.post('/',checkAuth, (req, res, next) => {
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    product: req.body.product,
    quantity: req.body.quantity
  });
  order.save()
  .then(result => {
    res.status(200).json({
      message: 'Oreder Created successfully',
      order: result
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
});

router.get('/:orderId',checkAuth, (req, res, next) => {
  Order.findById(req.params.orderId)
  .exec()
  .then(order => {
    res.status(200).json({
      order: order,
      request: {
        type: "GET",
        url: "http://localhost:3000/order"
      }
    });
  })
  .catch();
});


router.post('/:orderId',checkAuth, (req, res, next) => {
  res.status(201).json({
    message: 'order was fetches '
  });
});

router.delete('/:orderId',checkAuth, (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({_id : id})
  .exec()
  .then(result => {
    res.status(200).json({
      message: "order deleted",
      request: {
        type: "delete",
        url: "http://localhost:3000/order"
      },
      body: {
        productId: "ID",
        quantity: "Number"
      }
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
});

module.exports = router;
