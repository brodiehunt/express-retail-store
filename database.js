const mongoose = require('mongoose');

async function connectDB() {
  const environment = process.env.NODE_ENV || 'development';
  let connectionString;

  if (environment === 'test') {
    connectionString = process.env.TEST_DATABASE_URL;

  } else {
    connectionString = process.env.DATABASE_URL;
  }

  try {
    let db = await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true, dbName: "retail_store"});
    console.log(`Connexted to ${environment} database`);
    return db
  } catch (err) {
    console.log(`Couldn't connect to ${environment} database: `, err)
  }

}

module.exports = connectDB;