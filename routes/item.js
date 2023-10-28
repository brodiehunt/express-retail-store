const express = require('express');
const router = express.Router({mergeParams: true});

const itemsController = require('../controllers/itemController');





router.get('/', itemsController.getAllItemInstances)  // GET all instances of a product

router.post('/create', itemsController.submitNewItemInstance)  // POST new item form

router.post('/:itemID/delete', itemsController.deleteItem) // DELETE single item

router.post('/:itemID/update', itemsController.submitUpdateItem)   // POST update form

module.exports = router;