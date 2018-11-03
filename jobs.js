require('dotenv').config()

const schedule = require('node-schedule');
const userModel = require('./models/user')
const api = require('./api')
const userServices = require('./services/user')
const twilio = require('./twilio')
const messages = require('./messages')

console.log('running job')
userModel.listSubscribed((users) => {
  users.forEach((user) => {
    api.getEvents(user.zipcode, user.travel_distance, (events) => {
      let message = 'A new MLH event is happening near you soon!'
      message += userServices.getEventMessage(events[0])
      message += `\n\n${messages.unsubscribe_note_message}`
      twilio.sendMessage(user.phoneNumber, message);
    }, 1)
  })
})
const start = () => {
  console.log('Starting async workers')

  // to see the jobs running in development use the minuteCronExpression
  const minuteCronExpression = '*/1 * * * *'
  const dailyCronExpression = '0 12 * * *'

  schedule.scheduleJob(minuteCronExpression, function(){
    console.log('running job')
    userModel.listSubscribed((users) => {
      users.forEach((user) => {
        api.getEvents(user.zipcode, user.travel_distance, (events) => {
          let message = 'A new MLH event is happening near you soon!'
          message += userServices.getEventMessage(events[0])
          message += `\n\n${messages.unsubscribe_note_message}`
          twilio.sendMessage(user.phoneNumber, message);
        }, 1)
      })
    })
  });
}
module.exports = {
  start,
}

