const mongoose = require('mongoose');
const request = require('supertest');
const connectDB = require('../database')
const Category = require('../models/category');
const Product = require('../models/product');
const ProductInstance = require('../models/productInstance')
const {app, server, db } = require('../app');
require('dotenv').config();

// set up test db connection and seed database
beforeAll(async () => {
  try {
    
    await seedDatabase()
    console.log('successful seeding')
  } catch (err) {
    console.log(err);
  }
 
})

// tear down connection
afterAll(async () => {
  server.close()
  await mongoose.connection.close();
})

describe('get all products', () => {
  test("should return all products", async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(res.body).not.toBeUndefined();
    expect(res.body[0].title).toBe('Shirt');
  })
})

describe('Get all products on sale', () => {
  test("Should only return products with isSale: true", async () => {
    const res = await request(app).get('/products/sale');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    for (let i = 0; i < res.body.length; i++) {
      expect(res.body[i].isSale).toBe(true);
    }
  })
})

describe('Get all products of a particular category', () => {
  test('Should get product category through route param', async () => {
    const res = await request(app).get('/products/category/Mens');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].category[0].name).toBe('Mens');
  })

  test('should get product category through route param and query param', async () => {
    const res = await request(app).get('/products/category/Mens?category=Shirts');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].category[0].name).toBe('Mens');
    expect(res.body[0].category[1].name).toBe('Shirts');
    expect(res.body[0].category.length).toBe(2);
  })

  test('Should only get products if all category filters match', async () => {
    const res = await request(app).get('/products/category/Mens?category=Womens');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  })
})

describe('Get a create new product page', () => {
  test('should successfully render template', async () => {
    const res = await request(app).get('/products/create');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('hello world')
  })
});

describe('Post a new product', () => {

  test("should submit a new product and redirect", async () => {
    let formData = {
      title: "New product",
      description: "new product description",
      price: 99,
      isSale: "true",
      category: ["Mens", "Shirts"]
    }
    
    let res = await request(app).post('/products/create').send(formData);
    expect(res.statusCode).toBe(302);
    expect(res.headers['location']).toBe('/');
  })

  test("test the redirect after a succussful test, should be status 200", async () => {
    let formData = {
      title: "New product",
      description: "new product description",
      price: 99,
      isSale: "true",
      category: ["Mens", "Shirts"]
    }
    
    let res = await request(app).post('/products/create').send(formData).redirects(1);
    expect(res.statusCode).toBe(200);
  })

  test("empty form title data should not submit form", async () => {
    let formData = {
      title: "",
      description: "new product description",
      price: 99,
      isSale: "true",
      category: ["Mens", "Shirts"]
    };

    let res = await request(app).post('/products/create').send(formData)
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].msg).toBe("Cannot be longer than 20 characters, or shorter than 1 character")
    expect(res.body.data).toBeDefined();
    expect(res.body.categories).toBeDefined();
    
  })
  
})

describe('should delete product and all item instances', () => {
  test('should delete shirt', async () => {
    const shirt = await addProductAndInstance();
    
    const res = await request(app).post(`/products/${shirt._id}/delete`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.productDeleted._id).toBeDefined();
    expect(res.body.instancesDeleted).toBe(1);
    
  })

  test('should delete shirt with no instance', async () => {
    const shirt = await addProductNoInstance();
    const res = await request(app).post(`/products/${shirt._id}/delete`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.productDeleted._id).toBeDefined();
    expect(res.body.instancesDeleted).toBe(0);
  });

  test('deletion of a non-existent product should respond 404', async () => {
    
    const res = await request(app).post('/products/653759e999d2ddc2f36dd110/delete');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBeDefined();
  })
})

describe('get update form', () => {
  test('update form route status 200', async () => {
    const shirt = await addProductNoInstance()
    const res = await request(app).get(`/products/${shirt._id}/update`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
  })

  test('non existent product should return 404', async () => {
    const fakeObjId = '653759e999d2ddc2f36dd110';
    const res = await request(app).get(`/products/${fakeObjId}/update`);
    expect(res.statusCode).toBe(404);

  })
})

describe('post update form', () => {

})

describe('Get single product page', () => {
  test('returns a single product', async () => {
    let newProduct = await addProductNoInstance();
    const res = await request(app).get(`/products/${newProduct._id}`)
    expect(res.statusCode).toBe(200);
    console.log(res.body)
    expect(res.body.data.product.title).toBe('shirt to be deleted');
    expect(res.body.data.productInstances.length).toBe(0);
  })
  
  test('Returns a 404 error when no product found', async () => {
    const fakeObjId = '653759e999d2ddc2f36dd110';
    const res = await request(app).get(`/products/${fakeObjId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Product not found');
  })
})


async function addProductAndInstance() {
  // find category ids
  // create product
  // create instances
  const categories = await Category.find({name: {$in: ['Mens', 'Shirts']}});
  const newProduct = new Product({
    title: 'shirt to be deleted',
    description: 'description one',
    price: 100,
    isSale: true,
    category: [categories[0]._id, categories[1]._id]
  })
  await newProduct.save();
  const newInstance = new ProductInstance({
    size: 'M',
    product: newProduct._id
  })
  await newInstance.save();
  return newProduct;
}

async function addProductNoInstance() {
  const categories = await Category.find({name: {$in: ['Mens', 'Shirts']}});
  const newProduct = new Product({
    title: 'shirt to be deleted',
    description: 'description one',
    price: 100,
    isSale: true,
    category: [categories[0]._id, categories[1]._id]
  })
  await newProduct.save();
  return newProduct;
}

async function seedDatabase() {
  // Clear the database
  await Category.deleteMany({});
  await Product.deleteMany({});
  await ProductInstance.deleteMany({});

  // Create categories
  const mensCategory = new Category({ name: 'Mens' });
  await mensCategory.save();

  const womensCategory = new Category({ name: 'Womens' });
  await womensCategory.save();

  const shirtCategory = new Category({name: 'Shirts'});
  await shirtCategory.save();

  const pantsCategory = new Category({name: 'Pants'});
  await pantsCategory.save();

  // Create products
  const shirtProduct = new Product({
    title: 'Shirt',
    description: 'A nice shirt.',
    price: 20.00,
    isSale: false,
    category: [mensCategory._id, shirtCategory._id]
  });
  await shirtProduct.save();

  const pantProduct = new Product({
    title: 'Pants',
    description: 'A nice pair of Pants.',
    price: 40.00,
    isSale: true,
    category: [mensCategory._id, pantsCategory._id]
  });
  await pantProduct.save();

  // Create product instances
  const smallShirt = new ProductInstance({
    size: 'S',
    product: shirtProduct._id
  });
  await smallShirt.save();

  const mediumShirt = new ProductInstance({
    size: 'M',
    product: shirtProduct._id
  });
  await mediumShirt.save();

}

