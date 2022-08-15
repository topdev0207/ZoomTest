// Bring in environment secrets through dotenv
require('dotenv/config')

//include required modules
const jwt = require('jsonwebtoken');
const config = require('../config/zoom.js');
const rp = require('request-promise');
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}))
app.use(cors());

// get email of admin from env
var email = process.env.REACT_APP_ADMIN_EMAIL;

//Use the ApiKey and APISecret from config.js
const payload = {
    iss: config.APIKey,
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, config.APISecret);

//use userinfo from the form and make a post request to /userinfo
app.post('/meeting', (req, res) => {
  console.log("IN BACKEND: Topic = " + req.body.topic + " Start date = " + req.body.start_time);
  var options = {
    method: "POST",
    // make API call "create meeting" Zoom endpoint
    uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
    body: {
      topic: req.body.topic,
      start_time: req.body.start_time,
      type: 2,                   // 1 = instant meeting, 2 = scheduled meeting
      default_password: false,
      duration: 40,              // 40 min is the max meeting time allowed with a basic free Zoom account
      settings: {
        host_video: "true",
        participant_video: "true",
      },
    },
    auth: {
        'bearer': token
    },
    headers: {
        'User-Agent': 'Zoom-api-Jwt-Request',
        'content-type': 'application/json'
    },
    json: true //Parse the JSON string in the response
  };

//Use request-promise module's .then() method to make request calls.
rp(options)
    .then(function (response) {
      //printing the response on the console
      console.log('Response: ', response);
      //console.log(typeof response);

      let dataRes = {
        join_url: response.join_url,
      };

      //res.send("Create meeting result: " + JSON.stringify(response));
      res.status(200).json(dataRes);
    })
    .catch(function (err) {
        // API call failed...
        console.log('API call failed, reason ', err);
    });
});

app.listen(3008, () => console.log(`Zoom app listening at PORT: 3008`))
