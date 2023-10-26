const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = 3000;
const connectDB = require('./database');

// Routers
const productRouter = require('./routes/product')
const categoryRouter = require('./routes/category');

// MiddleWare
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// view engine pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// mongodb atlas connect
db = connectDB();

// index route
app.get('/', (req, res) => {
  res.render('index', {});
});

// Product routes

app.use('/products', productRouter);



const server = app.listen(port, () => console.log(`Retail store listening on port ${port}!`));

module.exports = {
  app,
  server,
  db
}
// "test": "NODE_ENV=test jest --runInBand --detectOpenHandles --forceExit",