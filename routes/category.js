const express = require('express');
const router = express.Router({mergeParams: true});




// CATEGORY ROUTES

router.get('/create')  //  GET create category page

router.post('/create')  // SUBMIT category form

router.post('/:id/delete')  // DELETE category


module.exports = router