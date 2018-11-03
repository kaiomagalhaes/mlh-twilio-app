require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const userModel = require('./models/user')
const userServices = require('./services/user')
const stepsServices = require('./services/steps')

app.use(bodyParser.urlencoded({
  extended: true
}));

const port = process.env.PORT || 3000

const parseJson = (json) => {
  const { From, Body } = json;

  return {
    phoneNumber: From,
    message: Body.trim(),
  };
};

app.post('/', (req, res) => {
  const { phoneNumber, message } = parseJson(req.body);
  const cleanedMessage = message.trim().toLowerCase()

  userModel.findByPhoneNumber(phoneNumber, (user) => {
    const isSubscribeStep = stepsServices.isSubscribeStep(cleanedMessage, user)
    const isUnsubscriptionStep = stepsServices.isUnsubscribeStep(cleanedMessage, user)
    const isConfirmSubscriptionStep = stepsServices.isConfirmSubscriptionStep(cleanedMessage, user)
    const isSetZipcodeStep = stepsServices.isSetZipcodeStep(cleanedMessage, user)
    const isSetDistanceStep = stepsServices.isSetDistanceStep(cleanedMessage, user)

    if (isSubscribeStep) {
      userServices.initSubscription(phoneNumber)
    } else if(isConfirmSubscriptionStep) {
      userServices.requestZipcode(phoneNumber)
    } else if(isUnsubscriptionStep) {
      userServices.unsubscribe(phoneNumber)
    } else if(isSetZipcodeStep) {
      userServices.requestDistance(user, message)
    } else if(isSetDistanceStep) {
      userServices.triggerEvents(user, message)
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ status: 'ok' }));
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
