'use strict';

var pg = require('pg');
pg.defaults.poolSize = process.env.DB_POOL_SIZE;

var connectionString = ['postgres://',
  process.env.DB_USER, ':',
  process.env.DB_PSWD, '@',
  process.env.DB_HOST, ':',
  process.env.DB_PORT, '/',
  process.env.DB_NAME ].join('');

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
}

// var executeQuery = function(query, params, callback) {

//   pg.connect(connectionString, function(err, client, done) {
//     if(err) {
//       callback(err);
//       done(err);     // release the client
//     } else {
//       client.query(query, params, function(err, result) {
//         if(err) {
//           callback(err);
//           done(err);   // release the client
//         } else {
//           callback(null, result);
//           done();   // release the client to be reused
//         }
//       });
//     }
//   });

// };

// module.exports.executeQuery = executeQuery;