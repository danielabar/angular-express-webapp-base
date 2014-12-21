'use strict';

var async = require('async');
var pg = require('pg');
pg.defaults.poolSize = process.env.DB_POOL_SIZE;

var connectionString = ['postgres://',
  process.env.DB_USER, ':',
  process.env.DB_PSWD, '@',
  process.env.DB_HOST, ':',
  process.env.DB_PORT, '/',
  process.env.DB_NAME ].join('');

// https://github.com/brianc/node-postgres/wiki/Transactions
// var rollback = function(client, done, cb) {
//   client.query('ROLLBACK', function(err) {
//     done(err);
//     cb(err);
//   });
// };

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
  },

  // https://github.com/brianc/node-postgres/wiki/Transactions
  transaction: function(queriesAndValues, cb) {
    pg.connect(connectionString, function(err, client, done) {
      if(err) {
        done(err);
        cb(err);
      } else {
        client.query('BEGIN', function(err) {
          if(err) {
            module.exports.rollback(client, done, cb);
          } else {
            async.each(queriesAndValues, function(item, callback) {
              console.log('Processing query ' + item.query + ', with values: ' + item.values);
              client.query(item.query, item.values, function(err, result) {
                if(err){
                  callback(err);
                } else {
                  console.log('Query processed successfully, result: ' + JSON.stringify(result));
                  callback();
                }
              });
            }, function(err) {
                if (err) {
                  console.log('Transaction rolling back due to error: ' + JSON.stringify(err));
                  module.exports.rollback(client, done, cb);
                } else {
                  if (process.env.NODE_ENV === 'test') {
                    cb(null, {client: client, done: done});
                  } else {
                    client.query('COMMIT', done);
                    cb(null, 'Transaction completed successfully');
                  }
                }
            });
          }
        });
      }
    });
  },

  rollback: function(client, done, cb) {
    client.query('ROLLBACK', function(err) {
      done(err);
      cb(new Error('Transaction rolled back'));
    });
  }

};
