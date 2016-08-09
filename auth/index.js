require('dotenv').config();
var express = require('express');
var router = express.Router();
var db = require('../db/queries');
var auth = require('./utils.js');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

router.post('/signup', function (request, response) {
  db.findUserByUsername(request.query.username)
    .then(function(user) {
      if (user) {
        response.json({
          error: 'Sorry, user already exists!'
        });
      } else {
        auth.createUser(request.query)
        .then(function(id) {
          response.json({
            message: 'Successfully created credentials!'
          });
        });
      }
  });
});

router.post('/login', function (request, response) {
  db.findUserByUsername(request.query.username)
    .then(function(user) {
      var plainTextPassword = request.query.password;

      if ( user && bcrypt.compareSync(plainTextPassword, user.attributes.password) ) {
        delete user.attributes.password;

        jwt.sign(user.attributes, process.env.TOKEN_SECRET, { expiresIn: '1d' }, function(err, token) {
          console.log(token);
          if (err) {
            response.json({
              message: "Error creating token"
            });
          } else {
            response.json({
              token: token,
              userId: user.attributes.id
            });
          }
        });
      } else {
        response.status(401);
        response.json({
          message: "UnAuthorized"
        });
      }
    }).catch(function(err) {
      response.status(503);
      response.json({
        message: err
      });
    });
});

module.exports = router;
