const mongoose = require('mongoose');  
const Schema   = mongoose.Schema;

const webchatSchema = new Schema({ 
  message:        { type: String },
});

module.exports = mongoose.model('WebChat', webchatSchema); 