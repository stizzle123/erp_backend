"use strict";
const express = require('express');
const cors = require('cors')
const app = express();
app.options('*', cors());
var bodyParser = require('body-parser');

var passport = require('passport');

// [SH] Bring in the data model
require('./model/db');
// [SH] Bring in the Passport config after model is defined
require('./config/passport');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



app.use(passport.initialize());
var vendor = require('./route/vendor');
var user = require('./route/user');

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', false);
    next();
});
app.use(function(req, res, next){
    if(true){ //authorize request
        next();
    }else{
        //
    }
});

app.use('/vendors', vendor);
app.use('/users', user);


app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({"message" : err.name + ": " + err.message});
      }else{
        res.status(500).send(err.message);
      }
  })
  app.listen(3000, function(){
    console.log("Web server listening on port 3000");
  });