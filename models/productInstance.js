const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductInstanceSchema = new Schema({
  size: {
    type: String,
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    required: true
  }
})


module.exports = mongoose.model("ProductInstance", ProductInstanceSchema);