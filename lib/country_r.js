'use strict';

var db = require('./database');
var async = require('async');

module.exports = {

  all: function(callback) {
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
      function(client, rows) {
        client.commit(function() {
          callback(null, rows);
        });
      }
    ], function(err, rows) {
      if(err) {
        callback(err);
      } else {
        callback(null, rows);
      }
    });
  }

};