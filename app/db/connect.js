const mongoose = require('mongoose');
//const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGODB_URI;
module.exports = mongoose.connect(uri, { useNewUrlParser: true, dbName: "api-testing"});