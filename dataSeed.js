
require('dotenv').config();

console.log(
  `This script populated the db with some categories, products and product instances`
)


const Product = require("./models/product");
const ProductInstance = require('./models/productInstance');
const Category = require('./models/category');

const categories = [];
const products = [];
const productInstances = [];

const mongoose = require("mongoose")
mongoose.set("strictQuery", true)

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xyfpqjz.mongodb.net/?retryWrites=true&w=majority`, {dbName: 'retail_store'})
  console.log('succesfully connected start seeding');
  await createCategories();
  await createProducts();
  await createProductInstances();
  console.log('finished seeding, close connection')
  mongoose.connection.close();
}


async function categoryCreate(index, name) {
  const category = new Category({name: name});
  await category.save();
  categories[index] = category._id;
  
}

async function productCreate(index, title, description, price, isSale, category) {

  const product = new Product({title, description, price, isSale, category})
  
  await product.save();
  products[index] = product
  console.log(`added product: ${product.title} `)
}

async function productInstanceCreate(size, product) {
  const productInstance = new ProductInstance({size, product})
  await productInstance.save();
  console.log(`Added Product instance: ${productInstance}`);
  return productInstance;
}


async function createCategories() {
  console.log('adding categories');
  await Promise.all([
    categoryCreate(0, 'Mens'),
    categoryCreate(1, 'Womens'),
    categoryCreate(2, 'Kids'),
    categoryCreate(3, 'Shirts'),
    categoryCreate(4, 'Jumpers'),
    categoryCreate(5, 'Pants'),
    categoryCreate(6, 'Shorts'),
    categoryCreate(7, 'Shoes'),
    categoryCreate(8, 'Dresses'),
    categoryCreate(9, 'Skirts'),
    categoryCreate(10, 'Accessories'),
  ])
};

async function createProducts() {
  console.log('adding products');

  await Promise.all([
    productCreate(0, 'Brown shirt', 'Short sleeve brown shirt. 100% cotton', 25.00, true, [categories[0], categories[3]]),  // Mens Shirts
    productCreate(1, 'Blue shirt', 'Short sleeve blue shirt. 100% cotton', 30.00, false, [categories[0], categories[3]]),
    productCreate(2, 'Pink shirt', 'Short sleeve pink shirt. 100% cotton', 25.00, true, [categories[0], categories[3]]),
    productCreate(3, 'Red shirt', 'Short sleeve red shirt. 100% cotton', 30.00, false, [categories[0], categories[3]]),
    productCreate(4, 'Black Long shirt', 'Long sleeve black shirt. 100% cotton', 35.00, false, [categories[0], categories[3]]),
    productCreate(5, 'Brown shirt', 'Short sleeve brown shirt. 100% cotton', 25.00, true, [categories[1], categories[3]]),  // womens shirts
    productCreate(6, 'Blue shirt', 'Short sleeve blue shirt. 100% cotton', 30.00, false, [categories[1], categories[3]]),
    productCreate(7, 'Pink shirt', 'Short sleeve pink shirt. 100% cotton', 25.00, true, [categories[1], categories[3]]),
    productCreate(8, 'Red shirt', 'Short sleeve red shirt. 100% cotton', 30.00, false, [categories[1], categories[3]]),
    productCreate(9, 'Black Long shirt', 'Long sleeve black shirt. 100% cotton', 35.00, false, [categories[1], categories[3]]),
    productCreate(10, 'Brown shirt', 'Short sleeve brown shirt. 100% cotton', 25.00, true, [categories[2], categories[3]]),  // kids shirts
    productCreate(11, 'Blue shirt', 'Short sleeve blue shirt. 100% cotton', 30.00, false, [categories[2], categories[3]]),
    productCreate(12, 'Pink shirt', 'Short sleeve pink shirt. 100% cotton', 25.00, true, [categories[2], categories[3]]),
    productCreate(13, 'Red shirt', 'Short sleeve red shirt. 100% cotton', 30.00, false, [categories[2], categories[3]]),
    productCreate(14, 'Black Long shirt', 'Long sleeve black shirt. 100% cotton', 35.00, false, [categories[2], categories[3]]),
    productCreate(15, 'Black Jumper', 'Black knit Jumper. 100% cotton', 50.00, false, [categories[0], categories[4]]),  // mens jumpers
    productCreate(16, 'Blue Jumper', 'Blue knit Jumper. 100% cotton', 50.00, false, [categories[0], categories[4]]), 
    productCreate(17, 'Pink Jumper', 'Pink knit Jumper. 100% cotton', 50.00, false, [categories[0], categories[4]]),  
    productCreate(18, 'Black Jumper', 'Black knit Jumper. 100% cotton', 50.00, false, [categories[1], categories[4]]),  // womens jumpers
    productCreate(19, 'Blue Jumper', 'Blue knit Jumper. 100% cotton', 50.00, false, [categories[1], categories[4]]), 
    productCreate(20, 'Pink Jumper', 'Pink knit Jumper. 100% cotton', 50.00, false, [categories[1], categories[4]]), 
    productCreate(21, 'Black Jumper', 'Black knit Jumper. 100% cotton', 50.00, false, [categories[2], categories[4]]),  // kids jumpers
    productCreate(22, 'Blue Jumper', 'Blue knit Jumper. 100% cotton', 50.00, false, [categories[2], categories[4]]), 
    productCreate(23, 'Pink Jumper', 'Pink knit Jumper. 100% cotton', 50.00, false, [categories[2], categories[4]]), 
  ])
}

async function createProductInstances() {
  console.log('adding Product instances');
  let promises = [];
  products.forEach((product) => {
    let sizeArr = ['s', 'm', 'l'];
    sizeArr.forEach((size) => {
      let productInstance = productInstanceCreate(size, product._id)
      promises.push(productInstance);
    })
  })
  await Promise.all(promises)
}

module.exports = {
  createProductInstances,
  createProducts,
  createCategories
}
