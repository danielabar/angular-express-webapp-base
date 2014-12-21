'use strict';

var countryDao = require('./countryDao');

// TODO Log the error (decide on a logging lib)

var all = function(req, res) {
  countryDao.all(function(err, result) {
    if (err) {
      res.status(500).send('An error occurred getting all countries');
    } else {
      res.json(result.rows);
    }
  });
};

var create = function(req, res) {
  var country = req.body;   // TODO Server side sanitizing and validation before passing user data to dao
  countryDao.create(country, function(err, result) {
    if (err) {
      // TODO Distinguish between server/database errors and user errors due to bad data such as missing required or constraint violations
      res.status(500).send('An error occurred inserting country');
    } else {
      console.log('Country created successfully, result: ' + result);
      res.status(201).end();
    }
  });
};

var one = function(req, res) {
  var code = req.params.code;
  countryDao.one(code, function(err, result) {
    if (err) {
      res.status(500).send('Could not get country by code: ' + code);
    } else {
      if (result.rows && result.rows.length === 0) {
        res.status(404).send('Cound not find country by code: ' + code);
      } else {
        res.json(result.rows);
      }
    }
  });
};

module.exports.all = all;
module.exports.create = create;
module.exports.one = one;