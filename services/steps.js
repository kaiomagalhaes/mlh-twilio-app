const messages = require('../messages.js')

const ZIPCODE_REGEX = /^[0-9]{5}(?:-[0-9]{4})?$/
const DISTANCE_REGEX = /^\d{0,4}$/

const isSubscribeStep = (message, user) => {
  return message === messages.starting_message
    && !user
}

const isConfirmSubscriptionStep = (message, user) => {
  return message === messages.positive_message
    && user
    && !user.travel_distance
}

const isUnsubscribeStep = (message) => {
  return message === messages.negative_message ||
    message.toLowerCase() == messages.unsubscribe_message
}

const isSetZipcodeStep = (message, user) => {
  return ZIPCODE_REGEX.test(message)
    && user
    && !user.zipcode
}

const isSetDistanceStep = (message, user) => {
  return DISTANCE_REGEX.test(message) && user
}

module.exports = {
  isConfirmSubscriptionStep,
  isUnsubscribeStep,
  isSubscribeStep,
  isSetZipcodeStep,
  isSetDistanceStep
}
