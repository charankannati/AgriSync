const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    wholesaler: String,
    products:[String]
  });
  
const Wholesaler = mongoose.model('WholesalerProducts', Schema);

module.exports = Wholesaler;