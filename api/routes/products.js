const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
// const storage = multer.diskStorage({
//   destination: function(req, file, cb){
//     cb(null,"./uploads/");
//   },
//   filename: function(req, file, cb){
//     cb(null, new Date().toISOString()+file.originalname)
//   }
// });
const upload = multer({dest: 'uploads/'});

router.get('/', (req, res, next) => {
  Product.find()
  .select("name price _id productImage")
  .exec()
  .then(docs => {
    res.status(200).json({
      count: docs.length,
      products: docs
    });
  })
  .catch(err => {
    res.status(500).json({
      message: "No record Found",
      error: err
    });
  });
});

router.post('/',checkAuth, upload.single("productImage"),(req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product.save().then(result => {
    res.status(201).json({
      message: 'Its Handle Post request!',
      createProduct: result
    });
  }).catch(err => {
    console.log(err);
  });
});

router.get('/:productId', (req, res, next) => {
  var id = req.params.productId;
  Product.findById(id)
  .select("name price _id productImage")
  .exec()
  .then(doc => {
    res.status(200).json(doc);
  })
  .catch(err => {
    res.status(404).json({
      message: "Record not Found in DB",
      error: err
    });
  });
});

router.patch('/:productId',checkAuth,(req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for(const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }
  Product.update({_id : id}, {$set: updateOps})
  .exec()
  .then(result => {
    res.status(200).json({
      message: 'Update successfully'
    });
  })
  .catch(err => {
    res.status(500).json({error:err});
  });
});

router.delete('/:productId',checkAuth , (req, res, next) => {
  const id = req.params.productId;
  Product.remove({_id : id})
  .exec()
  .then(result => {
    res.status(200).json({
      message: "remove product successfully"
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
});
module.exports = router;
