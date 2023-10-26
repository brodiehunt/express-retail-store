const express = require('express');
const router = express.Router();
const categoryRouter = require('./category');
const itemRouter = require('./item');

const productsController = require('../controllers/productController');

// Product routes 
router.get('/', productsController.getAllProducts)  // Get all products

router.get('/sale', productsController.getAllSale)  // Get Items on sale

router.get('/create', productsController.getCreateProduct)  // GET create a new product page

router.post('/create', productsController.submitNewProduct)  // Create a product submit

router.get('/category/:category', productsController.getProductsByCategory)  // Get items of a particular category



router.post('/:id/delete', productsController.deleteProductAndInstances)   // Delete a product

router.get('/:id/update', productsController.getUpdateProduct)  // GET update a product form

router.post('/:id/update', productsController.submitUpdateProduct)  // submit update product form

router.get('/:id', productsController.getSingleProduct)  // Get product page



// PRODUCT INSTANCE ROUTES  /product/:id/item routes

router.use('/:id/items', itemRouter);

// /product/category Routes

router.use('/category', categoryRouter);



module.exports = router
