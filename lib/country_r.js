'use strict';

var winston = require('winston');
var logger = winston.loggers.get('resource');

module.exports = {

  all: function(client, done) {
    client.query('SELECT code, name, continent FROM country', [], done);
  },

  create: function(client, country, done) {
    client.query(
      'INSERT INTO country(code, name, continent, region, surfacearea, population, localname, governmentform, code2) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING code',
      [country.code, country.name, country.continent, country.region, 100, 100, 'foo', 'foo', country.code2],
      function(err, result) {
        if (err) {
          logger.error('Could not create country.', {reason: err, stack: err.stack});
          done(err);
        } else {
          done(null, result);
        }
      }
    );
  },

  findByCode: function(client, code, done) {
    client.query(
      'SELECT code, name, continent FROM country where code = $1',
      [code],
      function(err, result) {
        if (err) {
          logger.error('Could not find country by code: ' + code + '.', {reason: err, stack: err.stack});
          done(err);
        } else {
          done(null, result);
        }
      }
    );
  }

};