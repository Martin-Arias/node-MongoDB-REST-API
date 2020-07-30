const mongoose = require('mongoose');

const Schema = mongoose.Schema;

 
const productSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required:true,
    minlength: [3,'El nombre debe tener al menos 3 caracteres'],
    maxlength: [24,'El nombre no debe superar los 24 caracteres']
  },
  price:{
    type: Number,
    required:true,
    min:[15,'El precio no puede menor a 15']
  },
  productImage: {type: String, required: true} 
});

module.exports = mongoose.model('Product',productSchema);