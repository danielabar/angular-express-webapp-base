'use strict';

var pg = require('pg');

// Use process.env...
var conString = 'postgres://postgres:password@localhost:15432/myappdb';

// Is it possible to set auto-commit false for testing?
// Is it possible to configure connection pool size?
var executeQuery = function(query, params, callback) {

  // Do we also need to release client back to the pool in error cases?
  pg.connect(conString, function(err, client, done) {
    if(err) {
      callback(err);
    } else {
      client.query(query, params, function(err, result) {
        if(err) {
          callback(err);
        } else {
          callback(null, result);
          done();   // release the client back to the pool
        }
      });
    }
  });

};

module.exports.executeQuery = executeQuery;