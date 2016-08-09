var express = require('express');
var router = express.Router();
var db = require('../db/queries');
var Movie = require('../models/movie');
var User = require('../models/user');
var User_Movie = require('../models/user_movie');
var modify = require('../scripts/modify');

router.get('/', function(request, response, next) {
  db.Movie.get()
  .then(function(data) {
    modify.removeSensitiveInfoFromMultiple(data)
  .then(function(data) {
    response.json(data);
    });
  });
});

router.get('/:id', function(request, response, next) {
  db.User.get(request.params.id)
  .then(function(data) {
    modify.removeSensitiveInfoFromOne(data)
  .then(function(data) {
    response.json(data);
    });
  });
});

router.post('/', function(request, response, next) {
    db.Movie.insert(request.query)
    .then(function(data) {
    db.Movie.insertIntoJoin(data, request.query)
    .then(function(data) {
      var message = data.attributes.title + ' was inserted successfully!';
      response.json({
        message: message
      });
    });
  });
});

router.put('/:id', function(request, response, next) {
  db.Movie.update(request.query)
  .then(function(data) {
    response.json({
      message: 'Movie succesfully updated!'
    });
  });
});

router.delete('/:id', function(request, response, next) {
  db.Movie.destroy(request.query.user_id, request.query.movie_id)
  .then(function(data) {
    response.json({
      message: 'Successfully removed movie!'
    });
  });
});


module.exports = router;
