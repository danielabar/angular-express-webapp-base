'use strict';

// var async = require('async');

module.exports = function (app, connection) {

  app.get('/api/country', function(req, res) {
    var query = 'SELECT code, name, continent FROM country';
    connection.query(query, [], function(err, result) {
      if (err) {
        res.status(500).send('An error occurred getting all countries');
        connection.close();
      } else {
        res.json(result.rows);
        connection.close();
      }
    });
  });

  app.post('/api/country', function(req, res){
    res.send('hello world');
  });

  app.put('/api/country', function(req, res){
    res.send('hello world');
  });

  app.delete('/api/country', function(req, res){
    res.send('hello world');
  });

  // TODO CRUD for /api/country/:code

};