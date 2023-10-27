
const {
  categoryValidation,
  submitNewCategoryUtil,
  deleteCategoryUtil
} = require('../utils/categoryUtils');
const {validationResult} = require('express-validator');


exports.getCreateCategory = async (req, res) => {
}

exports.submitNewCategory = [
  categoryValidation,
  async (req, res) => {
    try {
      let category = await submitNewCategoryUtil(req);
      await category.save();
      res.status(201).json({category})
    } catch (err) {
      res.status(500).json({err: err.message});
    }
  }
]

exports.deleteCategory = async (req, res) => {
  try {
    const [category, updatedProducts] = await deleteCategoryUtil(req);
    if (!category) {
      throw new Error('Category does not exist')
    }
    res.status(200).json({category, updatedProducts});
  } catch (err) {
    if (err.message === 'Category does not exist') {
      return res.status(404).json({error: err.message});
    }
    res.status(500).json({error: err.message});
  }
}