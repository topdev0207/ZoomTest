// Bring in environment secrets through dotenv
require('dotenv/config')


// // old create meeting API
// app.post("/meeting", (req, res) => {
//   //email = "techconnectweb@gmail.com";
//   var options = {
//     method: "POST",
//     uri: "https://api.zoom.us/v2/users/me/meetings",
//     body: JSON.stringify({
//       topic: req.body.topic,
//       type: req.body.type,
//       password: req.body.password,
//       start_time: req.body.start_time,
//       type: 2,                   // 1 = instant meeting, 2 = scheduled meeting
//       default_password: false,
//       duration: 40,              // 40 min is the max meeting time allowed with a basic free Zoom account
//       settings: {
//         host_video: "true",
//         participant_video: "true",
//       },
//     }),
//     // auth: {
//     //   bearer: token,
//     // },
//     headers: {
//       "Authorization":`Bearer ${body.access_token}`,
//       "Content-Yype": "application/json",
//     },
//     //json: true, //Parse the JSON string in the response
//   };

//   rp(options)
//     .then(function (response) {

//       // If successful, print join_url
//       // TODO: add join_url to database, then redirect user to successful "MeetingCreated" page

//       console.log("response is: ", response.join_url);
//       // response.status(200).json(response);
//       let dataRes = {
//         join_url: response.join_url,
//       };
//       res.status(200).json(dataRes);
//       res.send("Create meeting result: " + JSON.stringify(response));
//     })
//     .catch(function (err) {
//       console.log("API call failed, reason ", err);
//     });
// });




//include required modules
const jwt = require('jsonwebtoken');
const config = require('../config/zoom.js');
const rp = require('request-promise');
const cors = require("cors");
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

var email, userid, resp;

//Use the ApiKey and APISecret from config.js
const payload = {
    iss: config.APIKey,
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, config.APISecret);

//use userinfo from the form and make a post request to /userinfo
app.post('/meeting', (req, res) => {
  // get email of admin from env
  email = process.env.REACT_APP_ADMIN_EMAIL;
  //Store the options for Zoom API which will be used to make an API call later.
  var options = {
    method: "POST",
    // make API call "create meeting" Zoom endpoint
    uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
    // qs: {
    //     status: 'active'
    // },
    body: {
      topic: req.body.topic,
      type: req.body.type,
      password: req.body.password,
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
