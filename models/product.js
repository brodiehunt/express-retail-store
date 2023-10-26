const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  isSale: {
    type: Boolean,
    required: true
  },
  category: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
})

ProductSchema.virtual('url').get(function() {
  return `/products/${this._id}`
})

module.exports = mongoose.model("Product", ProductSchema);