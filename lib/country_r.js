'use strict';

var db = require('./database');
var async = require('async');

module.exports = {

  all: function(done) {
    async.waterfall([
      function(callback) {
        db.getConnection(function(err, client) {
          callback(null, client);
        });
      },
      function(client, callback) {
        client.query('SELECT code, name, continent FROM country', [], function(err, result) {
          callback(null, client, result.rows);
        });
      },
      function(client, rows, callback) {
        client.commit(function() {
          callback(null, client, rows);
        });
      }
    ], function(queryErr, client, rows) {
      if(queryErr) {
        client.rollback(function(rollbackErr) {
          if(rollbackErr) {
            done(rollbackErr);
          } else {
            done(queryErr);
          }
        });
      } else {
        done(null, rows);
      }
    });
  },

  create: function(country, callback) {
    var query = 'INSERT INTO country(code, name, continent, region, surfacearea, population, localname, governmentform, code2) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';
    var values = [country.code, country.name, country.continent, country.region, 100, 100, 'foo', 'foo', country.code2];
  }

};