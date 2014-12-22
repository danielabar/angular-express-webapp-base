'use strict';

var db = require('./database');

var all = function(callback) {
  var query = 'SELECT code, name, continent FROM country';
  db.query(query, [], function(err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
};

var create = function(country, callback) {
  var queriesAndValues = [{
    query: 'INSERT INTO country(code, name, continent, region, surfacearea, population, localname, governmentform, code2) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
    values: [country.code, country.name, country.continent, country.region, 100, 100, 'foo', 'foo', country.code2]
  }];
  db.transaction(queriesAndValues, function(err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
};

var one = function(code, callback) {
  var query = 'SELECT code, name, continent FROM country WHERE code = $1';
  db.query(query, [code], function(err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
};

module.exports.all = all;
module.exports.create = create;
module.exports.one = one;