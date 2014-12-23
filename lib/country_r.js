'use strict';

var db = require('./database');
var async = require('async');

var executeOne = function(statement, params, cb) {
  async.waterfall([
      // Open connection
      function(callback) {
        db.getConnection(function(err, client) {
          if (err) {
            console.log('Waterfall opened connection and got error');
            err.client = client;
            callback(err);
          } else {
            console.log('Waterfall opened connection successfully');
            callback(null, client);
          }
        });
      },
      // Execute query
      function(client, callback) {
        console.log('Waterfall about to execute query');
        client.query(statement, params, function(err, result) {
          console.log('Waterfall just inside client.query callback');
          if (err) {
            console.log('Waterfall executed query and got error');
            err.client = client;
            callback(err);
          } else {
            console.log('Waterfall executed query successfully');
            callback(null, client, result);
          }
        });
      },
      // Commit
      function(client, result, callback) {
        client.commit(function(err) {
          if(err) {
            console.log('Waterfall executed commit and got error');
            err.client = client;
            callback(err);
          } else {
            console.log('Waterfall executed commit successfully');
            callback(null, client, result);
          }
        });
      }
      // Rollback if error, otherwise return result
    ], function(queryErr, client, result) {
      if(queryErr) {
        console.log('Waterfall detected queryErr, about to rollback, queryErr.client: ' + queryErr.client);
        queryErr.client.rollback(function(rollbackErr) {
          if(rollbackErr) {
            console.log('Waterfall rollback encountered err: ' + rollbackErr);
            cb(rollbackErr);
          } else {
            console.log('Waterfall rollback successful, calling back with queryErr: ' + queryErr);
            cb(queryErr);
          }
        });
      } else {
        console.log('Waterfall successful, calling back with result: ' + result);
        cb(null, result);
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