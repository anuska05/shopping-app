const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  id:{type:String , required:true},
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  category: { type: String },
  purchased: { type: Boolean, default: false },
  price: {type:Number,required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imag: {type:String , required:true},
});

module.exports = mongoose.model('Item', ItemSchema);
