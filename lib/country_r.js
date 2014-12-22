'use strict';

var db = require('./database');
var async = require('async');

var executeOne = function(statement, params, cb) {
  async.waterfall([
      // Open connection
      function(callback) {
        db.getConnection(function(err, client) {
          callback(null, client);
        });
      },
      // Execute query
      function(client, callback) {
        client.query(statement, params, function(err, result) {
          callback(null, client, result.rows);
        });
      },
      // Commit
      function(client, rows, callback) {
        client.commit(function() {
          callback(null, client, rows);
        });
      }
      // Rollback if error, otherwise return result
    ], function(queryErr, client, rows) {
      if(queryErr) {
        client.rollback(function(rollbackErr) {
          if(rollbackErr) {
            cb(rollbackErr);
          } else {
            cb(queryErr);
          }
        });
      } else {
        cb(null, rows);
      }
    });
};

module.exports = {

  all: function(done) {
    executeOne('SELECT code, name, continent FROM country', [], done);
  },

  create: function(country, done) {
    executeOne(
      'INSERT INTO country(code, name, continent, region, surfacearea, population, localname, governmentform, code2) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [country.code, country.name, country.continent, country.region, 100, 100, 'foo', 'foo', country.code2],
      done);
  }

};