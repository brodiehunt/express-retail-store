const express = require('express');
const router = express.Router({mergeParams: true});

const categoryController = require('../controllers/categoryController');


// CATEGORY ROUTES

router.get('/create', (req, res) => {
  res.send('hellow world from category form get')
})  //  GET create category page

router.post('/create', categoryController.submitNewCategory)  // SUBMIT category form

router.post('/:id/delete', categoryController.deleteCategory)  // DELETE category


module.exports = router