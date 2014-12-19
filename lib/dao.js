'use strict';

var pg = require('pg');
pg.defaults.poolSize = process.env.DB_POOL_SIZE;

var connectionString = ['postgres://',
  process.env.DB_USER, ':',
  process.env.DB_PSWD, '@',
  process.env.DB_HOST, ':',
  process.env.DB_PORT, '/',
  process.env.DB_NAME ].join('');

// Is it possible to set auto-commit false for testing?
var executeQuery = function(query, params, callback) {

  // Do we also need to release client back to the pool in error cases?
  pg.connect(connectionString, function(err, client, done) {
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