const MongoClient = require('mongodb').MongoClient

const DATABASE_URL = process.env.DATABASE_URL
const DATABASE_NAME = process.env.DATABASE_NAME

const save = (data, collection, callback) => {
  MongoClient.connect(DATABASE_URL, { useNewUrlParser: true }, function (err, client) {
    if (err) throw err

    var db = client.db(DATABASE_NAME)

    db.collection(collection).insertOne(data, function (error, response) {
      callback(response.ops[0]);
    })
  })
};

const remove = (query, collection, callback) => {
  MongoClient.connect(DATABASE_URL, { useNewUrlParser: true }, function (err, client) {
    if (err) throw err

    var db = client.db(DATABASE_NAME)

    db.collection(collection).deleteOne(query, function (error, response) {
      callback(response);
    });
  })
};

const findOne = (query, collection, callback) => {
  MongoClient.connect(DATABASE_URL, { useNewUrlParser: true }, function (err, client) {
    if (err) throw err

    var db = client.db(DATABASE_NAME)

    db.collection(collection).findOne(query, function (error, response) {
      callback(response);
    });
  })
};

const update = (query, data, collection, callback) => {
  MongoClient.connect(DATABASE_URL, { useNewUrlParser: true }, function (err, client) {
    if (err) throw err

    var db = client.db(DATABASE_NAME)

    db.collection(collection).updateOne(query, { $set: data }, function () {
      callback(data);
    })
  })
};

const find = (query, collection, callback) => {
  MongoClient.connect(DATABASE_URL, { useNewUrlParser: true }, function (err, client) {
    if (err) throw err

    var db = client.db(DATABASE_NAME)

    db.collection(collection).find(query).toArray(function (error, response) {
      callback(response);
    });
  })
};

module.exports = {
  find,
  findOne,
  remove,
  save,
  update,
};

