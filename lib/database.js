'use strict';

var winston = require('winston');
var logger = winston.loggers.get('db');

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
            logger.error('BEGIN transaction error', {reason: err, stack: err.stack});
            releaseErroredConnection(endConnection);
            done(err);
          } else {
            client.rollback = function(callback) {
              client.query('ROLLBACK', function(err) {
                if (err) {
                  logger.error('ROLLBACK transaction error', {reason: err, stack: err.stack});
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
                  logger.error('COMMIT transaction error', {reason: err, stack: err.stack});
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
    logger.warn('Calling Postgres end to drain pool.');
    pg.end();
  },

  // borrowed from Ravel framework by Sean McIntyre (GPL)
  transactionMiddleware: function(req, res, next) {
    module.exports.getConnection(function(err, client) {
      if (err) {
        logger.error('Could not retrieve connection for middleware transaction.', {reason: err, stack: err.stack});
        res.status(500).end();
      } else {
        logger.debug('Populated request object with middleware transaction.');
        req.transaction = client;

        var buildTransactionEnder = function(fToOverride) {
          return function(body) {
            if (req.transaction) {
              if (!process.env.ALWAYS_ROLLBACK && res.statusCode >= 200 && res.statusCode < 400) {
                req.transaction.commit(function(err) {
                  if (err) {
                    logger.error('Failed to commit middleware transaction.', {reason: err, stack: err.stack});
                    res.status(500).end();
                  } else {
                    fToOverride.apply(res, [body]);
                  }
                });
              } else {
                req.transaction.rollback(function(err) {
                 if (err) {
                   logger.error('Failed to rollback middleware transaction.', {reason: err, stack: err.stack});
                   res.status(500).end();
                 } else {
                   logger.warn('Successfully rolled back middleware transaction.');
                   fToOverride.apply(res, [body]);
                 }
               });
              }
            }
          };
        };

        res.end = buildTransactionEnder(res.end);

        next();
      }
    });
  }

};
