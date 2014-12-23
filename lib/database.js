'use strict';

var pg = require('pg');
pg.defaults.poolSize = process.env.DB_POOL_SIZE;

var connectionString = ['postgres://',
  process.env.DB_USER, ':',
  process.env.DB_PSWD, '@',
  process.env.DB_HOST, ':',
  process.env.DB_PORT, '/',
  process.env.DB_NAME ].join('');

var releaseErroredConnection = function(done) {
  done(true);
};

module.exports = {

  // TODO: extract rollback and commit functions at top of this file
  getConnection: function(done) {
    pg.connect(connectionString, function(err, client, endConnection) {
      if(err) {
        releaseErroredConnection(endConnection);
        done(err);
      } else {
        client.query('BEGIN', function(err) {
          if (err) {
            console.log('database BEGIN err: ' + err);
            releaseErroredConnection(endConnection);
            done(err);
          } else {
            console.log('database BEGIN success');
            client.rollback = function(callback) {
              client.query('ROLLBACK', function(err) {
                if (err) {
                  releaseErroredConnection(endConnection);
                  callback(err);
                } else {
                  endConnection();
                  callback(null);
                }
              });
            };
            client.commit = function(callback) {
              client.query('COMMIT', function(err) {
                if (err) {
                  releaseErroredConnection(endConnection);
                  callback(err);
                } else {
                  endConnection();
                  callback(null);
                }
              });
            };
            done(null, client);
          }
        });
      }
    });
  },

  shutdown: function() {
    console.log('=== SHUTDOWN ===');
    pg.end();
  }

};
