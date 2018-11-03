const request = require('request')
const apiUrl = process.env.API_URL

const getEvents = (zipcode, travel_distance, callback) => {
  request(`${apiUrl}/events?zipcode=${zipcode}&travel_distance=${travel_distance}`, { json: true }, (err, res, body) => {
      callback(body)
    });
}

module.exports = {
  getEvents,
}
