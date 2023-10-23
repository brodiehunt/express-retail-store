const express = require('express');
const router = express.Router();

// Product routes 
router.get('/', method)  // Get all products

router.get('/sale')  // Get Items on sale

router.get('/:category')  // Get items of a particular category

router.get('/create', method)  // GET create a new product page

router.post('/create', method)  // Create a product submit

router.post('/:id/delete')   // Delete a product

router.get('/:id/update')  // GET update a product form

router.post('/:id/update')  // submit update product form

router.get('/:id')  // Get product page



// PRODUCT INSTANCE ROUTES 

router.get('/:id/items')  // GET all instances of a product

router.get('/:id/item/create')   // GET create new item form

router.post('/:id/item/create')  // POST new item form

router.post('/:id/item/:itemID/delete') // DELETE single item

router.get('/:id/item/:itemID/update')  // GET update form

router.post('/:id/item/:itemID/update')   // POST update form



// CATEGORY ROUTES

router.get('/category/create')  //  GET create category page

router.post('/category/create')  // SUBMIT category form

router.post('/category/:id/delete')  // DELETE category


module.exports = router
