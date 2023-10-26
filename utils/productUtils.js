const Product = require('../models/product');
const Category = require('../models/category');
const ProductInstance = require('../models/productInstance');
const {body } = require('express-validator');


const getAllProductsUtil = () => {
  return Product.find({});
}

const getAllSaleUtil = async () => {
  return Product.find({isSale: true});
}

const getProductsByCategoryUtil = async (req) => {
  // single array of cateogry names from params and query
  let categoryNames = [... new Set([req.params.category].concat(req.query.category || []))];
  const categoryObjs = await Category.find({name: {$in: categoryNames}}).select({name: 0});
  const categoryIds = categoryObjs.map((obj) => {
    return obj._id;
  })

  return Product.find({category: { $all: categoryIds}}).populate('category');

}

const submitNewProductUtil = async (req) => {
  
  const {title, description, price, isSale, category } = req.body;
  const categoryObjs = await Category.find({name: {$in: category}});
  const categoryIDs = categoryObjs.map((cat) => cat._id)
  return new Product({
    title,
    description, 
    price,
    isSale,
    category: categoryIDs
  })
}

const deleteProductUtil = async (req) => {
  const productID = req.params.id;
  
  const [product, productInstances] = await Promise.all([
    Product.findByIdAndDelete(productID),
    ProductInstance.deleteMany({product: productID})
  ])
  return {product, productInstances}
}

const getUpdateProductUtil = async (req) => {
  const productID = req.params.id;
  const product = await Product.findById(productID).populate('category');

  return product;

}

const submitUpdatedProductUtil = async (req) => {
  const productID = req.params.id
  const {title, description, price, isSale, category } = req.body;
  const categoryObjs = await Category.find({name: {$in: category}});
  const categoryIDs = categoryObjs.map((cat) => cat._id)
  const updatedProduct = {
    title,
    description,
    price,
    isSale,
    categoryIDs
  }
  const product = await Product.findByIdAndUpdate(productID, updatedProduct, {new: true} );
  return product
}

const getSingleProductUtil = async (req) => {
  const productID = req.params.id;
  console.log(productID)
  const [product, productInstances] = await Promise.all([
    Product.findById(productID),
    ProductInstance.find({product: productID})
  ]);

  return {product, productInstances}
}


// validation functions
const productValidation = [
  body("title", 'Title must not be empty')
    .trim()
    .isLength({min: 1, max: 20})
    .withMessage('Cannot be longer than 20 characters, or shorter than 1 character')
    .escape(),
  body('description', 'description must not be empty')
    .trim()
    .isLength({min: 5})
    .withMessage("Should be at least 5 characters")
    .escape(),
  body('price', 'Price must not be empty')
    .trim()
    .escape(),
  body('isSale', 'Must not be empty')
    .trim()
    .isBoolean()
    .withMessage('Must be boolean true or false')
    .escape(),
  body('category')
    .isArray({ min: 1, max: 3 })
    .withMessage('At least 1 category selected.'),
  
    
]


module.exports = {
  getAllProductsUtil,
  getAllSaleUtil,
  getProductsByCategoryUtil,
  productValidation,
  submitNewProductUtil,
  deleteProductUtil,
  getUpdateProductUtil,
  submitUpdatedProductUtil,
  getSingleProductUtil
}