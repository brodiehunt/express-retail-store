const Product = require('../models/product');
const ProductInstance = require('../models/productInstance');
const {
  getAllItemInstancesUtil,
  submitNewItemInstanceUtil,
  deleteItemUtil,
  submitUpdateItemUtil,
  validateItemInstance,
} = require('../utils/itemUtils');

exports.getAllItemInstances = async (req, res) => {

  try {
    const {productInstances, product} = await getAllItemInstancesUtil(req);
    if (!product) {
      throw new Error('No product found')
    }
    res.status(200).json({data: productInstances});
  } catch (err) {
    if (err.message === 'No product found') {
      return res.status(404).json({error: err.message});
    }
    res.status(500).json({error: err.message});
  }
};


exports.submitNewItemInstance = [
  validateItemInstance,
  async (req, res) => {
    try {
      const {product, newInstance} = await submitNewItemInstanceUtil(req);
      if (!product) {
        throw new Error('No product found')
      }
      await newInstance.save();
      res.status(201).json({data: newInstance})
    } catch(err) {
      if (err.message === 'No product found') {
        return res.status(404).json({error: err.message});
      }
      res.status(500).json({error: err.message});
    }
  }
];

exports.deleteItem = async (req, res) => {
  try {
    const {product, instanceDeleted} = await deleteItemUtil(req);
    if (!product) {
      throw new Error('No product found')
    }
    if (!instanceDeleted) {
      throw new Error('No product instance found')
    }
    res.status(200).json({data: instanceDeleted});
  } catch (err) {
    if (err.message === 'No product found' || err.message === 'No product instance found') {
      return res.status(404).json({error: err.message});
    }
    res.status(500).json({error: err.message});
  }
};

exports.submitUpdateItem = [
  validateItemInstance,
  async (req, res) => {
    try {
      const updatedItem = await submitUpdateItemUtil(req);
      res.status(200).json({data: updatedItem});
    } catch (err) {
      res.status(500).json({error: err.message});
    }
  }
];