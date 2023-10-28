const Product = require('../models/product');
const ProductInstance = require('../models/productInstance');

const {body, validationResult} = require('express-validator');

const getAllItemInstancesUtil = async (req) => {
  const productID = req.params.id;

  const [productInstances, product] = await Promise.all([
    ProductInstance.find({product: productID}),
    Product.findById(productID)]);

  return {productInstances, product};
};

const submitNewItemInstanceUtil = async (req) => {
  const productID = req.params.id;
  const instanceDetails = {
    size: req.body.size,
    product: productID
  };
  // check product exists if doesnt exist throw error;
  const product = await Product.findById(productID);
  const newInstance = new ProductInstance(instanceDetails);
  return {product, newInstance};

};

const deleteItemUtil = async (req) => {
  const productID = req.params.id;
  const itemID = req.params.itemID;

  const [product, instanceDeleted] = await Promise.all([
    Product.findById(productID),
    ProductInstance.findByIdAndDelete(itemID)
  ])

  return {product, instanceDeleted};
};

const submitUpdateItemUtil = async (req) => {
  const productID = req.params.id;
  const itemID = req.params.itemID;

  const updatedItem = await ProductInstance.findByIdAndUpdate(itemID, {size: req.body.size}, {new: true});

  return updatedItem;
};

const handleValidationFail = async (req, res, next) => {
  const errors = validationResult(req);
  console.log('handleValidation', errors)
  if (!errors.isEmpty()) {
    
    return res.status(400).json({
      data: req.body,
      errors: errors.array()
    })
  } else {
    next();
  }
}

const validateItemInstance = [
  body('size', 'Item size required')
    .exists()
    .trim()
    .escape(),
  handleValidationFail
];


module.exports = {
  getAllItemInstancesUtil,
  submitNewItemInstanceUtil,
  deleteItemUtil,
  submitUpdateItemUtil,
  validateItemInstance
}