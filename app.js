const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const port = 3000;
const productRouter = require('./routes/product')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// view engine pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// mongodb atlas connect
mongoose.set("strictQuery", false);
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xyfpqjz.mongodb.net/?retryWrites=true&w=majority`)
}

// index route
app.get('/', (req, res) => {
  res.render('index', {});
});

// Product routes

app.use('/products', productRouter);



app.listen(port, () => console.log(`Retail store listening on port ${port}!`));

