const express = require('express');
const router = express.Router({mergeParams: true});



router.get('/')  // GET all instances of a product

router.get('/create')   // GET create new item form

router.post('/create')  // POST new item form

router.post('/:itemID/delete') // DELETE single item

router.get('/:itemID/update')  // GET update form

router.post('/:itemID/update')   // POST update form

module.exports = router;