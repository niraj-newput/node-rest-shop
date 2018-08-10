const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
router.post('/signup',(req, res, next) => {
  User.find({email: req.body.email})
  .exec()
  .then(user => {
    if(user.length >= 1){
      return res.status(409).json({
        message: 'User already available!'
      });
    }else {
      bcrypt.hash(req.body.password, 10, function(err, hash) {
        if(err) {
          res.status(500).json({
            error: err
          });
        }else {
          const user = User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash
          });
          user.save()
          .then(result => {
            console.log(result);
            res.status(201).json({
              message: 'User create successfully!'
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
        }
      });
    }
  })
  .catch(err => {
    res.status(500).json({
      message: 'error in find user'
    });
  });
});

router.post('/login', (req, res, next) => {
  User.find({email: req.body.email})
  .exec()
  .then(user => {
    if(user.length < 1){
      return res.status(401).json({
        message: 'Auth faild'
      });
    }
    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
      if(err) {
        return res.status(401).json({
          message: 'Auth Faild!'
        });
      }
      if(result) {
        const token = jwt.sign({
          email: user[0].email,
          userId: user[0]._id
        },
        process.env.JWT_KEY,
        {
          expiresIn: '1h'
        });
        return res.status(200).json({
          message: 'Auth Successfull',
          token: token
        });
      }
      res.status(401).json({
        message: 'Auth Faild'
      });
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
});
router.delete('/:userId', (req, res, next) => {
  const id = req.params.userId;
  User.remove({_id : id})
  .exec()
  .then(result => {
    res.status(200).json({
      message: "Delete user successfully"
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
});

module.exports = router;
