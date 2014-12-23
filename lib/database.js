'use strict';

var winston = require('winston');
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
            releaseErroredConnection(endConnection);
            done(err);
          } else {
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
    winston.warn('POSTGRES END');
    pg.end();
  },

  // borrowed from Ravel framework by Sean McIntyre (GPL)
  transactionMiddleware: function(req, res, next) {
    module.exports.getConnection(function(err, client) {
      if (err) {
        console.log('Could not retrieve connection for middleware transaction');
        req.status(500).end();
      } else {
        // console.log('Populated request object with middleware transaction');
        req.transaction = client;

        var buildTransactionEnder = function(fToOverride) {
          return function(body) {
            if (req.transaction) {
              if (!process.env.ALWAYS_ROLLBACK && res.statusCode >= 200 && res.statusCode < 300) {
                // console.log('Attempting to commit middleware transaction');
                req.transaction.commit(function(err) {
                  if (err) {
                    console.log('Failed to commit middleware transaction');
                    res.status(500).end();
                  } else {
                    // console.log('Successfully committed middleware transaction');
                    fToOverride.apply(res, [body]);
                  }
                });
              } else {
                console.log('Attempting to rollback middleware transaction');
                req.transaction.rollback(function(err) {
                 if (err) {
                   console.log('Failed to rollback middleware transaction');
                   res.status(500).end();
                 } else {
                   // console.log('Successfully rolled back middleware transaction');
                   fToOverride.apply(res, [body]);
                 }
               });
              }
            }// if (req.transaction)
          };
        };

        res.end = buildTransactionEnder(res.end);

        next();
      }
    });
  }

};
