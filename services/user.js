const messages = require('../messages.js')
const twilio = require('../twilio.js')
const userModel = require('../models/user')
const api = require('../api')

const initSubscription = (phoneNumber) => {
  userModel.save({
    phoneNumber,
  }, () => {
    twilio.sendMessage(phoneNumber, messages.receive_updates);
  });
}

const unsubscribe = (phoneNumber) => {
  userModel.removeByPhoneNumber(phoneNumber, () => {
    twilio.sendMessage(phoneNumber, messages.unsubscribe_notification_message);
  });
}

const requestZipcode = (phoneNumber) => {
  twilio.sendMessage(phoneNumber, messages.enter_zipcode_message);
}

const requestDistance = (user, zipcode) => {
  user.zipcode = zipcode;
  userModel.update(user, () => {
    twilio.sendMessage(user.phoneNumber, messages.distance_to_events_message);
  });
}

const dateToHours = (date) => (
  date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
)

const getEventMessage = (event) => {
  let message = "\n--------------\n"
  const { name, schedule, address } = event;
  const { startsAt, endsAt } = schedule;
  const startsAtDate = new Date(startsAt)
  const endsAtDate = new Date(endsAt)

  message += `Name: ${name}\n`
  message += `${startsAtDate.toISOString().substring(0, 10)}\n`
  message += `${dateToHours(startsAtDate)}\\${dateToHours(endsAtDate)}\n`
  message += address
  return message
}

const triggerEvents = (user, travel_distance) => {
  user.travel_distance = travel_distance;
  userModel.update(user, () => {
    api.getEvents(user.zipcode, user.travel_distance, (events) => {
      let message = "You are subscribed. We have the following events happening soon:\n";

      events.forEach((event) => {
        message += getEventMessage(event)
      })
      twilio.sendMessage(user.phoneNumber, message);
    })
  });
}

module.exports = {
  initSubscription,
  getEventMessage,
  requestZipcode,
  requestDistance,
  triggerEvents,
  unsubscribe,
}
