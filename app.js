const express = require('express')
const webpush = require('web-push')
const cors = require('cors')
const bodyParser = require('body-parser')
const http = require('http');

const PUBLIC_VAPID =
  'BIpGXtXubCD-QAa2bz_e0z4uGGdanNPDkGc5ZlKDMe9BVcGF8Lij2SfcF0Bb0Ds5PWyimoygTQoxjJm_WigD58M'
const PRIVATE_VAPID = 'ihVdQLwQlyAE5vEC3ZClMUDboPmKq5IaxLU4HwADAcU'

const fakeDatabase = []

const app = express()

var corsOptions = {
  origin: 'https://digihackerwebapp.azurewebsites.net',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


app.use(cors(corsOptions))
app.use(bodyParser.json())

webpush.setVapidDetails('mailto:you@domain.com', PUBLIC_VAPID, PRIVATE_VAPID)

app.post('/subscription', (req, res) => {
  const subscription = req.body
  fakeDatabase.push(subscription)
})

app.post('/sendNotification', (req, res) => {
  console.log(req.body);
  const notificationPayload = {
    notification: {
      title: 'New Notification',
      body: req.body['message'],
      icon: 'assets/icons/icon-512x512.png',
    },
  } 

  const promises = []
  fakeDatabase.forEach(subscription => {
    promises.push(
      webpush.sendNotification(
        subscription,
        JSON.stringify(notificationPayload)
      )
    )
  })
  Promise.all(promises).then(() => res.sendStatus(200))
  .catch( err => console.error('Error',err))
})

const port=process.env.PORT || 3000

app.get('/health', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Welcome to Health Monitor Node Server</h1>');
    });

app.listen(port, () => {
  console.log('Server started on port '+port)
})