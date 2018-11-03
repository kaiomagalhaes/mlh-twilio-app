const db = require('../../db')

const tableName = 'userRequests'

const findByPhoneNumber = (phoneNumber, callback) => {
  return db.findOne({
    phoneNumber,
  }, tableName, callback);
};

const listSubscribed = (callback) => {
  return db.find({
    $and: [
      { "phoneNumber":{$exists:true} },
      { "zipcode":{$exists:true} },
      { "travel_distance":{$exists:true} },
    ],
  }, tableName, callback);
}

const removeByPhoneNumber = (phoneNumber, callback) => {
  return db.remove({
    phoneNumber,
  }, tableName, callback);
};

const save = (json, callback) => {
  db.save(json, tableName, callback);
};

const update = (user, callback) => {
  db.update({
    phoneNumber: user.phoneNumber,
  }, user, tableName, callback);
};

module.exports = {
  findByPhoneNumber,
  listSubscribed,
  save,
  removeByPhoneNumber,
  update,
};
