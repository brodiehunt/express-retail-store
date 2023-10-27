const Product = require('../models/product');
const Category = require('../models/category');
const ProductInstance = require('../models/productInstance');
const {body, validationResult} = require('express-validator');


const submitNewCategoryUtil = async (req) => {
  let categoryName = req.body.name;

  const category = new Category({name: categoryName});
  return category;
}

const deleteCategoryUtil = async (req) => {
  const categoryID = req.params.id

  return await Promise.all([
    Category.findByIdAndDelete(categoryID),
    Product.updateMany(
      {category: categoryID}, 
      {$pull: {category: categoryID}}
    )
  ]);

}

const handleCategoryValidationFail = (req, res, next) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
  
    return res.status(400).json({
      errors: errors.array(),
      data: req.body
    })
    
  } else {
    next();
  }
}

const categoryValidation = [
  body('name')
    .trim()
    .isLength({min: 2, max: 15})
    .withMessage('Category Name must have a minimum of 2 characters, max 15')
    .escape(),
  handleCategoryValidationFail
  
];


module.exports = {
  categoryValidation,
  submitNewCategoryUtil,
  deleteCategoryUtil
}
