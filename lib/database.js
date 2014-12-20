'use strict';

var pg = require('pg');
pg.defaults.poolSize = process.env.DB_POOL_SIZE;

var connectionString = ['postgres://',
  process.env.DB_USER, ':',
  process.env.DB_PSWD, '@',
  process.env.DB_HOST, ':',
  process.env.DB_PORT, '/',
  process.env.DB_NAME ].join('');

var openConnection = function(callback) {
  pg.connect(connectionString, function(err, connection, close) {
    if (err) {
      callback(err);
      close();
    } else {
      connection.close = close;
      callback(null, connection);
    }
  });
};

module.exports.openConnection = openConnection;
