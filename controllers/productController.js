const Product = require('../models/product');
const Category = require('../models/category')

const { 
  getAllProductsUtil, 
  getAllSaleUtil,
  getProductsByCategoryUtil,
  productValidation,
  submitNewProductUtil,
  deleteProductUtil,
  getUpdateProductUtil,
  submitUpdatedProductUtil,
  getSingleProductUtil
} = require('../utils/productUtils');

const { validationResult } = require('express-validator');


exports.getAllProducts = async (req, res) => {

  try {
    const products = await getAllProductsUtil()
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}


exports.getAllSale = async (req, res) => {

  try {
    const saleProducts = await getAllSaleUtil()
    res.status(200).json(saleProducts);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}

exports.getProductsByCategory = async (req, res) => {
  try {
    const filteredProducts = await getProductsByCategoryUtil(req);
    res.status(200).json(filteredProducts);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}

exports.getCreateProduct = async (req, res) => {
  
  res.status(200).send('hello world'); // fill in for template when ready to move onto views
}

exports.submitNewProduct = [
  productValidation,
  async (req, res, next) => {
    let errors = validationResult(req);
    
    // if there are validation errs
    if (!errors.isEmpty()) {
      // try to re render form with errors
      try {
        const categoryObjs = await Category.find({});
        let categoryNames = categoryObjs.map((cat) => cat.name)
        // res.status(400).render('something', {
        //   errors: errors.array(),
        //   data: req.body,
        //   categories: categories
        // })
        return res.status(400).json({
          errors: errors.array(),
          data: req.body,
          categories: categoryNames});

      } catch (err) {
        // cant rerender form for whatever reason
        return res.status(500).json({err: err.message, block: "first catch block"})
      }
    } else {
      next();
    }
  },
  async (req, res) => {
    // try to submit form for new product
    try {
      const product = await submitNewProductUtil(req);
      await product.save()
      res.status(201).redirect('/')
      // res.send('hello world')
    } catch (err) {
      res.status(500).json({error: err.message, block: "second catch block"});
    }
  }
];

// needs to find the product to be deleted.
// needs to retreive all the instances of that product if the product exists
// needs to delete all the instances
// needs to delete the product
exports.deleteProductAndInstances = async (req, res) => {
  try {
    const {product, productInstances} = await deleteProductUtil(req);
    if (!product) {
      throw new Error('Product does not exist')
    }
    res.status(200).json({productDeleted: product, instancesDeleted: productInstances.deletedCount})

  } catch (err) {

    if (err.message === 'Product does not exist') {
      return res.status(404).json({error: err.message});
    }
    res.status(500).json({error: err.message})
  }
};

exports.getUpdateProduct = async (req, res) => {
  
  try {
    const product = await getUpdateProductUtil(req);
    
    if (!product) {
      throw new Error('No product found');
    }
    res.status(200).json({data: product})
  } catch (error) {
    if (error.message === 'No product found') {
      return res.status(404).json({error: error.message})
    }
    return res.status(500).json({error: error.message});
  }
}

exports.submitUpdateProduct = [
  productValidation,
  async (req, res, next) => {
    let errors = validationResult(req);
    
    // if there are validation errs
    if (!errors.isEmpty()) {
      // try to re render form with errors
      try {
        const categoryObjs = await Category.find({});
        let categoryNames = categoryObjs.map((cat) => cat.name)
        // res.status(400).render('something', {
        //   errors: errors.array(),
        //   data: req.body,
        //   categories: categories
        // })
        return res.status(400).json({
          errors: errors.array(),
          data: req.body,
          categories: categoryNames});

      } catch (err) {
        // cant rerender form for whatever reason
        return res.status(500).json({err: err.message, block: "first catch block"})
      }
    } else {
      next();
    }
  },
  async (req, res) => {
    try {
      const product = await submitUpdatedProductUtil(req);
      console.log(product);
      res.status(201).json({product})
      // res.send('hello world')
    } catch (err) {
      res.status(500).json({error: err.message, block: "second catch block"});
    }
  
  }
]

exports.getSingleProduct = async (req, res) => {
  try {
    const {product, productInstances} = await getSingleProductUtil(req);

    if (!product) {
      throw new Error('Product not found')
    }
    res.status(200).json({data: {
      product,
      productInstances
    }
    });
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({error: error.message});
    }
    res.status(500).json(error);
  }
}