'use strict';

var pg = require('pg');
pg.defaults.poolSize = process.env.DB_POOL_SIZE;

var connectionString = ['postgres://',
  process.env.DB_USER, ':',
  process.env.DB_PSWD, '@',
  process.env.DB_HOST, ':',
  process.env.DB_PORT, '/',
  process.env.DB_NAME ].join('');

// http://stackoverflow.com/questions/8484404/what-is-the-proper-way-to-use-the-node-js-postgresql-module
// https://github.com/brianc/node-pg-query/blob/master/index.js
module.exports = {
  query: function(text, values, cb) {
    pg.connect(connectionString, function(err, client, done) {
      if (err) {
        done(err);
        cb(err);
      } else {
        client.query(text, values, function(err, result) {
          if (err) {
            done(err);
            cb(err);
          } else {
            done();
            cb(null, result);
          }
        });
      }
    });
  }
};
