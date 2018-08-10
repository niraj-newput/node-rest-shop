const express = require('express');
const path = require('path');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://node-shop:'+process.env.MONGO_ATLAS_PWD+'@node-rest-api-s7qvy.mongodb.net/test?retryWrites=true',
 { useNewUrlParser: true},
 function(err){
   console.log(err);
 }
);


const productRoute = require('./api/routes/products');
const orderRoute = require('./api/routes/order');
const userRoute = require('./api/routes/user');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET, PATCH');
    return res.status(200).json({});
  }
  next();
});
app.use(express.static(path.join(__dirname + '/public')));
app.use('/product', productRoute);
app.use('/order', orderRoute);
app.use('/user', userRoute);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});
console.log(path.join(__dirname+ 'public'));

app.get('*', function(req, res) {
  console.log('hemmo');
    res.sendFile(path.join(__dirname + 'public/index.html'));
});
module.exports = app;
