'use strict';

var dao = require('./dao');

var all = function(callback) {
  var query = 'SELECT code, name, continent FROM country';
  dao.query(query, [], function(err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
};

var one = function(code, callback) {
  var query = 'SELECT code, name, continent FROM country WHERE code = $1';
  dao.query(query, [code], function(err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
};

module.exports.all = all;
module.exports.one = one;