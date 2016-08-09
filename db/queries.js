var Movie = require('../models/movie');
var User = require('../models/user');
var User_Movie = require('../models/user_movie');

module.exports = {

  Movie: {

    get: function(id){
      if (id) {
        return Movie.where({ id: id })
          .fetch({ withRelated: 'users' })
          .then(function(collection) {
            return collection.toJSON();
          });
      } else {
        return Movie.forge()
          .orderBy('title', 'ASC')
          .fetchAll({ withRelated: 'users' })
          .then(function(collection) {
            return collection.toJSON();
          });
      }
    },

    insert: function(formData) {
      return Movie.forge().save({
        description: formData.description,
        image_url: formData.image_url,
        rating: formData.rating,
        title: formData.title,
        year: formData.year
      });
    },

    insertIntoJoin: function(data, queryData) {
      return User_Movie.forge().save({
        user_id: queryData.user_id,
        movie_id: data.id
      });
    },

    update: function(query) {
      return Movie.forge({ id: query.movie_id })
        .fetch()
        .then(function(movie) {
          return movie.save({
            movie_id: query.id,
            title: query.title,
            description: query.description,
            year: query.year,
            image_url: query.image_url,
            rating: query.rating
          });
        });
    },

    destroy: function(user_id, movie_id) {
      return User_Movie.where({
        movie_id: movie_id,
        user_id: user_id
      })
      .destroy();
    }

  },

  User: {

    get: function(id){
      if (id) {
        return User.where({ id: id })
          .fetch({ withRelated: 'movies' })
          .then(function(collection) {
            return collection.toJSON();
          });
      } else {
        return Movie.forge()
          .orderBy('title', 'ASC')
          .fetchAll({ withRelated: 'users' })
          .then(function(collection) {
            return collection.toJSON();
          });
      }
    }

  },

  findUserByUsername: function(username) {
    return User.where({ username: username })
    .fetch();
  },

  addUser: function(body){
    return User.forge().save(body);
  }


};
